import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import '../styles/ViolationStudent.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

const ViolationStudent = () => {
    const [violations, setViolations] = useState([]);
    const [userId, setUserId] = useState('');

    const [filteredViolations, setFilteredViolations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('userId');
        setUserId(id);
        loadViolations(id);

        const role = localStorage.getItem('role');
        const exp = localStorage.getItem('exp');
        const currentDate = new Date();
        
        if (!role || !exp || exp * 1000 < currentDate.getTime()) {
            handleLogout();
        } else if (role !== "ROLE_ROLE_STUDENT") {
            redirectBasedOnRole(role);
        }

    }, [navigate]);

    const loadViolations = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/Violation/violation/student/studentNumber/${userId}`, {
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

    //date filter codes
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
            return matchDate;
        });
        setFilteredViolations(filtered);
    };

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate, violations]);


    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilteredViolations(violations);
    };

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('exp');
        navigate('/login');
    };

    const redirectBasedOnRole = (role) => {
        switch (role) {
            case "ROLE_ROLE_EMPLOYEE":
                navigate('/employee/cs-list');
                break;
            case "ROLE_ROLE_ADMIN":
                navigate('/admin/offense');
                break;
            case "ROLE_ROLE_GUEST":
                navigate('/guest/violation');
                break;
            default:
                navigate('/login');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="violation-student">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a href="/student/violation">Violation</a>
                    <a href="/student/cs-slip">Cs Slips</a>
                    <a href="#" onClick={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav>
            <div className="container">
                <h1>MY VIOLATIONS</h1>
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
                    </div>
                    <table className="my-violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURRENCE</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOURS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredViolations.map((violation) => (
                                <tr key={violation.id}>
                                    <td>{`${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}`}</td>
                                    <td>{violation.offense.description}</td>
                                    <td>{formatDate(violation.dateOfNotice)}</td>
                                    <td>{violation.warningNumber}</td>
                                    <td>{violation.disciplinaryAction}</td>
                                    <td>{violation.csHours}</td>
                                </tr>
                            ))}

                            {filteredViolations.length === 0 && (
                                <tr>
                                    <td colSpan="7">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViolationStudent;