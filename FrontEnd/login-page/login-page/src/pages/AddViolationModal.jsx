import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import '../styles/AddEditModal.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
    const [offenses, setOffenses] = useState([]);
    const [newViolation, setNewViolation] = useState({
        studentId: "",
        studentName: "",
        type: "",
        offenseId: "",
        description: "",
        dateOfNotice: "",
        warningNumber: "",
        disciplinaryAction: "",
        csHours: "",
        approvedById: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewViolation({ ...newViolation, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newViolation);
    };

    useEffect(() => {
        const fetchOffenses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Offense/offenses', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setOffenses(response.data);
            } catch (error) {
                console.error('Error fetching offenses:', error);
            }
        };
        fetchOffenses();
    }, []);

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
                    <input type="text" name="studentName" value={newViolation.studentName ? `${newViolation.student.lastName}, ${newViolation.student.firstName} ${newViolation.student.middleName}` : ''} onChange={handleInputChange} disabled />
                </div>
                <div className="form-group">
                    <label>Offense</label>
                    <select name="offenseId" value={newViolation.offenseId} onChange={handleInputChange}>
                        <option value="" disabled>Select an offense</option>
                        {offenses.map(offense => (
                            <option key={offense.id} value={offense.id}>{offense.description}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Date of Notice</label>
                    <input type="date" name="dateOfNotice" value={newViolation.dateOfNotice} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Number of Occurrence</label>
                    <input type="text" name="warningNumber" value={newViolation.warningNumber} onChange={handleInputChange} required />
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
                    <input type="text" name="approvedById" value={newViolation.approvedById} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddViolationModal;