import React, { useState, useEffect } from 'react';
import '../styles/CsSlipStudent.css';
import axios from "axios";
import '../styles/CsSlipStudent.css';
import logo from '../assets/logo_new.png';
import view from '../assets/eye.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";

const CsSlipStudent = () => {
    const [csSlips, setCsSlips] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        loadCsSlips();
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        const role = localStorage.getItem('role')
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
    const loadCsSlips = async () => {
        try {
            const response = await axios.get("http://localhost:8080/CSSlip/commServSlips", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setCsSlips(response.data);
        } catch (error) {
            console.error('Error fetching community service slips:', error);
        }
    };

    const handleViewClick = (csSlip) => {
        if (selectedSlip && selectedSlip.id === csSlip.id) {
            setSelectedSlip(null);
        } else {
            setSelectedSlip(csSlip);
        }
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login')
    };

    return (
        <div className="csreport-student">
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
                <h1>MY LIST OF COMMUNITY SERVICE SLIP</h1>
                <div className="content-container">
                    <table className="my-cslip-table">
                        <thead>
                            <tr>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csSlips.map(csSlip => (
                                <tr key={csSlip.id}>
                                    <td>{`${csSlip.student.lastName}, ${csSlip.student.firstName} ${csSlip.student.middleName}`}</td>
                                    <td>{csSlip.areaOfCommServId}</td>
                                    <td>
                                        <button
                                            className="eye-button"
                                            onClick={() => handleViewClick(csSlip)}
                                        >
                                            <img src={view} alt="view" className="view-icon"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedSlip && (
                    <div className="table2-container">
                        <h2>COMMUNITY SERVICE REPORT</h2>
                        <table className="student-cs-report-table">
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>TIME STARTED</th>
                                    <th>TIME ENDED</th>
                                    <th>HOURS COMPLETED</th>
                                    <th>NATURE OF WORK</th>
                                    <th>OFFICE</th>
                                    <th>STATUS</th>
                                    <th>SUPERVISING PERSONNEL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSlip.reports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.dateOfCs}</td>
                                        <td>{report.timeIn}</td>
                                        <td>{report.timeOut}</td>
                                        <td>{report.hoursCompleted}</td>
                                        <td>{report.natureOfWork}</td>
                                        <td>{report.areaOfCommServId}</td>
                                        <td>{report.status}</td>
                                        <td>{report.employeeNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CsSlipStudent;
