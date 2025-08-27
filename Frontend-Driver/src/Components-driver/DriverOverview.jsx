import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/axios';

// For development/testing only (set token in localStorage)
localStorage.setItem('token', '22|rltHcXuNiFu5sbTri43YCfA5173PsHWNiqjbFjKd64779309');

const DriverOverview = () => {
 
  const [fines, setFines] = useState([]);
  const [selectedFines, setSelectedFines] = useState([]);
  const [hoveredFine, setHoveredFine] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const toggleSelectAll = () => {
    setSelectedFines(
      fines.length === selectedFines.length ? [] : fines.map((fine) => fine.id)
    );
  };

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
        const updatedFines = await api.get('/get-my-fines');
        setFines(updatedFines.data);
        setSelectedFines([]);
      }
    } catch (error) {
      console.error('Payment failed:', error.response?.data || error.message);
      alert('Payment failed. Please try again.');
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
            className="btn btn-dark px-3 py-1"
            style={{ width: 'fit-content', borderRadius: '10px', fontSize: '0.85rem' }}
            onClick={toggleSelectAll}
          >
            Select All
          </button>
        </div>

        {fines.map((fine) => (
          <div
            key={fine.id}
            className="d-flex align-items-center justify-content-between bg-primary-subtle rounded-pill px-3 py-2 mb-3 position-relative"
          >
            <span className="fw-semibold">{fine.name || 'Unknown Fine'}</span>

            <div
              className="d-flex align-items-center position-relative"
              style={{ gap: '1rem' }}
            >
              <span
                className="fs-4"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredFine(fine.id)}
                onMouseLeave={() => setHoveredFine(null)}
              >
                ⋮
              </span>

              {hoveredFine === fine.id && (
                <div
                  className="position-absolute p-2 rounded-3 shadow-sm bg-white border"
                  style={{
                    top: '30px',
                    right: '0',
                    zIndex: 10,
                    minWidth: '200px',
                    fontSize: '0.9rem',
                  }}
                >
                  <div>
                    <strong>Violation:</strong> {fine.violation || 'N/A'}
                  </div>
                  <div>
                    <strong>Date:</strong> {fine.date || 'N/A'}
                  </div>
                  <div>
                    <strong>Fine Amount:</strong> {fine.amount || 'N/A'}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    {fine.paid_at ? 'Paid' : 'Unpaid'}
                  </div>
                </div>
              )}

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
          <button className="btn btn-dark px-3 py-1" style={{ width: 'fit-content' }}>
            View all fines
          </button>
          <button
            className="btn btn-dark px-3 py-1"
            style={{ width: 'fit-content' }}
            onClick={handlePay}
          >
            Pay
          </button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-4">
        <h5 className="fw-bold mb-3">Payment Status</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <h6 className="small">Recent Payments</h6>
            <div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>
            <div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>
            <div className="bg-primary-subtle rounded-4 p-3"></div>
          </div>
          <div className="col-md-6">
            <h6 className="small">Notifications</h6>
            <div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>
            <div className="bg-primary-subtle rounded-4 p-3 mb-2"></div>
            <div className="bg-primary-subtle rounded-4 p-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverOverview;
