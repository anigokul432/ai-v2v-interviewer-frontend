import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/loggedin/CandidateDashboard';
import EnterpriseDashboard from './pages/loggedin/EnterpriseDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [username, setUsername] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("App component mounted or updated");
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        if (storedUsername && storedRole) {
            console.log("Setting username and role from localStorage");
            setUsername(storedUsername);
            setRole(storedRole);
        }
        setIsLoading(false);
    }, []);

    const isAuthenticated = username !== '';

    const handleLogout = useCallback(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('access_token');
        setUsername('');
        setRole('');
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home username={username} role={role} handleLogout={handleLogout} />} />
                    <Route path="/login" element={<Login setUsername={setUsername} setRole={setRole} />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/dashboard/user" 
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="user">
                                <CandidateDashboard username={username} handleLogout={handleLogout} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard/enterprise" 
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="enterprise">
                                <EnterpriseDashboard username={username} handleLogout={handleLogout} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
