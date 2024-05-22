import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../styles/CreateAccount.css';

import { FaUser } from "react-icons/fa";
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/logo.png';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        memberNumber: '',
        email: ''
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsButtonDisabled(true);  
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                [userType]: {
                    [userType === 'student' ? 'studentNumber' : 'employeeNumber']: formData.memberNumber,
                    email: formData.email
                }
            };
            const response = await Axios.post('http://localhost:8080/user/register', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                if(userType !== 'guest'){
                    navigate('/account/otp');
                }else {
                    navigate('/login');
                }
            } else if (response && response.data) {
                setErrorMessage(response.data);
                setIsButtonDisabled(false);  
            } else {
                console.error('Response data is undefined:', response);
                setIsButtonDisabled(false);  
            }
        } catch (error) {
            console.error('Error:', error);
            setIsButtonDisabled(false);  
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while processing your request.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    return (
        <div className="create-account">
            <div className="form-box-register">
                    <div className="header">
                        <div className="logo">
                            <img src={logo} alt="Logo" id="logo"/>
                        </div>
                        <h1>Register</h1>
                    </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <form onSubmit={handleSubmit} className="form-container">
                
                    <div className="input-box">
                        <label>User Type:</label>
                        <select
                            name="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="select-style"
                        >
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                            <option value="external">External</option>
                            <option value="guest">Guest</option>
                        </select>
                    </div>
                    <div className="input-box">
                        <label>Username:</label>
                        <div className="insert">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                            <FaUser className="icon" />
                        </div>
                    </div>
                    <div className="input-box">
                        <label>Password</label>
                        <div className="insert">
                            <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            {showPassword ? (
                                <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                            ) : (
                                <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                            )}
                        </div>    
                    </div> 
                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>{userType === 'student' ? 'Student Number:' : 'Employee Number:'}</label>
                            <input type="text" name="memberNumber" value={formData.memberNumber} onChange={handleChange} />
                        </div>
                    )}
                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={isButtonDisabled}
                        className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
