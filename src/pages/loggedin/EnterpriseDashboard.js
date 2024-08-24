import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const EnterpriseDashboard = ({ username, handleLogout }) => {
    console.log('Enterprise component re-rendered');
    const [funFact, setFunFact] = useState('');

    useEffect(() => {
        const fetchFunFact = async () => {
            try {
                const response = await axios.get('http://localhost:8000/fun-fact');
                setFunFact(response.data.fun_fact);
            } catch (error) {
                console.error("Error fetching fun fact:", error);
            }
        };

        fetchFunFact();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Navbar username={username} handleLogout={handleLogout} />
            <div className="container mx-auto py-20 px-8">
                <h1 className="text-3xl font-bold text-white">Enterprise Dashboard</h1>
                <p className="text-gray-300">Welcome, {username}! This is your enterprise dashboard.</p>
                <p className="mt-10 text-lg text-gray-300">Fun Fact: {funFact}</p>
            </div>
        </div>
    );
};

export default EnterpriseDashboard;
