import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/AddCsReportModal.css';

const AddCsReportModal = ({ isOpen, onClose, onSubmit, csSlipId }) => {
    const initialCsReportState = {
        dateOfCs: "",
        timeIn: "",
        timeOut: "",
        hoursCompleted: "",
        natureOfWork: "",
        status: "Undone",
        remarks: ""
    };

    const [newCsReport, setNewCsReport] = useState(initialCsReportState);

    //gets the errors
    const [errors, setErrors] = useState({});

    //input validations
    const validate = () => {
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const specialCharPattern = /[^a-zA-Z0-9 ]/; // Pattern to detect special characters
        const numberPattern = /[0-9]/; // Pattern to detect numbers
        let validationErrors = {};

        if (!newCsReport.dateOfCs) {
            validationErrors.dateOfCs = "Date of CS is required";
        } else if (newCsReport.dateOfCs > currentDate) {
            validationErrors.dateOfCs = "Date of CS cannot be in the future";
        }

        if (!newCsReport.timeIn) {
            validationErrors.timeIn = "Time In is required";
        }

        if (!newCsReport.timeOut) {
            validationErrors.timeOut = "Time Out is required";
        }

        if (newCsReport.timeIn && newCsReport.timeOut && newCsReport.timeIn >= newCsReport.timeOut) {
            validationErrors.timeOut = "Time Out should be after Time In";
        }

        if (!newCsReport.natureOfWork) {
            validationErrors.natureOfWork = "Nature of Work is required";
        } else if (specialCharPattern.test(newCsReport.natureOfWork)) {
            validationErrors.natureOfWork = "Nature of Work should not contain special characters";
        } else if (numberPattern.test(newCsReport.natureOfWork)) {
            validationErrors.natureOfWork = "Nature of Work should not contain numbers";
        }

        if (!newCsReport.remarks) {
            validationErrors.remarks = "Remarks are required";
        } else if (specialCharPattern.test(newCsReport.remarks)) {
            validationErrors.remarks = "Remarks should not contain special characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCsReport({ ...newCsReport, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(csSlipId, newCsReport);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-box" overlayClassName="modal-overlay">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Add CS Report</h2>
            <form onSubmit={handleSubmit} className='add-form-container'>
                <div className="form-group">
                    <label>Date of CS:</label>
                    <input type="date" name="dateOfCs" value={newCsReport.dateOfCs} onChange={handleInputChange} required />
                    {errors.dateOfCs && <p className="error">{errors.dateOfCs}</p>}
                </div>
                <div className="form-group">
                    <label>Time In:</label>
                    <input type="time" name="timeIn" value={newCsReport.timeIn} onChange={handleInputChange} required />
                    {errors.timeIn && <p className="error">{errors.timeIn}</p>}
                </div>
                <div className="form-group">
                    <label>Time Out:</label>
                    <input type="time" name="timeOut" value={newCsReport.timeOut} onChange={handleInputChange} required />
                    {errors.timeOut && <p className="error">{errors.timeOut}</p>}
                </div>
                <div className="form-group">
                    <label>Nature of Work:</label>
                    <input type="text" name="natureOfWork" value={newCsReport.natureOfWork} onChange={handleInputChange} required />
                    {errors.natureOfWork && <p className="error">{errors.natureOfWork}</p>}
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={newCsReport.status} onChange={handleInputChange} required>
                        <option value="Undone">Undone</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Remarks:</label>
                    <textarea name="remarks" value={newCsReport.remarks} onChange={handleInputChange}></textarea>
                    {errors.remarks && <p className="error">{errors.remarks}</p>}
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddCsReportModal;
