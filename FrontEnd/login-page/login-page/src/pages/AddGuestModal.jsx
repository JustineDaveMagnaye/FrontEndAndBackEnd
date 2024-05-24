// AddGuestModal.js
import React, { useState } from 'react';
import '../styles/AddGuestModal.css';

const AddGuestModal = ({ onClose, onSubmit }) => {
    const [guestData, setGuestData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        birthdate: '',
        birthplace: '',
        citizenship: '',
        religion: '',
        civilStatus: '',
        sex: '',
        email: '',
        contactNumber: '',
        address: '',
        guestNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestData({ ...guestData, [name]: value });
    };

    const handleGuestSubmit = (e) => {
        e.preventDefault();
        onSubmit(guestData); // Send guest data back to the parent component
    };

    return (
        <div className="modal2">
            <div className="modal-content">
                <form onSubmit={handleGuestSubmit}>
                    <span className="close2" onClick={onClose}>&times;</span>
                    <h2>Add Guest</h2>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" name="firstName" value={guestData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Middle Name:</label>
                        <input type="text" name="middleName" value={guestData.middleName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={guestData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Birthdate:</label>
                        <input type="date" name="birthdate" value={guestData.birthdate} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Birthplace:</label>
                        <input type="text" name="birthplace" value={guestData.birthplace} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Citizenship:</label>
                        <input type="text" name="citizenship" value={guestData.citizenship} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Religion:</label>
                        <input type="text" name="religion" value={guestData.religion} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Civil Status:</label>
                        <input type="text" name="civilStatus" value={guestData.civilStatus} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Sex:</label>
                        <input type="text" name="sex" value={guestData.sex} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={guestData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contact Number:</label>
                        <input type="text" name="contactNumber" value={guestData.contactNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={guestData.address} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Add Guest</button>
                </form>
            </div>
        </div>
    );
};

export default AddGuestModal;
