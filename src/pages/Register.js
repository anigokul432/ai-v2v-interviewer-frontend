import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'user') {
                await api.registerUser({ username, password });
            } else if (role === 'enterprise') {
                await api.registerEnterprise({ username, password });
            }
            navigate('/'); // Navigate to the home page after successful registration
        } catch (error) {
            console.error(error);
            alert(`Error registering ${role}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col justify-center items-center">
            <Navbar />
            <div className="w-full max-w-md bg-white p-6 rounded shadow animate-fadeInUp">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-4 border rounded">
                        <option value="user">User</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300 ease-in-out">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
