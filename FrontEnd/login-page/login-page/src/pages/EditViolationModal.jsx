import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/AddEditViolationModal.css';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [violation, setViolation] = useState({
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

    useEffect(() => {
        if (violationToEdit) {
            setViolation(violationToEdit);
        }
    }, [violationToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setViolation({ ...violation, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(violation);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Edit Violation</h2>
            <form onSubmit={handleSubmit} className='violation-form-container'>
                <div className='wrap'>
                    <div className="form-group">
                        <label>Student ID</label>
                        <input type="text" name="studentId" value={violation.studentId} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={violation.studentName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Offense Type</label>
                        <select name="type" value={violation.type} onChange={handleInputChange} required>
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Offense</label>
                        <input type="text" name="description" value={violation.description} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date of Notice</label>
                        <input type="date" name="dateOfNotice" value={violation.dateOfNotice} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input type="text" name="occurrence" value={violation.occurrence} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Disciplinary Action</label>
                        <input type="text" name="disciplinaryAction" value={violation.disciplinaryAction} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={violation.csHours} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Approved by</label>
                        <input type="text" name="approvedBy" value={violation.approvedBy} onChange={handleInputChange} required />
                    </div>
                </div>


                <button type="submit" className="submit-btn">Save</button>
            </form>
        </Modal>
    );
};

export default EditViolationModal;