import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddEditViolationModal.css';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [violation, setViolation] = useState({
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

    // Validation function
    const validate = () => {
        const studentNumberPattern = /CT[0-9]{2}-[0-9]{4}/;
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /^[0-9]*$/;
        let validationErrors = {};

        if (!violation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (violation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date of Notice cannot be in the future";
        }

        if (!violation.warningNumber) {
            validationErrors.warningNumber = "Number of Occurrence is required";
        } else if (!numberPattern.test(violation.warningNumber) || violation.warningNumber <= 0) {
            validationErrors.warningNumber = "Number of Occurrence should only be positive numbers";
        }

        if (!violation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(violation.csHours) || violation.csHours <= 0) {
            validationErrors.csHours = "Community Service Hours should only be positive numbers";
        }

        if (!violation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(violation.studentNumber)) {
            validationErrors.studentNumber = "Input alpha-numeric and dash(-) characters only";
        } else if (!studentNumberPattern.test(violation.studentNumber)) {
            validationErrors.studentNumber = "Student Number format is incorrect";
        }

        if (!violation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        } else if (specialCharPattern.test(violation.disciplinaryAction)) {
            validationErrors.disciplinaryAction = "Disciplinary Action should not contain special characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        if (violationToEdit) {
            const formattedViolation = {
                ...violationToEdit,
                studentNumber: violationToEdit.student.studentNumber,
                studentName: `${violationToEdit.student.lastName}, ${violationToEdit.student.firstName} ${violationToEdit.student.middleName}`,
                dateOfNotice: new Date(violationToEdit.dateOfNotice).toISOString().split('T')[0],
                approvedById: violationToEdit.approvedBy ? violationToEdit.approvedBy.employeeNumber : "",
                approvedByName: violationToEdit.approvedBy ? `${violationToEdit.approvedBy.lastName}, ${violationToEdit.approvedBy.firstName} ${violationToEdit.approvedBy.middleName}` : ""
            };
            setViolation(formattedViolation);
        }
    }, [violationToEdit]);

    useEffect(() => {
        // Fetch offenses
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

        // Fetch students and employees
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

        if (name === 'studentNumber') {
            fetchStudentDetails(value);
        }

        if (name === 'approvedById') {
            fetchEmployeeDetails(value);
        }
    };

    const fetchStudentDetails = async (studentNumber) => {
        const student = students.find(student => student.studentNumber === studentNumber);
        if (student) {
            setViolation(prevState => ({
                ...prevState,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: student.id
            }));
        } else {
            setViolation(prevState => ({
                ...prevState,
                studentName: '',
                studentId: ''
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
        if (validate()) {
            onSubmit(violation);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <button onClick={onClose} className="close-btn">&times;</button>
            <h2>Edit Violation</h2>
            <form onSubmit={handleSubmit} className='violation-form-container'>
                <div className='wrap'>
                    <div className="form-group">
                        <label>Student Number</label>
                        <input type="text" name="studentNumber" value={violation.studentNumber} onChange={handleInputChange} />
                        {errors.studentNumber && <p className="error">{errors.studentNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={violation.studentName} disabled />
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
                        {errors.dateOfNotice && <p className="error">{errors.dateOfNotice}</p>}
                    </div>
                    <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input type="text" name="warningNumber" value={violation.warningNumber} onChange={handleInputChange} required />
                        {errors.warningNumber && <p className="error">{errors.warningNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label>Disciplinary Action</label>
                        <input type="text" name="disciplinaryAction" value={violation.disciplinaryAction} onChange={handleInputChange} required />
                        {errors.disciplinaryAction && <p className="error">{errors.disciplinaryAction}</p>}
                    </div>
                    <div className="form-group">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={violation.csHours} onChange={handleInputChange} required />
                        {errors.csHours && <p className="error">{errors.csHours}</p>}
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
