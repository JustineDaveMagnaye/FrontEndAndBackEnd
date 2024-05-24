import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ViolationTableAdmin.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo_new.png';
import edit from '../assets/compose.png';
import user from '../assets/user.png';

import AddViolationModal from './AddViolationModal';
import EditViolationModal from './EditViolationModal';

const ViolationPageAdmin = () => {
    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [violationToEdit, setViolationToEdit] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadViolations();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = localStorage.getItem('role');
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login');
        }
        if(role !== "ROLE_ROLE_ADMIN"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation');
            } else {
                navigate('/login');
            }
        }
    }, []);

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate, searchInput, violations]);

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
            setFilteredViolations(response.data);
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
            const matchSearch = !searchInput || (violation.student && `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}`.toLowerCase().includes(searchInput.toLowerCase()));
            return matchDate && matchSearch;
        });
        setFilteredViolations(filtered);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (violation) => {
        setViolationToEdit(violation);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setViolationToEdit(null);
    };

    const handleAddViolation = async (newViolation) => {
        try {
            const formattedViolation = {
                dateOfNotice: newViolation.dateOfNotice,
                student: {
                    id: parseInt(newViolation.studentId)
                },
                offense: {
                    id: parseInt(newViolation.offenseId)
                },
                warningNumber: parseInt(newViolation.warningNumber),
                csHours: parseInt(newViolation.csHours),
                disciplinaryAction: newViolation.disciplinaryAction
            };

            const response = await axios.post("http://localhost:8080/Violation/violation/addViolation", formattedViolation, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log(response.data);
            closeAddModal();
            loadViolations();
        } catch (error) {
            console.error('Error adding violation:', error);
            setMessage("Violation cannot be added");
        }
    };

    const handleEditViolation = async (updatedViolation) => {
        try {
            const response = await axios.put("http://localhost:8080/Violation/violation/updateViolation", updatedViolation, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setMessage(response.data);
            closeEditModal();
            loadViolations();
        } catch (error) {
            console.error('Error editing violation:', error);
            setMessage("Violation cannot be edited");
        }
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
        <div className="violation-page-admin">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a className="nav-link" href="/admin/offense">Offense</a>
                    <a className="nav-link" href="/admin/violation">Violation</a>
                    <a className="nav-link" href="/admin/cs-list">CS Slips</a>
                    <a className="nav-link" href="#" onMouseDown={handleLogout}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>
            </nav>
            <div className="container">
                <h1>VIOLATION</h1>
                <div className="content-container">
                    <div className="violation-search-filter">
                        <input
                            type="text"
                            placeholder="Search by Student Name"
                            className="violation-search-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
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
                    <h2>List of Violation</h2>
                    <table className="violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURRENCE</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOUR</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredViolations.map(violation => (
                                <tr key={violation.id}>
                                    <td>{violation.student ? `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}` : 'Unknown Student'}</td>
                                    <td>{violation.offense ? violation.offense.description : 'Unknown Offense'}</td>
                                    <td>{formatDate(violation.dateOfNotice)}</td>
                                    <td>{violation.warningNumber}</td>
                                    <td>{violation.disciplinaryAction}</td>
                                    <td>{violation.csHours}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEditModal(violation)}><img src={edit} alt="Edit" className="edit-icon"/></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredViolations.length === 0 && (
                                <tr>
                                    <td colSpan="7">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="btns-container">
                        <a href="/admin/cs-slip"><button className="create-cs-btn">CREATE CS SLIP</button></a>
                        <button className="add-violation-btn" onClick={openAddModal}>ADD VIOLATION</button>
                    </div>
                </div>
            </div>
            <AddViolationModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddViolation}
            />
            <EditViolationModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleEditViolation}
                violationToEdit={violationToEdit}
            />
        </div>
    );
};

export default ViolationPageAdmin;
