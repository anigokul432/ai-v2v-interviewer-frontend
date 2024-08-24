import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// Define the props expected by the EnterpriseDashboard component
interface EnterpriseDashboardProps {
  apiUrl: string;
}

// EnterpriseDashboard component to manage interview-related tasks
const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  // Function to navigate to the Create Interview page
  const handleCreateInterview = () => {
    navigate('/create-interview');
  };

  // Function to navigate to the Manage Interviews page
  const handleManageInterviews = () => {
    navigate('/manage-interviews');
  };

  // Function to navigate to the Analytics page
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20">
      {/* Navbar component at the top of the page */}
      <Navbar />

      <div className="p-8">
        {/* Page title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Enterprise Dashboard</h1>

        {/* Introductory text */}
        <p className="text-lg text-gray-700 mb-10">
          Manage interviews and track candidate progress. Use the tools below to navigate through your options.
        </p>

        {/* Grid layout for the dashboard options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create Interview card */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-800">Create Interview</h2>
            <p className="mt-2 text-gray-600">
              Set up new interview sessions with custom questions and scoring criteria.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
              onClick={handleCreateInterview}
            >
              Create
            </button>
          </div>

          {/* View Analytics card */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-800">View Analytics</h2>
            <p className="mt-2 text-gray-600">
              Analyze candidate performance and track interview progress.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700"
              onClick={handleViewAnalytics}
            >
              View Analytics
            </button>
          </div>

          {/* Manage Interviews card */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Interviews</h2>
            <p className="mt-2 text-gray-600">
              Add, remove, and edit interview sessions to your liking!
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
              onClick={handleManageInterviews} // Uncomment to activate this button
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
