import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import api from '../api/axios';
import { Table, Button, Spinner } from 'react-bootstrap';

const ManageAppeal = () => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ message: '', variant: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);

  const handleShowMore = (appeal) => {
    setSelectedAppeal(appeal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppeal(null);
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', variant: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchAppeals = async () => {
    try {
      const response = await api.get('h-police/get-all-appeals');
      setAppeals(response.data.appealsToManage);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch data – using mock data.';
      setFeedback({ message: errorMessage, variant: 'danger' });

      // MOCK DATA
      //  const mockAppeals = [
      //    {
      //      id: 201,
      //      driver_user: { name: 'John Doe' },
      //      police_user: { name: 'Officer Smith' },
      //      appeal: { offense: 'Speeding', reason: 'Medical emergency', status: 'Pending' },
      //    },
      //    {
      //      id: 202,
      //      driver_user: { name: 'Jane Roe' },
      //      police_user: { name: 'Officer Brown' },
      //      appeal: { offense: 'Illegal Parking', reason: 'Erroneous ticket', status: 'Pending' },
      //    },
      //    {
      //      id: 203,
      //      driver_user: { name: 'Alex Rider' },
      //      police_user: { name: 'Officer Lee' },
      //      appeal: { offense: 'No Helmet', reason: 'Unaware of the rule', status: 'Pending' },
      //    },
      //  ];
      //  setAppeals(mockAppeals);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appealId) => {
    try {
      await api.post('h-police/accept-appeal', { appeal_id: appealId });
      setFeedback({ message: 'Appeal approved.', variant: 'success' });
      fetchAppeals();
    } catch (error) {
      setFeedback({ message: 'Error approving appeal.', variant: 'danger' });
    }
  };

  const handleDecline = async (appealId) => {
    try {
      await api.post('h-police/decline-appeal', { appeal_id: appealId });
      setFeedback({ message: 'Appeal declined.', variant: 'warning' });
      fetchAppeals();
    } catch (error) {
      setFeedback({ message: 'Error declining appeal.', variant: 'danger' });
    }
  };

  const filteredAppeals = appeals.filter((appeal) => {
    const driverName = appeal.driver_user?.name?.toLowerCase() || '';
    const officerName = appeal.police_user?.name?.toLowerCase() || '';
    const appealId = String(appeal.id);

    return (
      driverName.includes(searchTerm.toLowerCase()) ||
      officerName.includes(searchTerm.toLowerCase()) ||
      appealId.includes(searchTerm)
    );
  });

  return (
    <div className="search-section container" style={{ backgroundColor: "#d3e2fd" }}>
      <h3 className="fw-bold mb-3 text-center">Pending Appeal Requests</h3>

      {feedback.message && (
        <p style={{
          color:
            feedback.variant === 'success'
              ? 'green'
              : feedback.variant === 'danger'
              ? 'red'
              : feedback.variant === 'warning'
              ? 'orange'
              : 'black',
          fontSize: "small"
        }}>
          {feedback.message}
        </p>
      )}

      <div className="d-flex justify-content-center mb-3" style={{ width: "100%" }}>
        <div className="d-flex justify-content-center mb-3" style={{ marginTop: "2%", width: "85%" }}>
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            placeholder="Search by Driver or Officer..."
            style={{ fontSize: "small", width: "100%" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-info" style={{ width: "5%", color: "white", marginLeft: "3px" }}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Officer</th>
              <th>Offense</th>
              <th>Appeal Reason</th>
              <th>Status</th>
              <th>Approve</th>
              <th>Decline</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppeals.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No matching appeals found.</td>
              </tr>
            ) : (
              filteredAppeals.slice(0, 10).map((appeal, index) => (
                <tr key={appeal.id}>
                  <td>{index + 1}</td>
                  <td>{appeal.driver_user?.name}</td>
                  <td>{appeal.police_user?.name}</td>
                  <td>{appeal.appeal?.offense || 'N/A'}</td>
                  <td>{appeal.appeal?.reason || 'N/A'}</td>
                  <td>{appeal.appeal?.status || 'Pending'}</td>
                  <td>
                    <Button variant="success" size="sm" onClick={() => handleApprove(appeal.id)}>Accept</Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDecline(appeal.id)}>Decline</Button>
                  </td>
                  <td>
                    <a href="#" className="text-primary text-decoration-none" onClick={(e) => { e.preventDefault(); handleShowMore(appeal); }}>
                      view
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {showModal && selectedAppeal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content" style={{ width: "40%" }}>
            <div className="modal-header">
              <h5 className="modal-title">Appeal Details</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body" style={{ margin: "3%" ,marginLeft:"10%"}}>
              <input className="form-control mb-2" type="text" value={selectedAppeal.driver_user?.name} readOnly />
              <input className="form-control mb-2" type="text" value={selectedAppeal.police_user?.name} readOnly />
              <input className="form-control mb-2" type="text" value={selectedAppeal.appeal?.offense || 'N/A'} readOnly />
              <input className="form-control mb-2" type="text" value={selectedAppeal.appeal?.reason || 'N/A'} readOnly />
              <input className="form-control mb-2" type="text" value={selectedAppeal.appeal?.status || 'Pending'} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppeal;
