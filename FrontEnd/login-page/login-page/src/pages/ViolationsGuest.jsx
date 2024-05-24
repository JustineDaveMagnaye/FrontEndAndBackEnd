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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [guestData, setGuestData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadGuest();
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
    }, [navigate]);

    const loadGuest = async () => {
        try {
            const guestNumber = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/Guest/getGuestByGuestNumber/${guestNumber}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setGuestData(response.data.id);
            loadBeneficiaries(response.data.id);
        } catch (error) {
            console.error('Error fetching guest data:', error);
        }
    };

    const loadBeneficiaries = async (guestId) => {
        try {
            const response = await axios.get(`http://localhost:8080/Guest/guests/${guestId}/get-beneficiaries`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const beneficiaries = response.data.flatMap(guest => guest.beneficiary);
            const studentIds = beneficiaries.map(beneficiary => beneficiary.id);
            loadViolations(studentIds);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
    };

    const loadViolations = async (studentIds) => {
        try {
            const promises = studentIds.map(studentId =>
                axios.get(`http://localhost:8080/Violation/violation/student/${studentId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            );
            const responses = await Promise.all(promises);
            const violationsData = responses.flatMap(response => response.data);
            setViolations(violationsData);

            const uniqueStudentNumbers = Array.from(new Set(violationsData.map(violation => violation.student.studentNumber)));
            setStudents(uniqueStudentNumbers);
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };

    const handleDateChange = (event, setDate, opposingDate, isStartDate) => {
        const date = new Date(event.target.value);
        const opposing = new Date(opposingDate);
        const currentYear = new Date().getFullYear();

        if (date.getFullYear() > currentYear) {
            alert('Date exceeds the current year');
        } else if (!isStartDate && opposingDate && date < opposing) {
            alert('Start date cannot be earlier than end date');
        } else {
            setDate(event.target.value);
        }
    };

    const handleStartDateChange = (event) => {
        handleDateChange(event, setStartDate, endDate, true);
    };

    const handleEndDateChange = (event) => {
        handleDateChange(event, setEndDate, startDate, false);
    };

    const filterViolations = () => {
        let filtered = violations.filter(violation => {
            const violationDate = new Date(violation.dateOfNotice);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchDate = (!start || violationDate >= start) && (!end || violationDate <= end);
            const matchStudent = !selectedStudentNumber || violation.student.studentNumber === selectedStudentNumber;
            return matchDate && matchStudent;
        });
        setFilteredViolations(filtered);
    };

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate, violations, selectedStudentNumber]);

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedStudentNumber('');
        setFilteredViolations(violations);
    };

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                        <input
                            type="date"
                            className="date-input"
                            id="start-date"
                            name="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <p id="to">to</p>
                        <input
                            type="date"
                            className="date-input"
                            id="end-date"
                            name="end-date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                        <select
                            id="studentFilter"
                            name="studentFilter"
                            className="beneficiary-button"
                            onChange={handleStudentChange}
                            value={selectedStudentNumber}
                        >
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
                                    <td>{formatDate(violation.dateOfNotice)}</td>
                                    <td>{violation.warningNumber}</td>
                                    <td>{violation.disciplinaryAction}</td>
                                    <td>{violation.csHours}</td>
                                </tr>
                            ))}

                            {filteredViolations.length === 0 && (
                                <tr>
                                    <td colSpan="6">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViolationGuest;