import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../styles/ListCommunityServiceReport.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import CommunityServiceReport from "./CommunityServiceReport";

const CsListPageAdmin = () => {
    const [csReport, setCsReport] = useState({
        id: "",
        studentNumber: "",
        name: "",
        section: "",
        head: "",
        deduction: "",
        area: "",
        reason: "",
        reports: []
    });

    const [csSlips, setCsSlips] = useState([]);
    const [filteredCsSlips, setFilteredCsSlips] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
    const [collapsibleHeight, setCollapsibleHeight] = useState("0px");

    const navigate = useNavigate();
    const collapsibleRef = useRef(null);

    useEffect(() => {
        loadCsSlips();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        const role = localStorage.getItem('role');
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
    }, [navigate]);

    useEffect(() => {
        filterCsSlips();
    }, [searchInput, csSlips]);

    useEffect(() => {
        if (isCollapsibleOpen) {
            setCollapsibleHeight(`${collapsibleRef.current.scrollHeight}px`);
        } else {
            setCollapsibleHeight("0px");
        }
    }, [isCollapsibleOpen]);

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

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const filterCsSlips = () => {
        const filtered = csSlips.filter(csSlip => {
            const studentName = `${csSlip.student.firstName} ${csSlip.student.lastName}`.toLowerCase();
            return studentName.includes(searchInput.toLowerCase());
        });
        setFilteredCsSlips(filtered);
    };

    const csSlipsToDisplay = searchInput ? filteredCsSlips : csSlips;

    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };

    const handleRowClick = (csSlip) => {
        if (csReport.id === csSlip.id && isCollapsibleOpen) {
            setIsCollapsibleOpen(false);
        } else {
            setCsReport({
                id: csSlip.id,
                studentNumber: csSlip.student.studentNumber,
                name: `${csSlip.student.firstName} ${csSlip.student.lastName}`,
                section: csSlip.student.section.sectionName,
                head: csSlip.student.section.clusterHead,
                deduction: csSlip.deduction,
                area: csSlip.areaOfCommServ.stationName,
                reason: csSlip.reasonOfCs,
                reports: csSlip.reports
            });
            setIsCollapsibleOpen(true);
        }
    };

    return (
        <div className="list-cs-page-admin">
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
            <div className="list-cs-container">
                <h1>List of Community Service Slips</h1>
                <div className="content-container">
                    <div className="list-cs-search-filter">
                        <input
                            type="text"
                            placeholder="Search by student name"
                            className="list-cs-search-input"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <table className="list-cs-table">
                        <thead>
                            <tr>
                                <th>STUDENT ID</th>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csSlipsToDisplay.map((csSlip, index) => (
                                <React.Fragment key={index}>
                                    <tr onClick={() => handleRowClick(csSlip)}>
                                        <td>{csSlip.student.studentNumber}</td>
                                        <td>{`${csSlip.student.firstName} ${csSlip.student.lastName}`}</td>
                                        <td>{csSlip.areaOfCommServ.stationName}</td>
                                    </tr>
                                    {csReport.id === csSlip.id && (
                                        <tr
                                            ref={collapsibleRef}
                                            style={{ maxHeight: `${collapsibleHeight}` }}
                                            className={`collapsible-section ${isCollapsibleOpen ? 'open' : ''}`}
                                        >
                                            <td colSpan="3">
                                                <CommunityServiceReport
                                                    data={csReport}
                                                    isOpen={isCollapsibleOpen}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {csSlipsToDisplay.length === 0 && (
                                <tr>
                                    <td colSpan="3">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CsListPageAdmin;