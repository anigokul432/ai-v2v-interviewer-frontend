import React from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface EnterpriseDashboardProps {
    username: string;
    handleLogout: () => void;
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ username, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Navbar username={username} handleLogout={handleLogout} />
            <div className="container mx-auto py-20 px-8">
                <h1 className="text-3xl font-bold text-white">Enterprise Dashboard</h1>
                <p className="text-gray-300">Welcome, {username}! This is your enterprise dashboard.</p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div 
                        className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                        onClick={() => navigate('/dashboard/enterprise/create-interview')}
                    >
                        <h2 className="text-xl font-bold text-white">Create Interview</h2>
                        <p className="text-gray-400 mt-4">Start a new interview for candidates.</p>
                    </div>
                    <div 
                        className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                        onClick={() => navigate('/dashboard/enterprise/manage-interviews')}
                    >
                        <h2 className="text-xl font-bold text-white">Manage Interviews</h2>
                        <p className="text-gray-400 mt-4">View, edit, and delete interviews.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseDashboard;
