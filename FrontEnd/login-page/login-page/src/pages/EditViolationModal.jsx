import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import '../styles/AddEditViolationModal.css';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [offenses, setOffenses] = useState([]);
    const [violation, setViolation] = useState({
        studentId: "",
        studentName: "",
        type: "",
        offenseId: "",
        description: "",
        dateOfNotice: "",
        warningNumber: "",
        disciplinaryAction: "",
        csHours: "",
        // approvedBy: "",
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
            <h2>Edit Violation</h2>
            <form onSubmit={handleSubmit} className='violation-form-container'>
                <div className='wrap'>
                    <div className="form-group">
                        <label>Student ID</label>
                        <input type="text" name="studentId" value={violation.student ? violation.student.studentNumber : 'Unknown Student Number'} onChange={handleInputChange} disabled />
                    </div>
                    <div className="form-group">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={violation.student ? `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}` : 'Unknown Student'} onChange={handleInputChange} disabled />
                    </div>
                    <div className="form-group">
                        <label>Offense</label>
                        <select name="offenseId" value={violation.offenseId} onChange={handleInputChange}>
                            <option value="" disabled>Select an offense</option>
                            {offenses.map(offense => (
                                <option key={offense.id} value={offense.id}>{offense.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date of Notice</label>
                        <input type="date" name="dateOfNotice" value={violation.dateOfNotice} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input type="text" name="warningNumber" value={violation.warningNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Disciplinary Action</label>
                        <input type="text" name="disciplinaryAction" value={violation.disciplinaryAction} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={violation.csHours} onChange={handleInputChange} required />
                    </div>
                    {/* <div className="form-group">
                        <label>Approved by</label>
                        <input type="text" name="approvedBy" value={violation.approvedBy} onChange={handleInputChange} required />
                    </div> */}
                </div>


                <button type="submit" className="submit-btn">Save</button>
            </form>
        </Modal>
    );
};

export default EditViolationModal;