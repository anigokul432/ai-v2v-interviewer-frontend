import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import api from '../services/api';

const Login = ({ setUsername, setRole }) => {
    const [username, setUsernameLocal] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            // Send login request to the server
            const response = await api.login(formData);

            // Extract the access token from the response
            const { access_token } = response.data;

            // Decode the JWT to get the role
            const decodedToken = jwtDecode(access_token);
            const role = decodedToken.role;

            console.log("Role extracted from token:", role);

            localStorage.setItem('username', username);
            localStorage.setItem('role', role);

            setUsername(username);
            setRole(role);

            // Navigate to the appropriate dashboard based on role
            if (role === 'enterprise') {
                navigate('/dashboard/enterprise');
            } else {
                navigate('/dashboard/user');
            }
        } catch (error) {
            console.error("Error message:", error.message);
            alert('Error logging in');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col justify-center items-center">
            <Navbar />
            <div className="w-full max-w-md bg-white p-6 rounded shadow animate-fadeInUp">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsernameLocal(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300 ease-in-out">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
