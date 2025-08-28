import React, { useEffect, useState } from 'react';
import api from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";

const DriverPayment = () => {

  const token = localStorage.getItem('token');
  const [unPaidFines, setUnPaidFines] = useState([]);
  const [paidFines, setPaidFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFines, setSelectedFines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUnpaidFines();
      fetchPaidFines();
    }
  }, [navigate, token]);

  // Fetch unpaid fines from backend
  const fetchUnpaidFines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/get-all-unpaid-fines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      setUnPaidFines(data);
    } catch (err) {
      console.error("Failed to fetch unPaidFines", err);
      setError("Failed to load unPaidFines. Please try again.");
      setUnPaidFines([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch paid fines from backend
  const fetchPaidFines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/get-all-unpaid-fines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      setPaidFines(data);
    } catch (err) {
      console.error("Failed to fetch paid fines", err);
      setError("Failed to load paid fines. Please try again.");
      setPaidFines([]);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid date" : `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
    } catch (e) {
      return "Invalid date";
    }
  };

  const handlePayment = async () => {
    if (selectedFines.length === 0) {
      alert('Please select fines to pay.');
      return;
    }

    try {
      // Process payment for all selected fines
      for (const fineId of selectedFines) {
        const response = await api.post('/process-payment',
            { fineIds: [fineId] },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
        );
        if(response.status === 200) {
          console.log("Payment processed successfully");
        }
      }

      // Update unpaid fines state to reflect payments
      setUnPaidFines(prev =>
          prev.map(msg => selectedFines.includes(msg.id) ? { ...msg, paid_at: new Date() } : msg)
      );
      setSelectedFines([]);

    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      alert('Failed to process payment');
    }
  };

  const handleFineSelection = (fineId) => {
    setSelectedFines((prevSelected) =>
        prevSelected.includes(fineId)
            ? prevSelected.filter((id) => id !== fineId)
            : [...prevSelected, fineId]
    );
  };

  return (
      <div
          className="search-section container mb-5 justify-content-center align-items-center"
          style={{
            backgroundColor: "#d3e2fd",
            padding: "1rem",
            marginLeft: window.innerWidth < 576 ? "2rem" : "3rem"}}>

        <h4 className="fw-bold mb-3">Payment</h4>

        {loading && <div className="text-center py-3">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-5">
          <div className="d-flex align-items-center">
            <h6 className="d-flex justify-content-start fw-semibold">Unpaid List</h6>
            <div className="d-flex justify-content-end" style={{width:"18%"}}>
              <button className="btn btn-dark px-0 mb-2" onClick={handlePayment}>
                Pay Selected Fines
              </button>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3">
            <table className="table table-borderless align-middle mb-0">
              <thead>
              <tr className="fw-semibold text-secondary text-center">
                <th className="col-1">Select Fine</th>
                <th className="col-1">Fine ID</th>
                <th className="col-2">Fine</th>
                <th className="col-2">Police Station</th>
                <th className="col-2">Officer Number</th>
                <th className="col-1">Issued Date</th>
                <th className="text-danger col-1">Deadline</th>
                <th className="col-1">Pay</th>
              </tr>
              </thead>
              <tbody className="text-center">
              {unPaidFines.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">No Pending Payment Fines in the last 14 days.</td>
                  </tr>
              ) : (
                  unPaidFines.map((item) => (
                      <tr key={item.id || Math.random()}>
                        <td className="col-1">
                          <input
                              type="checkbox"
                              checked={selectedFines.includes(item.id)}
                              onChange={() => handleFineSelection(item.id)}
                          />
                        </td>
                        <td className="col-2">{item.fine_id}</td>
                        <td className="col-2">{item.fine_name}</td>
                        <td className="col-2">{item.station}</td>
                        <td className="col-2">{item.officer}</td>
                        <td className="col-1">{formatDate(item.issued_at)}</td>
                        <td className="text-danger col-1">{formatDate(item.expires_at)}</td>
                        <td className="col-1">
                          <button onClick={handlePayment}>Pay</button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paid List */}
        <div className="mb-5">
          <h6 className="fw-semibold">Paid List</h6>
          <div className="bg-white rounded-4 shadow-sm p-3">
            <table className="table table-borderless align-middle mb-0">
              <thead>
              <tr className="fw-semibold text-secondary text-center">
                <th className="col-2">Fine ID</th>
                <th className="col-2">Fine</th>
                <th className="col-2">Police Station</th>
                <th className="col-2">Officer Number</th>
                <th className="col-2">Issued Date</th>
                <th className="col-2">Paid Date</th>
              </tr>
              </thead>
              <tbody className="text-center">
              {paidFines.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">No Payment Received in the last 14 days.</td>
                  </tr>
              ) : (
                  paidFines.map((item) => (
                      <tr key={item.id || Math.random()}>
                        <td className="col-2">{item.fine_id}</td>
                        <td className="col-2">{item.fine_name}</td>
                        <td className="col-2">{item.station}</td>
                        <td className="col-2">{item.station}</td>
                        <td className="col-2">{formatDate(item.issued_at)}</td>
                        <td className="col-2">{formatDate(item.paid_at)}</td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
  );
};

export default DriverPayment;
