import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddEditViolationModal.css';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
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
        approvedById: "",
        approvedByName: ""
    });

    useEffect(() => {
        if (violationToEdit) {
            const formattedViolation = {
                ...violationToEdit,
                dateOfNotice: new Date(violationToEdit.dateOfNotice).toISOString().split('T')[0],
            };
            setViolation(formattedViolation);
        }
    }, [violationToEdit]);

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

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [studentsResponse, employeesResponse] = await Promise.all([
                    axios.get('http://localhost:8080/Student/students', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/Employee/employees', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
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
        setViolation({ ...violation, [name]: value });

        if (name === 'studentId') {
            fetchStudentDetails(value);
        }

        if (name === 'approvedById') {
            fetchEmployeeDetails(value);
        }
    };

    const fetchStudentDetails = async (studentId) => {
        const student = students.find(student => student.studentNumber === studentId);
        if (student) {
            setViolation(prevState => ({
                ...prevState,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
            }));
        } else {
            setViolation(prevState => ({
                ...prevState,
                studentName: ''
            }));
        }
    };

    const fetchEmployeeDetails = async (employeeNumber) => {
        const employee = employees.find(employee => employee.employeeNumber === employeeNumber);
        if (employee) {
            setViolation(prevState => ({
                ...prevState,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`
            }));
        } else {
            setViolation(prevState => ({
                ...prevState,
                approvedByName: ''
            }));
        }
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
                        <input type="text" name="occurrence" value={violation.warningNumber} onChange={handleInputChange} required />
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
                        <label>Approved by Employee Number</label>
                        <input type="text" name="approvedById" value={violation.approvedById} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Approved by Employee Name</label>
                        <input type="text" name="approvedByName" value={violation.approvedByName} disabled />
                    </div>
                </div>
                
                <button type="submit" className="submit-btn">Save</button>
            </form>
        </Modal>
    );
};

export default EditViolationModal;