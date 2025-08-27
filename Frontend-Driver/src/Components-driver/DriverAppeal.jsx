import React, { useState ,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineExclamationCircle, AiOutlineFileText, AiOutlineCheckCircle } from 'react-icons/ai'; // Import icons
import { Tooltip } from 'bootstrap';

const DriverAppeal = () => {
  const [formData, setFormData] = useState({
    fineId: '',
    issueType: '',
    description: '',
    evidence: null,
  });

  const appealStatus = [
    { date: '2025-02-23', status: 'Pending' },
    { date: '2024-08-01', status: 'In Review' },
    { date: '2023-02-27', status: 'Resolved' },
    { date: '2023-04-10', status: 'Resolved' },
    { date: '2022-09-06', status: 'Resolved' },
  ];

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
    <div className="container-fluid py-5" style={{ backgroundColor: '#a5c8f7', minHeight: '100vh' }}>
      <div className="container d-flex flex-column flex-md-row gap-4">
        {/* Appeal Form */}
        <div className="bg-white p-4 rounded-4 shadow-sm flex-grow-1">
          <h5 className="fw-semibold mb-3">Appeal</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Fine ID :</label>
              <input type="text" className="form-control" name="fineId" value={formData.fineId} onChange={handleChange} required/>
            </div>

            <div className="mb-3">
              <label className="form-label">Issue Type :</label>
              <input
                type="text"
                className="form-control"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              />
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

            <div className="mb-4">
              <label className="form-label d-block">Upload Evidence :</label>
              <input
                type="file"
                className="form-control w-auto d-inline"
                name="evidence"
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary px-4">Submit</button>
              <button type="button" className="btn btn-secondary px-4" onClick={() => setFormData({ fineId: '', issueType: '', description: '', evidence: null })}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Appeal Status */}
        <div className="bg-white p-4 rounded-4 shadow-sm" style={{ width: '300px', maxHeight: '500px', overflowY: 'auto' }}>
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
              Icon = AiOutlineCheckCircle; // Resolved status icon
            } else if (item.status === 'In Review') {
              statusColor = 'text-primary';
              Icon = AiOutlineFileText; // In Review status icon
            }

            return (
              <div key={index} className="d-flex align-items-center mb-4">
                <div className="text-center me-3">
                  <h4 className="mb-0 fw-bold">{day}</h4>
                  <small className="d-block">{month}</small>
                  <small className="d-block">{year}</small>
                </div>
                <div className="me-2">
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`Fine ID: ${item.fineId}\nViolation: ${item.violation}`}
                    style={{ cursor: 'pointer' }}
                  >
                    ⋮
                  </span>
                </div>
        <div className="flex-grow-1 d-flex align-items-center">
                  <Icon className="me-2" size={20} />
                </div>
                <div className="flex-grow-1">
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
