import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import '../styles/EmployeeCsSlip.css';
import logo from '../assets/logo_new.png';
import axios from "axios"; 
import AddCsReportModal from './AddCsReportModal';
import { useNavigate } from "react-router-dom";
const EmployeeCsSlip = ({data}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddCsReport = async (newCsReport) => {
        try {

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10); 
            const startTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeIn}`;
            const endTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeOut}`;

            const startTime = new Date(startTimeString);
            const endTime = new Date(endTimeString);
            const diffInMs = endTime - startTime;
            const hours = diffInMs / (1000 * 60 * 60);
            newCsReport.hoursCompleted = hours.toFixed(2);

            let params = {
                dateOfCs: newCsReport.dateOfCs,
                timeIn: startTime,
                timeOut: endTime,
                hoursCompleted: parseInt(newCsReport.hoursCompleted),
                natureOfWork: newCsReport.natureOfWork,
                status: newCsReport.status,
                remarks: newCsReport.remarks
            };
           
            const response = await axios.post("http://localhost:8080/CSReport/commServReport", params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setMessage(response.data);
            closeModal();
        } catch (error) {
            console.error('Error adding CsReport:', error);
            setMessage("CS Report cannot be added");
        }
    };
    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login')
    };
    return data && (
        <div className="cs-slip-page-admin">
                <nav className="nav-bar">
                    <img src={logo} alt="Logo" className="rc-logo"/>
                    <div className="nav-links">
                        <a href="/student/violation">REPORTS</a>
                        <a href="#" onMouseDown={handleLogout}>Logout</a>
                    </div>
                </nav>
                <div className="csSlipcontainer">
                    <h1>COMMUNITY SERVICE SLIP</h1>
                    <div className="cs-slip-content-container">
                        <div className="input-container">
                            <div className="field-container">
                                <label>Student ID:</label>
                                <input type="text" className="input-field" name="student-id" value={data.studentNumber} disabled/>
                            </div>
                            <div className="field-container">
                                <label>Full Name:</label>
                                <input type="text" className="input-field" name="name" value={data.name} disabled/>
                            </div>
                            <div className="field-container">
                                <label>Section:</label>
                                <input type="text" className="input-field" name="section" value={data.section} disabled/>
                            </div>
                            <div className="field-container">
                                <label>Cluster Head:</label>
                                <input type="text" className="input-field" name="head" value={data.head} disabled/>
                            </div>
                            <div className="field-container">
                                <label>Hours to deduct:</label>
                                <input type="text" className="input-field" name="deduction" value={data.deduction} disabled/>
                            </div>
                            <div className="field-container">
                                <label>Area of Community Service:</label>
                                <input type="text" className="input-field" name="area" value={data.area} disabled/>
                            </div>
                        </div>
                        <table className="cs-slip-table">
                            <thead>
                                <tr>
                                    <th>Date of CS</th>
                                    <th>Time In</th>
                                    <th>Time Out</th>
                                    <th>Hours Completed</th>
                                    <th>Nature of Work</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.reports && data.reports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.dateOfCs}</td>
                                        <td>{report.timeIn}</td>
                                        <td>{report.timeOut}</td>
                                        <td>{report.hoursCompleted}</td>
                                        <td>{report.natureOfWork}</td>
                                        <td>{report.status}</td>
                                        <td>{report.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bottom-container">
                            <button onClick={openModal} className="add-report-button">ADD REPORT</button>
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                </div>
                <AddCsReportModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleAddCsReport} />
            </div>
    );
};

export default EmployeeCsSlip;
