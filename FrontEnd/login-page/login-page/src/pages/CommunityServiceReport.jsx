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
    const [areaOfService, setAreaOfService] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = localStorage.getItem('role');

        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        if (role !== "ROLE_ROLE_ADMIN") {
            if (role === "ROLE_ROLE_EMPLOYEE") {
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT") {
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_GUEST") {
                navigate('/guest/violation');
            } else {
                navigate('/login');
            }
        }
    }, []);

    const loadReports = async () => {
        try {
            const response = await axios.get("http://localhost:8080/CSSlip/commServSlips", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            const dreports = response.data.filter(report => report !== null);
            if (dreports.length > 0) {
                const allReports = dreports.flatMap(dreport => dreport.reports.map(report => ({
                    ...report,
                    firstName: dreport.student.firstName,
                    middleName: dreport.student.middleName,
                    lastName: dreport.student.lastName
                })));
                setReports(allReports);
                setFilteredReports(allReports);
            }
        } catch (error) {
            console.error('Error fetching community service reports:', error);
        }
    };

    const handleStudentNameChange = (event) => {
        const name = event.target.value;
        setStudentName(name);

        if (name.trim() === "") {
            setFilteredReports(reports);
            setError('');
            return;
        }

        const lowerCaseName = name.toLowerCase();
        const filtered = reports.filter(report => 
            `${report.firstName} ${report.middleName} ${report.lastName}`.toLowerCase().includes(lowerCaseName)
        );

        if (filtered.length > 0) {
            setFilteredReports(filtered);
            setError('');
        } else {
            setFilteredReports([]);
            setError('No results found.');
        }
    };

    const handleAreaOfServiceChange = async (event) => {
        const area = event.target.value;
        setAreaOfService(area);
    
        try {
            if (area.trim() === "") {
                setFilteredReports(reports);
                setError('');
                return;
            }
    
            const response = await axios.get(`http://localhost:8080/CSSlip/commServSlip/areaOfCs/${area}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
    
            if (response.status === 200) {
                const csSlips = response.data.flatMap(csSlip => csSlip.reports.map(report => ({
                    ...report,
                    firstName: csSlip.student.firstName,
                    middleName: csSlip.student.middleName,
                    lastName: csSlip.student.lastName
                })));
    
                if (csSlips.length > 0) {
                    setFilteredReports(csSlips);
                    setError('');
                } else {
                    setFilteredReports([]);
                    setError('No results found.');
                }
            } else {
                setFilteredReports([]);
                setError('Error fetching data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching community service reports by area:', error);
            setFilteredReports([]);

        }
    };   

    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
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
        <div className="cs-report-page-admin">
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
                                name="area" 
                                placeholder="AREA OF COMMUNITY SERVICE"
                                value={areaOfService}
                                onChange={handleAreaOfServiceChange}
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
                                <th>STUDENT</th>
                                <th>DATE</th>
                                <th>TIME STARTED</th>
                                <th>TIME ENDED</th>
                                <th>HOURS COMPLETED</th>
                                <th>NATURE OF WORK</th>
                                <th>OFFICE</th>
                                <th>STATUS</th>
                                <th>REMARKS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.firstName + " " + report.middleName + " " + report.lastName}</td>
                                    <td>{formatDate(report.dateOfCs)}</td>
                                    <td>{formatTime(report.timeIn)}</td>
                                    <td>{formatTime(report.timeOut)}</td>
                                    <td>{report.hoursCompleted}</td>
                                    <td>{report.natureOfWork}</td>
                                    <td>{report.office}</td>
                                    <td>{report.status}</td>
                                    <td>{report.remarks}</td>
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