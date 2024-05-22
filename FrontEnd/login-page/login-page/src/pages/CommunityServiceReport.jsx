import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CommunityServiceReport.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";

const CsReportPageAdmin = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        loadReports();
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        const role = localStorage.getItem('role')
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login')
        }
        if(role != "ROLE_ROLE_ADMIN"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation')
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation')
            } else {
                navigate('/login')
            }
        }
    }, []);

    const loadReports = async () => {
        try {
            const response = await axios.get("http://localhost:8080/CSReport/commServReports", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setReports(response.data);
            setFilteredReports(response.data);
        } catch (error) {
            console.error('Error fetching community service reports:', error);
        }
    };

    const handleStudentNameChange = async (event) => {
        const name = event.target.value;
        setStudentName(name);

        try {
            if (name.trim() === "") {
                setFilteredReports(reports);
                setError('');
                return;
            }

            const response = await axios.get(`http://localhost:8080/CSSlip/commServSlipsByName/${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.data && response.data.length > 0) {
                let csReports = [];
                response.data.forEach(csSlip => {
                    csReports = [...csReports, ...csSlip.reports.map(report => ({
                        ...report,
                        studentName: csSlip.studentName
                    }))];
                });
                setFilteredReports(csReports);
                setError('');
            } else {
                setFilteredReports([]);
                setError('No results found.');
            }
        } catch (error) {
            console.error('Error searching community service reports by student name:', error);
            setFilteredReports([]);
        }
    };
    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login')
    };
    return (
        <div className="cs-report-page-admin">
            {/* <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a className="nav-link" href="/admin/offense">Offense</a>
                    <a className="nav-link" href="/admin/violation">Violation</a>
                    <a className="nav-link" href="/admin/cs-list">CS Slips</a>
                    <a className="nav-link" href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav> */}

            <div className="report-container">
                <h1>COMMUNITY SERVICE REPORT</h1>
                <div className="content-container">
                    <div className="inputs-container">
                        <div className="field-container">
                            <input 
                                type="text" 
                                className="input-field" 
                                name="student-name" 
                                placeholder="STUDENT NAME"
                                value={studentName}
                                onChange={handleStudentNameChange}
                            />
                        </div>
                        <div className="field-container">
                            <input 
                                type="text" 
                                className="input-field" 
                                name="name" 
                                placeholder="AREA OF COMMUNITY SERVICE"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <table className="cs-report-table">
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
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.dateOfCs}</td>
                                    <td>{report.timeIn}</td>
                                    <td>{report.timeOut}</td>
                                    <td>{report.hoursCompleted}</td>
                                    <td>{report.natureOfWork}</td>
                                    <td>{report.office}</td>
                                    <td>{report.status}</td>
                                    <td>{report.supervisingPersonnel}</td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan="10">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CsReportPageAdmin;