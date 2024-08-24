import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, role, requiredRole, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (role !== requiredRole) {
        // Redirect to the correct dashboard based on the user's role
        if (role === 'enterprise') {
            return <Navigate to="/dashboard/enterprise" />;
        } else {
            return <Navigate to="/dashboard/user" />;
        }
    }

    return children;
};

export default ProtectedRoute;
