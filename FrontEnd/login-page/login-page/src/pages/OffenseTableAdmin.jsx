import React, { useState, useEffect } from 'react';
import '../styles/offenseTableAdmin.css';
import logo from '../assets/logo_new.png';
import edit from '../assets/compose.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AddOffenseModal from './AddOffenseModal';
import EditOffenseModal from './EditOffenseModal';

const OffensePageAdmin = () => {
    const [offenses, setOffenses] = useState([]);
    const [filteredOffenses, setFilteredOffenses] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filterType, setFilterType] = useState('All');
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [offenseToEdit, setOffenseToEdit] = useState(null);

    useEffect(() => {
        loadOffenses();
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

    const loadOffenses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Offense/offenses`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log('Fetched Offenses:', response.data); 
            setOffenses(response.data);
            setFilteredOffenses(response.data); 
        } catch (error) {
            console.error('Error fetching offenses:', error);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (offense) => {
        setOffenseToEdit(offense);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setOffenseToEdit(null);
    };

    const handleAddOffense = async (newOffense) => {
        try {
            let params = {
                description: newOffense.description,
                type: newOffense.type
            };

            const response = await axios.post("http://localhost:8080/Offense/offense/addOffense", params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setMessage(response.data);
            closeAddModal();
            loadOffenses();
        } catch (error) {
            console.error('Error adding offense:', error);
            setMessage("Offense cannot be added");
        }
    };

    const handleEditOffense = async (updatedOffense) => {
        try {
            const response = await axios.put("http://localhost:8080/Offense/offense/updateOffense", updatedOffense, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setMessage(response.data);
            closeEditModal();
            loadOffenses();
        } catch (error) {
            console.error('Error editing offense:', error);
            setMessage("Offense cannot be edited");
        }
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        filterAndSearchOffenses(event.target.value, filterType);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        filterAndSearchOffenses(searchInput, event.target.value);
    };

    const filterAndSearchOffenses = (searchTerm, filter) => {
        let filtered = offenses;

        if (filter !== 'All') {
            filtered = filtered.filter(offense => offense.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(offense => 
                offense.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOffenses(filtered);
    };

    const resetFilters = () => {
        setSearchInput('');
        setFilterType('All');
        setFilteredOffenses(offenses);
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };
    
    return (
        <div className="offense-page-admin">
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
            <div className="offense-container">
                <h1 className='head'>OFFENSE</h1>
                <div className="contents">
                    <div className="search-offense-filter">
                        <input
                            type="text"
                            placeholder="Search by offense"
                            className="search-offense-input"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                        <select
                            className="filter-offense-button"
                            value={filterType}
                            onChange={handleFilterChange}
                        >
                            <option value="All">All</option>
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                        </select>
                    </div>
                    <table className="offense-table-container">
                        <thead>
                            <tr>
                                <th className='name-column'>OFFENSE</th>
                                <th className='type-column'>TYPE</th>
                                <th className='action-column'>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffenses.map(offense => (
                                <tr key={offense.id}>
                                    <td className='name-column'>{offense.description}</td>
                                    <td className='type-column'>{offense.type}</td>
                                    <td className='action-colum'>
                                        <button className="edit-button" onClick={() => openEditModal(offense)}><img src={edit} alt="Edit" className="edit-icon"/></button>
                                    </td>
                                </tr>
                            ))}
                            
                            {filteredOffenses.length === 0 && (
                                <tr>
                                    <td colSpan="3">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="btns">
                        <button className="add-offense-btn" onClick={openAddModal}>ADD OFFENSE</button>
                    </div>
                </div>
            </div>
            <AddOffenseModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddOffense}
            />
            <EditOffenseModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleEditOffense}
                offenseToEdit={offenseToEdit}
            />
        </div>
    );
};

export default OffensePageAdmin;
