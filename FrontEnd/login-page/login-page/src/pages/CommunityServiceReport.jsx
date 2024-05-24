import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CommunityServiceReport.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import { useNavigate } from "react-router-dom";

const CsReportPageAdmin = ({data}) => {
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
                                value={data.name} disabled
                            />
                        </div>
                        <div className="field-container">
                            <input 
                                type="text" 
                                className="input-field" 
                                name="name" 
                                placeholder="AREA OF COMMUNITY SERVICE"
                                value={data.area} disabled
                            />
                        </div>
                    </div>

                    {/* {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )} */}

                    <table className="cs-report-table">
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
                            {data.reports.length === 0 && (
                                <tr>
                                    <td colSpan="10">No Student selected.</td>
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