import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../styles/CsSlipGuest.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import { useNavigate } from "react-router-dom";
import Collapsible from 'react-collapsible';

const CsSlipGuest = () => {
    const [csSlips, setCsSlips] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadCsSlips();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = localStorage.getItem('role');
        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        if (role !== "ROLE_ROLE_GUEST") {
            if (role === "ROLE_ROLE_EMPLOYEE") {
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT") {
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_ADMIN") {
                navigate('/admin/offense');
            } else {
                navigate('/login');
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

            // Create a map to store csSlips by studentId
            const csSlipsByStudent = new Map();

            // Group community service slips by studentId
            response.data.forEach(csSlip => {
                const studentId = csSlip.student.id;
                if (!csSlipsByStudent.has(studentId)) {
                    csSlipsByStudent.set(studentId, {
                        ...csSlip,
                        reports: [],
                    });
                }
                csSlipsByStudent.get(studentId).reports.push(...csSlip.reports);
            });

            // Convert the map values back to an array
            const updatedCsSlips = Array.from(csSlipsByStudent.values());

            setCsSlips(updatedCsSlips);

            // Extract unique student numbers
            const uniqueStudentNumbers = Array.from(new Set(response.data.map(csSlip => csSlip.student.studentNumber)));
            setStudents(uniqueStudentNumbers);
        } catch (error) {
            console.error('Error fetching community service slips:', error);
        }
    };

    const handleRowClick = (csSlip) => {
        if (selectedSlip && selectedSlip.id === csSlip.id) {
            setSelectedSlip(null);
        } else {
            setSelectedSlip(csSlip);
        }
    };

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    const calculateTotalHoursCompleted = () => {
        let totalHours = 0;
        if (selectedSlip) {
            selectedSlip.reports.forEach(report => {
                totalHours += report.hoursCompleted;
            });
        }
        return totalHours;
    };

    const filteredCsSlips = selectedStudentNumber
        ? csSlips.filter(csSlip => csSlip.student.studentNumber === selectedStudentNumber)
        : csSlips;

    return (
        <div className="csreport-guest">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo" />
                <div className="nav-links">
                    <a href="/guest/violation">Violation</a>
                    <a href="/guest/cs-slip">CS Slips</a>
                    <a href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile" />
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCsSlips.map(csSlip => (
                                <React.Fragment key={csSlip.id}>
                                    <tr onClick={() => handleRowClick(csSlip)}>
                                        <td>{`${csSlip.student.lastName}, ${csSlip.student.firstName} ${csSlip.student.middleName}`}</td>
                                        <td>{csSlip.areaOfCommServ.stationName}</td>
                                    </tr>
                                    {selectedSlip && selectedSlip.id === csSlip.id && (
                                        <tr>
                                            <td colSpan="2">
                                                <Collapsible open={true}>
                                                    <div>
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
                                                                    <tr key={report.id}>                                                                    <td>{formatDate(report.dateOfCs)}</td>
                                                                        <td>{formatTime(report.timeIn)}</td>
                                                                        <td>{formatTime(report.timeOut)}</td>
                                                                        <td>{report.hoursCompleted}</td>
                                                                        <td>{report.natureOfWork}</td>
                                                                        <td>{selectedSlip.areaOfCommServ.stationName}</td>
                                                                        <td>{report.status}</td>
                                                                        <td>{report.employeeNumber}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr>
                                                                    <td colSpan="8">
                                                                        <h3>Total Hours of Community Service Completed: {calculateTotalHoursCompleted()}</h3>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Collapsible>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CsSlipGuest;