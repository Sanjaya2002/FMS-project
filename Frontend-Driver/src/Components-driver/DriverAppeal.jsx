import React, { useState ,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineExclamationCircle, AiOutlineFileText, AiOutlineCheckCircle } from 'react-icons/ai';
import { Tooltip } from 'bootstrap';
import api from "../api/axios.jsx";
import './Driver-styles.css'

const DriverAppeal = () => {
  const [formData, setFormData] = useState({
    fineId: '',
    issueType: '',
    description: '',
    evidence: null,
  });

  const token = localStorage.getItem('token');

  const [fines, setFines] = useState([]);

  const appealStatus = [
    { date: '2025-02-23', status: 'Pending' },
    { date: '2024-08-01', status: 'In Review' },
    { date: '2023-02-27', status: 'Resolved' },
    { date: '2023-04-10', status: 'Resolved' },
    { date: '2022-09-06', status: 'Resolved' },
  ];

  const fetchFines = async () => {
    try {
      const response = await api.get('/get-all-unpaid-fines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Ensure it's an array
      if (Array.isArray(response.data)) {
        setFines(response.data);
      } else if (Array.isArray(response.data.fines)) {
        setFines(response.data.fines);
      } else {
        console.error("Unexpected fine data format:", response.data);
        setFines([]);
      }
    } catch (error) {
      console.error("Error fetching fines:", error.response?.data || error.message);
      setFines([]);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Appeal submitted!');
  };

  return (
    <div className="container-fluid py-5 w-75 mb-5" style={{ backgroundColor: '#a5c8f7', minHeight: '80vh'}}>
      <div className="container d-flex flex-column flex-md-row gap-4">
        {/* Appeal Form */}
        <div className="bg-white p-4 rounded-4 shadow-sm flex-grow-1">
          <h5 className="fw-semibold mb-3">Appeal</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Fine ID :</label>
              <input
                type="text"
                className="form-control"
                name="fineId"
                value={formData.fineId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Issue Type :</label>
              <select
                className="form-select"  
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>-- Select a Fine --</option>
                {fines.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Description :</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* If you want to add file upload back later */}
            {/*<div className="mb-3">
              <label className="form-label d-block">Upload Evidence :</label>
              <input
                type="file"
                className="form-control"
                name="evidence"
                onChange={handleChange}
              />
            </div>*/}

            <div className="d-flex flex-column flex-md-row gap-3">
              <button type="submit" className="btn btn-primary w-100 w-md-50 px-4">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary w-100 w-md-50 px-4"
                onClick={() => setFormData({ fineId: '', issueType: '', description: '', evidence: null })}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>


        {/* Appeal Status */}
        <div
  className="bg-white p-4 rounded-4 shadow-sm"
  style={{ maxHeight: '500px', overflowY: 'auto', width: '100%', maxWidth: '400px' }}
>
  <h5 className="fw-semibold mb-3 border-bottom pb-2">Appeal Status</h5>

  {appealStatus.map((item, index) => {
    const dateObj = new Date(item.date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();

    let statusColor = 'text-warning';
    let Icon = AiOutlineExclamationCircle;
    if (item.status === 'Resolved') {
      statusColor = 'text-success';
      Icon = AiOutlineCheckCircle;
    } else if (item.status === 'In Review') {
      statusColor = 'text-primary';
      Icon = AiOutlineFileText;
    }

    return (
      <div
        key={index}
        className="d-flex flex-column flex-sm-row align-items-sm-center mb-4"
      >
        {/* Date */}
        <div className="text-center me-sm-3 mb-2 mb-sm-0">
          <h4 className="mb-0 fw-bold">{day}</h4>
          <small className="d-block">{month}</small>
          <small className="d-block">{year}</small>
        </div>

        {/* Tooltip Icon */}
        <div className="me-2 mb-2 mb-sm-0">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={`Fine ID: ${item.fineId}\nViolation: ${item.violation}`}
            style={{ cursor: 'pointer' }}
          >
            ⋮
          </span>
        </div>

        {/* Status Icon and Text */}
        <div className="d-flex align-items-center flex-grow-1 mb-2 mb-sm-0">
          <Icon className="me-2" size={20} />
          <span className={`fw-semibold ${statusColor}`}>{item.status}</span>
        </div>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
};

export default DriverAppeal;
