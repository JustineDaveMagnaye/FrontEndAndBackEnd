import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/AddCsReportModal.css';

const AddCsReportModal = ({ isOpen, onClose, onSubmit }) => {
    const currentDate = new Date();

    const [newCsReport, setNewCsReport] = useState({
        dateOfCs: "",
        timeIn: "",
        timeOut: "",
        hoursCompleted: "",
        natureOfWork: "",
        status: "",
        remarks: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCsReport({ ...newCsReport, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(newCsReport);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Add CS Report</h2>
            <form onSubmit={handleSubmit} className='form-container'>
                <div className="form-group">
                    <label>Date of CS:</label>
                    <input type="date" name="dateOfCs" value={newCsReport.dateOfCs} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Time In:</label>
                    <input type="time" name="timeIn" value={newCsReport.timeIn} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Time Out:</label>
                    <input type="time" name="timeOut" value={newCsReport.timeOut} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Nature of Work:</label>
                    <input type="text" name="natureOfWork" value={newCsReport.natureOfWork} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <input type="text" name="status" value={newCsReport.status} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Remarks:</label>
                    <textarea name="remarks" value={newCsReport.remarks} onChange={handleInputChange}></textarea>
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddCsReportModal;
