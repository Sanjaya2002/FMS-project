import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/axios';
import { useNavigate } from "react-router-dom";


const DriverOverview = () => {

  const [fines, setFines] = useState([]);
  const [selectedFines, setSelectedFines] = useState([]);
  const [hoveredFine, setHoveredFine] = useState(null);
  const token = localStorage.getItem('token');
  const [unPaidFines, setUnPaidFines] = useState([]);
  const [resentPayments, setResentPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUnpaidFines();
      fetchRecentPayments();
      fetchNotifications();
    }
  }, [navigate, token]);


  // Fetch fines from backend on component mount
  useEffect(() => {
    async function fetchFines() {
      try {
        const response = await api.get('/get-my-fines');  // Backend route to get all fines
        setFines(response.data);
      } catch (error) {
        console.error('Error fetching fines:', error);
      }
    }
    fetchFines();
  }, []);

  // Toggle selection of a fine by id
  const toggleFine = (fineId) => {
    setSelectedFines((prevSelected) =>
      prevSelected.includes(fineId)
        ? prevSelected.filter((id) => id !== fineId)
        : [...prevSelected, fineId]
    );
  };

  // Select or deselect all fines
  // const toggleSelectAll = () => {
  //   setSelectedFines(
  //     fines.length === selectedFines.length ? [] : fines.map((fine) => fine.id)
  //   );
  // };

  const payFines = () => {
    navigate('/DriverPayment');
  }

  // Handler for pay button
  const handlePay = async () => {
    if (selectedFines.length === 0) {
      alert('Please select fines to pay.');
      return;
    }

    try {
      const response = await api.post('/process-payment', {
        fineIds: selectedFines,
      });

      if (response.status === 200) {
        alert('Payment successful!');
        // Refresh fines after payment to update status
        fetchUnpaidFines();
        setSelectedFines([]);
      }
    } catch (error) {
      console.error('Payment failed:', error.response?.data || error.message);
      alert('Payment failed. Please try again.');
    }
  };

  const handleLink = () =>{
    navigate('/DriverMyFines');
  }

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

  const fetchRecentPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/get-recently-paid-fines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      setResentPayments(data);
    } catch (err) {
      console.error("Failed to fetch unPaidFines", err);
      setError("Failed to load unPaidFines. Please try again.");
      setResentPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/driver/notifications/for-today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      setResentPayments(data);
    } catch (err) {
      console.error("Failed to fetch unPaidFines", err);
      setError("Failed to load unPaidFines. Please try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="search-section container mb-5 justify-content-center align-items-center"
      style={{
        backgroundColor: '#d3e2fd',
        padding: '1rem',
        marginLeft: window.innerWidth < 576 ? '2rem' : '3rem',
      }}
    >

      <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold m-0">Overview Fines</h4>
          <button
            className="btn btn-dark px-2 py-2"
            style={{ width: '150px', borderRadius: '10px', fontSize: '0.88rem' }}
            onClick={payFines}>
            Pay All Fines
          </button>
        </div>

        <div className="bg-white rounded-4 p-3">
          <div className="row">
            <div className="col-md-12 mb-3">
              {unPaidFines.length === 0 && !loading ? (
                  <div className="bg-primary-subtle rounded-4 p-2 mb-2">No Recent Fines.</div>
              ) : (
                  unPaidFines.map((item) => (
                      item.length < 4 && (
                          <div key={item.id} className="d-flex mb-2">
                            <div className="d-flex bg-primary-subtle rounded-4 px-3 py-2">
                              {item.fine_name}
                            </div>
                              <button className="d-flex btn btn-dark mx-2 rounded-3" style={{ width: 'fit-content' }} onClick={handlePay}>
                                Pay
                              </button>
                          </div>

                      )
                  ))
              )}
            </div>
          </div>
        </div>

        {fines.map((fine) => (
          <div
            key={fine.id}
            className="d-flex align-items-center justify-content-between bg-primary-subtle rounded-pill px-3 py-2 mb-3 position-relative"
          >
            <span className="fw-semibold">{fine.name || 'Unknown Fine'}</span>

            <div className="d-flex align-items-center position-relative" style={{ gap: '1rem' }}>
              <span className="fs-4" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredFine(fine.id)} onMouseLeave={() => setHoveredFine(null)}>⋮
              </span>

              {/*{hoveredFine === fine.id && (*/}
              {/*  <div*/}
              {/*    className="position-absolute p-2 rounded-3 shadow-sm bg-white border"*/}
              {/*    style={{*/}
              {/*      top: '30px',*/}
              {/*      right: '0',*/}
              {/*      zIndex: 10,*/}
              {/*      minWidth: '200px',*/}
              {/*      fontSize: '0.9rem',*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <div>*/}
              {/*      <strong>Violation:</strong> {fine.violation || 'N/A'}*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <strong>Date:</strong> {fine.date || 'N/A'}*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <strong>Fine Amount:</strong> {fine.amount || 'N/A'}*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <strong>Status:</strong>{' '}*/}
              {/*      {fine.paid_at ? 'Paid' : 'Unpaid'}*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*)}*/}

              <input
                className="form-check-input rounded-circle border-secondary"
                type="checkbox"
                checked={selectedFines.includes(fine.id)}
                onChange={() => toggleFine(fine.id)}
                id={`checkbox-${fine.id}`}
              />
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between">
          <button className="btn btn-dark px-3 py-1 rounded-3" style={{ width: 'fit-content' }} onClick={handleLink}>
            View all fines
          </button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-4">
        <h5 className="fw-bold mb-3">Payment Status</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <h6 className="small">Recent Payments</h6>
            {/*<div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>*/}
            {/*<div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>*/}
            {/*<div className="bg-primary-subtle rounded-4 p-3"></div>*/}
            {resentPayments.length === 0 && !loading ? (
                <div className="bg-primary-subtle rounded-4 p-2 mb-2">No Recent Payments.</div>
                // <div className="d-flex mb-2">
                //   <div className="d-flex bg-primary-subtle rounded-4 px-3 py-2">
                //     No Pending Payment Fines in the last 7 days.
                //   </div>
                //   <button className="d-flex btn btn-dark mx-2 rounded-3" style={{ width: 'fit-content' }} onClick={handlePay}>
                //     Pay
                //   </button>
                // </div>
            ) : (
                resentPayments.map((item) => (
                    item.length < 4 && (
                        <div key={item.id} className="d-flex mb-2">
                          <div className="d-flex bg-primary-subtle rounded-4 px-3 py-2">
                            {item.fine_name}
                          </div>
                        </div>

                    )
                ))
            )}
          </div>
          <div className="col-md-6">
            <h6 className="small">Notifications</h6>
            {/*<div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>*/}
            {/*<div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>*/}
            {/*<div className="bg-primary-subtle rounded-4 p-3"></div>*/}
            {notifications.length === 0 && !loading ? (
                <div className="bg-primary-subtle rounded-4 p-2 mb-2">No Notifications.</div>
                // <div className="d-flex mb-2">
                //   <div className="d-flex bg-primary-subtle rounded-4 px-3 py-2">
                //     No Pending Payment Fines in the last 7 days.
                //   </div>
                //   <button className="d-flex btn btn-dark mx-2 rounded-3" style={{ width: 'fit-content' }} onClick={handlePay}>
                //     Pay
                //   </button>
                // </div>
            ) : (
                notifications.map((item) => (
                    item.length < 4 && (
                        <div key={item.id} className="d-flex mb-2">
                          <div className="d-flex bg-primary-subtle rounded-4 px-3 py-2">
                            {item.data.message.length > 11 ? item.data.message.slice(0, 10) + '...' : item.data.message}
                          </div>
                        </div>

                    )
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverOverview;
