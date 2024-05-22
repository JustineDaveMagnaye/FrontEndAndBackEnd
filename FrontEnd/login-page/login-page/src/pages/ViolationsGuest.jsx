import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViolationGuest.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";
const ViolationGuest = () => {
    const [violations, setViolations] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        loadViolations();
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        const role = localStorage.getItem('role')
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login')
        }
        if(role != "ROLE_ROLE_GUEST"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation')
            } else if (role === "ROLE_ROLE_ADMIN"){
                navigate('/admin/offense')
            } else {
                navigate('/login')
            }
        }
    }, []);


    const loadViolations = async () => {
        try {
            const response = await axios.get("http://localhost:8080/Violation/violations", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const violationsData = response.data;
            setViolations(violationsData);

            const uniqueStudentNumbers = Array.from(new Set(violationsData.map(violation => violation.student.studentNumber)));
            setStudents(uniqueStudentNumbers);
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    const filteredViolations = selectedStudentNumber
        ? violations.filter(violation => violation.student.studentNumber === selectedStudentNumber)
        : violations;
        const handleLogout = () => {
            localStorage.setItem('token', '');
            localStorage.setItem('role', '');
            localStorage.setItem('exp', '');
            navigate('/login')
        };


    return (
        <div className="violation-guest">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a href="/guest/violation">Violation</a>
                    <a href="/guest/cs-slip">CS Slips</a>
                    <a href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav>

            <div className="container">
                <h1>VIOLATIONS</h1>
                <div className="content-container">
                    <div className="date-filter">
                        <select id="studentFilter" name="studentFilter" className="beneficiary-button" onChange={handleStudentChange} value={selectedStudentNumber}>
                            <option value="">All Students</option>
                            {students.map(studentNumber => {
                                const student = violations.find(violation => violation.student.studentNumber === studentNumber)?.student;
                                return (
                                    <option key={studentNumber} value={studentNumber}>
                                        {student ? `${student.lastName}, ${student.firstName} ${student.middleName}` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <table className="my-violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURRENCES</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOURS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredViolations.map(violation => (
                                <tr key={violation.id}>
                                    <td>{`${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}`}</td>
                                    <td>{violation.offense.id}</td>
                                    <td>{violation.dateOfNotice}</td>
                                    <td>{violation.warningNumber}</td>
                                    <td>{violation.disciplinaryAction}</td>
                                    <td>{violation.csHours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>    
        </div>
    );
};

export default ViolationGuest;
