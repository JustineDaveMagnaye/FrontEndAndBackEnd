import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CommunityServiceReport.css';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import Collapsible from 'react-collapsible';
import { useNavigate } from "react-router-dom";

const CsReportPageAdmin = ({ data, isOpen }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    return (
        <Collapsible trigger="" open={isOpen}>
            <div className="cs-report-page-admin">
                <div className="report-container">
                    <h1 className="report-header">COMMUNITY SERVICE REPORT</h1>
                    <div className="content-report">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Area of Community Service</th>
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
                                        <td>{data.name}</td>
                                        <td>{data.area}</td>
                                        <td>{formatDate(report.dateOfCs)}</td>
                                        <td>{formatTime(report.timeIn)}</td>
                                        <td>{formatTime(report.timeOut)}</td>
                                        <td>{report.hoursCompleted}</td>
                                        <td>{report.natureOfWork}</td>
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
        </Collapsible>
    );
};

export default CsReportPageAdmin;