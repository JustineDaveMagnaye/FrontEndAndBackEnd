import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddEditViolationModal.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newViolation, setNewViolation] = useState({
        studentId: "",
        studentNumber: "",
        studentName: "",
        type: "",
        offenseId: "",
        description: "",
        dateOfNotice: "",
        warningNumber: "",
        disciplinaryAction: "",
        csHours: "",
        approvedById: "",
        approvedByNumber: "",
        approvedByName: ""
    });

    const validate = () => {
        const studentNumberPattern = /CT[0-9]{2}-[0-9]{4}/;
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /[0-9]/;
        let validationErrors = {};

        if (!newViolation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (newViolation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date of Notice cannot be in the future";
        }

        if (!newViolation.warningNumber) {
            validationErrors.warningNumber = "Number of Occurence is required";
        } else if (!numberPattern.test(newViolation.warningNumber) || newViolation.warningNumber <= 0) {
            validationErrors.warningNumber = "Number of Occurence should only be positive numbers";
        }    
        
        if (!newViolation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(newViolation.csHours) || newViolation.csHours <= 0) {
            validationErrors.csHours = "Community Service Hours should only be positive numbers";
        } 

        if (!newViolation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(newViolation.studentNumber)) {
            validationErrors.studentNumber = "Input alpha-numeric and dash(-) characters only";
        } else if (!studentNumberPattern.test(newViolation.studentNumber)) {
            validationErrors.studentNumber = "Student Number format is incorrect";
        }

        if (!newViolation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        } else if (specialCharPattern.test(newViolation.disciplinaryAction)) {
            validationErrors.disciplinaryAction = "Disciplinary Action should not contain special characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [offensesResponse, studentsResponse, employeesResponse] = await Promise.all([
                    axios.get('http://localhost:8080/Offense/offenses', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/Student/students', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/Employee/employees', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setOffenses(offensesResponse.data);
                setStudents(studentsResponse.data);
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewViolation({ ...newViolation, [name]: value });

        if (name === 'studentNumber') {
            fetchStudentDetails(value);
        }

        if (name === 'approvedByNumber') {
            fetchEmployeeDetails(value);
        }
    };

    const fetchStudentDetails = async (studentId) => {
        const student = students.find(student => student.studentNumber === studentId);
        console.log(student);
        if (student) {
            setNewViolation(prevState => ({
                ...prevState,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: `${student.id}`
            }));
        } else {
            setNewViolation(prevState => ({
                ...prevState,
                studentName: '',
                studentId: ''
            }));
        }
    };

    const fetchEmployeeDetails = async (approvedById) => {
        const employee = employees.find(employee => employee.employeeNumber === approvedById);
        if (employee) {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`,
                approvedById: `${employee.id}`
            }));
        } else {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: '',
                approvedById: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(validate());
        if (validate()) {
            onSubmit(newViolation);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Add Violation</h2>
            <form onSubmit={handleSubmit} className='violation-form-container'>
                <div className='wrap'>
                    <div className="form-group">
                        <label>Student Number</label>
                        <input type="text" name="studentNumber" value={newViolation.studentNumber} onChange={handleInputChange} required />
                        {errors.studentNumber && <p className="error">{errors.studentNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={newViolation.studentName} disabled />
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
                        {errors.dateOfNotice && <p className="error">{errors.dateOfNotice}</p>}
                    </div>
                    <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input type="text" name="warningNumber" value={newViolation.warningNumber} onChange={handleInputChange} required />
                        {errors.warningNumber && <p className="error">{errors.warningNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label>Disciplinary Action</label>
                        <input type="text" name="disciplinaryAction" value={newViolation.disciplinaryAction} onChange={handleInputChange} required />
                        {errors.disciplinaryAction && <p className="error">{errors.disciplinaryAction}</p>}
                    </div>
                    <div className="form-group">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={newViolation.csHours} onChange={handleInputChange} required />
                        {errors.csHours && <p className="error">{errors.csHours}</p>}
                    </div>
                    <div className="form-group">
                        <label>Approved by: Employee Number</label>
                        <input type="text" name="approvedByNumber" value={newViolation.approvedByNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Approved by: Employee Name</label>
                        <input type="text" name="approvedByName" value={newViolation.approvedByName} disabled />
                    </div>
                </div>
                
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddViolationModal;