import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admincss/adminlogin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'password123') {
            console.log('Login successful! Redirecting...');

            navigate('/admin/dashboard');


        } else {
            setError('Invalid username or password.');
        }
    };

    useEffect(() => {
        const admin = localStorage.getItem("admin_token");
        if (admin) {
            window.location.href = "/admin/dashboard";
        }
    }, []);


    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-container">
                <div className="login-card">
                    <div className="login-header">
                        <span className="lock-icon">🔒</span>
                        <h1 className="login-title">Admin Portal Login</h1>
                        <p className="login-subtitle">Access Administration Dashboard</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message-box">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">Sign In</button>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </form>
                </div>
            </div>
        </div>
    );
}
