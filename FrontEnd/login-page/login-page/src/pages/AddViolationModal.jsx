import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/AddEditModal.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
    const [newViolation, setNewViolation] = useState({
        studentId: "",
        studentName: "",
        dateOfNotice: "",
        occurrence: "",
        disciplinaryAction: "",
        csHours: "",
        approvedBy: "",
        type: "",
        description: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewViolation({ ...newViolation, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newViolation);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Add Violation</h2>
            <form onSubmit={handleSubmit} className='form-container'>
                <div className="form-group">
                    <label>Student ID</label>
                    <input type="text" name="studentId" value={newViolation.studentId} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Student Name</label>
                    <input type="text" name="studentName" value={newViolation.studentName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Offense Type</label>
                    <input type="text" name="type" placeholder="Major or Minor" value={newViolation.type} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Offense</label>
                    <input type="text" name="description" value={newViolation.description} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Date of Notice</label>
                    <input type="date" name="dateOfNotice" value={newViolation.dateOfNotice} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Number of Occurrence</label>
                    <input type="text" name="occurrence" value={newViolation.occurrence} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Disciplinary Action</label>
                    <input type="text" name="disciplinaryAction" value={newViolation.disciplinaryAction} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Community Service Hours</label>
                    <input type="number" name="csHours" value={newViolation.csHours} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Approved by</label>
                    <input type="text" name="approvedBy" value={newViolation.approvedBy} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddViolationModal;