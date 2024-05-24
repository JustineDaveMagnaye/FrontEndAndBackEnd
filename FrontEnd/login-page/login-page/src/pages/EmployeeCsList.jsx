import React, { useState, useEffect } from "react";
import '../styles/EmployeeCsList.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import '../styles/EmployeeCsSlip.css';
import EmployeeCsSlip from "./EmployeeCsSlip";

const EmployeeCsList = () => {
    const [userId, setUserId] = useState('');
    const [employee, setEmployee] = useState('');

    const [csSlip, setCsSlip] = useState({
        id: "",
        studentNumber: "",
        studentId: "",
        name: "",
        section: "",
        head: "",
        deduction: "",
        area: "",
        reason: "",
        reports: []
    });
    
    const [csSlips, setCsSlips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('userId');
        setUserId(id);
        console.log(id);

        loadUser(id);
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        const role = localStorage.getItem('role')
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login')
        }
        if(role != "ROLE_ROLE_EMPLOYEE"){
            if(role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_ADMIN"){
                navigate('/admin/offense')
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation')
            } else {
                navigate('/login')
            }
        }
    }, []);

    const loadUser = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/Employee/employee/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setEmployee(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching community service slips:', error);
        }
    };

    useEffect(() => {
        loadCsSlips(employee);
    }, [employee]);

    const loadCsSlips = async (employee) => {
        try {
            const response = await axios.get(`http://localhost:8080/CSSlip/commServSlip/areaOfCs/${employee.station.stationName}`, {
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

    const handleRowClick = (csSlip) => {
        setCsSlip({
            id: csSlip.id,
            studentNumber: csSlip.student.studentNumber,
            studentId: csSlip.student.id,
            name: `${csSlip.student.firstName} ${csSlip.student.lastName}`,
            section: csSlip.student.section.sectionName,
            head: csSlip.student.section.clusterHead,
            deduction: csSlip.deduction,
            area: csSlip.areaOfCommServ.stationName,
            reason: csSlip.reasonOfCs,
            reports: csSlip.reports
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="list-cs-page-admin">
                <nav className="nav-bar">
                    <img src={logo} alt="Logo" className="rc-logo"/>
                    <div className="nav-links">
                        <a href="/student/violation">Reports</a>
                        <a href="#" onMouseDown={handleLogout}>Logout</a>
                        <img src={user} alt="profile" className="profile"/>

                    </div>
                </nav>
            <div className="employee-container">
                <h1>Community Service Slips</h1>
                <div className="content-container">
                    <table className="csList-table">
                        <thead>
                            <tr>
                                <th>STUDENT ID</th>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csSlips.map((csSlip, index) => (
                                <tr key={index} onClick={() => handleRowClick(csSlip)}>
                                    <td>
                                        
                                            {csSlip.student.studentNumber}
                                        
                                    </td>
                                    <td>
                                            {`${csSlip.student.firstName} ${csSlip.student.lastName}`}
                                        
                                    </td>
                                    <td>
                                            {csSlip.areaOfCommServ.stationName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <EmployeeCsSlip
                    data = {csSlip}
                />
            </div>
        </div>
    );
};

export default EmployeeCsList;
