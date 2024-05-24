import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/AddEditOffenseModal.css';

const EditOffenseModal = ({ isOpen, onClose, onSubmit, offenseToEdit }) => {
    const [errors, setErrors] = useState({});
    const [offense, setOffense] = useState({
        description: "",
        type: ""
    });

    const validate = () => {
        const specialCharPattern = /[^a-zA-Z ]/;
        let validationErrors = {};

        if (!offense.description) {
            validationErrors.description = "Offense is required";
        } else if (specialCharPattern.test(offense.description)) {
            validationErrors.description = "Invalid Input. Please try again.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        if (offenseToEdit) {
            setOffense(offenseToEdit);
        }
    }, [offenseToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOffense({ ...offense, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(validate());
        if (validate()) {
            onSubmit(offense);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Edit Offense</h2>
            <form onSubmit={handleSubmit} className='offense-form-container'>
                <div className="form-group">
                    <label>Offense</label>
                    <input type="text" name="description" value={offense.description} onChange={handleInputChange} required />
                    {errors.description && <p className="error">{errors.description}</p>}
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={offense.type} onChange={handleInputChange} className='selectOffense' required>
                        <option value="" disabled>Select type</option>
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Save</button>
            </form>
        </Modal>
    );
};

export default EditOffenseModal;