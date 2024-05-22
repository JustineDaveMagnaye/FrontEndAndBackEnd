import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/ViolationStudent.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

const ViolationStudent = () => {
    const [violations, setViolations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        loadViolations();
        const role = localStorage.getItem('role')
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login')
        }
        if(role != "ROLE_ROLE_STUDENT"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_ADMIN"){
                navigate('/admin/offense')
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation')
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
            setViolations(response.data);
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };
    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login')
    };

    return (
        <div className="violation-student">
           <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a href="/student/violation">Violation</a>
                    <a href="/student/cs-slip">Cs Slips</a>
                    <a href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav>
            <div className="container">
                <h1>MY VIOLATIONS</h1>
                <div className="content-container">
                    <div className="date-filter">
                        <input type="date" className="date-input" id="start-date" name="start-date" />
                        <p id="to">to</p>
                        <input type="date" className="date-input" id="end-date" name="end-date" />
                    </div>
                    <table className="my-violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURANCE</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOURS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {violations.map((violation) => (
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

export default ViolationStudent;
