import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (username.trim() === '') {
            setError('Username cannot be empty');
            return;
        }
        
        setError('');
        onLogin(username); 
    };

    return (
        <div className="login-container">
            <h2>Welcome to Chat</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Join Chat</button>
            </form>
        </div>
    );
}
export default Login;