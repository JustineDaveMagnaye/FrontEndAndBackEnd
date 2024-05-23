import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/EmployeeCsSlip.css';
import axios from "axios"; 
import AddCsReportModal from './AddCsReportModal';

const EmployeeCsSlip = ({ data }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setMessage(""); // Clear message when closing modal
    }, []);

    const handleAddCsReport = useCallback(async (csSlipId, newCsReport) => {
        try {
            const startTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeIn}`;
            const endTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeOut}`;

            const startTime = new Date(startTimeString);
            const endTime = new Date(endTimeString);
            const diffInMs = endTime - startTime;
            const hours = diffInMs / (1000 * 60 * 60);
            newCsReport.hoursCompleted = hours.toFixed(2);

            const params = {
                dateOfCs: newCsReport.dateOfCs,
                timeIn: startTime,
                timeOut: endTime,
                hoursCompleted: parseFloat(newCsReport.hoursCompleted),
                natureOfWork: newCsReport.natureOfWork,
                status: newCsReport.status,
                remarks: newCsReport.remarks
            };

            const response = await axios.post(`http://localhost:8080/CSReport/commServReport/${csSlipId}`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            setMessage(response.data);
            closeModal();
            data.reports.push(response.data);
        } catch (error) {
            console.error('Error adding CsReport:', error);
            setMessage("CS Report cannot be added");
        }
    }, [closeModal, data.reports]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    const isSubmitDisabled = !data.id;

    return data && (
        <div className="cs-slip-page-employee">
            <div className="csSlipcontainer">
                <h1>Community Service Report</h1>
                <div className="cs-slip-content-container">
                    <div className="input-container">

                        <div className="field-container">
                            <label>Student ID:</label>
                            <input type="text" className="input-fields" name="student-id" value={data.studentNumber} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Full Name:</label>
                            <input type="text" className="input-fields" name="name" value={data.name} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Section:</label>
                            <input type="text" className="input-fields" name="section" value={data.section} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Cluster Head:</label>
                            <input type="text" className="input-fields" name="head" value={data.head} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Hours to deduct:</label>
                            <input type="text" className="input-fields" name="deduction" value={data.deduction} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Area of Community Service:</label>
                            <input type="text" className="input-fields" name="area" value={data.area} disabled/>
                        </div>
                        <div className="field-container">
                            <label>Reason for Community Service:</label>
                            <input type="text" className="input-fields" name="reasonOfCs" value={data.reason} disabled />
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
                                <th>Office</th>
                                <th>Status</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.reports && data.reports.map(report => (
                                <tr key={report.id}>
                                    <td>{formatDate(report.dateOfCs)}</td>
                                    <td>{formatTime(report.timeIn)}</td>
                                    <td>{formatTime(report.timeOut)}</td>
                                    <td>{report.hoursCompleted}</td>
                                    <td>{report.natureOfWork}</td>
                                    <td>{data.area}</td>
                                    <td>{report.status}</td>
                                    <td>{report.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bottom-container">
                        <button onClick={openModal}  disabled={isSubmitDisabled} className="add-report-button">ADD REPORT</button>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
            <AddCsReportModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleAddCsReport} csSlipId={data.id} />
        </div>
    );
};

export default EmployeeCsSlip;
