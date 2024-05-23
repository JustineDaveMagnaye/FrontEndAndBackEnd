import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../styles/CsSlipGuest.css';
import logo from '../assets/logo_new.png';
import view from '../assets/eye.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";
const CsSlipGuest = () => {
    const [csSlips, setCsSlips] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        loadCsSlips();
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

            const uniqueStudentNumbers = Array.from(new Set(response.data.map(csSlip => csSlip.student.studentNumber)));
            setStudents(uniqueStudentNumbers);
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

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    const filteredCsSlips = selectedStudentNumber
        ? csSlips.filter(csSlip => csSlip.student.studentNumber === selectedStudentNumber)
        : csSlips;
        const handleLogout = () => {
            localStorage.setItem('token', '');
            localStorage.setItem('role', '');
            localStorage.setItem('exp', '');
            navigate('/login')
        };

        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };
    
        const formatTime = (timeString) => {
            const options = { hour: '2-digit', minute: '2-digit' };
            return new Date(timeString).toLocaleTimeString(undefined, options);
        };

    return (
        <div className="csreport-guest">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a href="/guest/violation">Violation</a>
                    <a href="/guest/cs-slip">CS Slips</a>
                    <a href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav>

            <div className="list-container">
                <h1>MY LIST OF COMMUNITY SERVICE SLIP</h1>
                <div className="content-container">
                    <div className="date-filter">
                        <input type="date" className="date-input" id="start-date" name="start-date" />
                        <p id="to">to</p>
                        <input type="date" className="date-input" id="end-date" name="end-date" />
                        <select className="beneficiary-button" onChange={handleStudentChange} value={selectedStudentNumber}>
                            <option value="">All Students</option>
                            {students.map(studentNumber => {
                                const student = csSlips.find(csSlip => csSlip.student.studentNumber === studentNumber)?.student;
                                return (
                                    <option key={studentNumber} value={studentNumber}>
                                        {student ? `${student.lastName}, ${student.firstName} ${student.middleName}` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCsSlips.map(csSlip => (
                                <tr key={csSlip.id}>
                                    <td>{`${csSlip.student.lastName}, ${csSlip.student.firstName} ${csSlip.student.middleName}`}</td>
                                    <td>{csSlip.areaOfCommServ.stationName}</td>
                                    <td>
                                        <button
                                            className="view-button"
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
                        <table className="guest-cs-report-table">
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
                                        <td>{formatDate(report.dateOfCs)}</td>
                                        <td>{formatTime(report.timeIn)}</td>
                                        <td>{formatTime(report.timeOut)}</td>
                                        <td>{report.hoursCompleted}</td>
                                        <td>{report.natureOfWork}</td>
                                        <td>{selectedSlip.areaOfCommServ.stationName}</td>
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

export default CsSlipGuest;
