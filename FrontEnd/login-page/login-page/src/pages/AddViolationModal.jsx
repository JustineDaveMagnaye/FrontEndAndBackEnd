import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddEditViolationModal.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
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
        approvedByName: ""
    });

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

        if (name === 'approvedById') {
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

    const fetchEmployeeDetails = async (employeeNumber) => {
        const employee = employees.find(employee => employee.employeeNumber === employeeNumber);
        if (employee) {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`
            }));
        } else {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newViolation);
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
                        <label>Approved by Employee Number</label>
                        <input type="text" name="approvedById" value={newViolation.approvedById} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Approved by Employee Name</label>
                        <input type="text" name="approvedByName" value={newViolation.approvedByName} disabled />
                    </div>
                </div>
                
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </Modal>
    );
};

export default AddViolationModal;