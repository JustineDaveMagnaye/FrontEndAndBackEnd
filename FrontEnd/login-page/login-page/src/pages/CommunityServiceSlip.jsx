import React, { useState, useEffect } from "react";
import '../styles/CommunityServiceSlip.css';
import axios from "axios";
import { debounce } from 'lodash';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo_new.png';

const CsSlipPageAdmin = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        deduction: '',
        areaId: '',
        reasonOfCs: ''
    });

    const [stations, setStations] = useState([]);
    const [violations, setViolations] = useState([]);
    const [totalHoursRequired, setTotalHoursRequired] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const role = localStorage.getItem('role')
        let exp = localStorage.getItem('exp')
        let currentDate = new Date();
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login')
        }
        if(role != "ROLE_ROLE_ADMIN"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation')
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation')
            } else {
                navigate('/login')
            }
        }
        const fetchStations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Station/stations', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setStations(response.data);
            } catch (error) {
                console.error('Error fetching stations:', error);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (formData.studentId.trim() !== '') {
                    debouncedFetchStudentDetails(formData.studentId);
                    debouncedFetchStudentViolation(formData.studentId);
                    fetchTotalHoursRequired(formData.studentId);
                } else {
                    setFormData(prevState => ({
                        ...prevState,
                        name: '',
                        section: '',
                        head: ''
                    }));
                    setViolations([]);
                    setTotalHoursRequired('');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, [formData.studentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchStudentDetails = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/Student/student/${studentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const student = response.data;
            if (student === null) {
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                name: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                section: student.section.sectionCourse,
                head: student.section.clusterHead
            }));
        } catch (error) {
            console.error('Error getting student info:', error);
        }
    };

    const fetchStudentViolation = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/Violation/violation/student/${studentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setViolations(response.data);
        } catch (error) {
            console.error('Error getting violations:', error);
        }
    };

    const fetchTotalHoursRequired = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/CSSlip/totalCsHours/${studentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setTotalHoursRequired(response.data);
        } catch (error) {
            console.error('Error getting total hours required:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.studentId, 
                student: { id: formData.studentId }, 
                reasonOfCs: formData.reasonOfCs,
                areaOfCommServ: { id: formData.areaId },
                deduction: formData.deduction
            };

            const response = await axios.post('http://localhost:8080/CSSlip/csSlip', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response && response.data) {
                alert(response.data);
            } else {
                console.error('Response data is undefined:', response);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An error occurred while processing the request.');
            }
        }
    };

    const debouncedFetchStudentDetails = debounce(fetchStudentDetails, 300);
    const debouncedFetchStudentViolation = debounce(fetchStudentViolation, 300);
    const handleLogout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login')
    };
    return (
        <div className="cs-slip-page-admin">
            <nav className="nav-bar">
                <img src={logo} alt="Logo" className="rc-logo"/>
                <div className="nav-links">
                    <a className="nav-link" href="/admin/offense">Offense</a>
                    <a className="nav-link" href="/admin/violation">Violation</a>
                    <a className="nav-link" href="/admin/cs-list">CS Slips</a>
                    <a className="nav-link" href="#" onMouseDown={handleLogout}>Logout</a>
                </div>
            </nav>
            <div className="csSlipcontainer">
                <h1>COMMUNITY SERVICE SLIP</h1>
                <div className="cs-slip-container">
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <div className="field-container">
                                <label>Student ID:</label>
                                <input type="text" className="input-field" name="studentId" value={formData.studentId} onChange={handleInputChange} />
                            </div>
                            <div className="field-container">
                                <label>Full Name:</label>
                                <input type="text" className="input-field" name="name" value={                                formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="field-container">
                                <label>Section:</label>
                                <input type="text" className="input-field" name="section" value={formData.section} onChange={handleInputChange} />
                            </div>
                            <div className="field-container">
                                <label>Cluster Head:</label>
                                <input type="text" className="input-field" name="head" value={formData.head} onChange={handleInputChange} />
                            </div>
                            <div className="field-container">
                                <label>Hours to Deduct:</label>
                                <input type="text" className="input-field" name="deduction" value={formData.deduction} onChange={handleInputChange} />
                            </div>
                            <div className="field-container">
                                <label>Area of Community Service:</label>
                                <select className="input-field" name="areaId" value={formData.areaId} onChange={handleInputChange}>
                                    <option value="">Select an area</option>
                                    {stations.map(station => (
                                        <option key={station.id} value={station.id}>{station.stationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field-container">
                                <label>Reason for Community Service:</label>
                                <input type="text" className="input-field" name="reasonOfCs" value={formData.reasonOfCs} onChange={handleInputChange} />
                            </div>
                        </div>
                        <table className="cs-slip-table">
                            <thead>
                                <tr>
                                    <th>STUDENT</th>
                                    <th>OFFENSE</th>
                                    <th>CS HOURS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.map(violation => (
                                    <tr key={violation.id}>
                                        <td>{violation.student.studentNumber}</td>
                                        <td>{violation.offense.description}</td>
                                        <td>{violation.csHours}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bottom-container">
                            <div className="total-container">
                                <label>Total Hours Required: </label>
                                <input type="text" className="input-hours" name="hoursRequired" value={totalHoursRequired} readOnly />
                            </div>
                            <button type="submit" className="create-button">CREATE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CsSlipPageAdmin;

