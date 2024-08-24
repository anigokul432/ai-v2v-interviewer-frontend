import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EnterpriseDashboardProps {
  apiUrl: string;
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  const handleCreateInterview = () => {
    navigate('/create-interview');
  };

  const handleManageInterviews = () => {
    navigate('/manage-interviews');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900">Enterprise Dashboard</h1>
      <p className="mt-4 text-lg text-gray-700">
        Manage interviews and track candidate progress. Use the tools below to navigate through your options.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Create Interview</h2>
          <p className="mt-2 text-gray-600">
            Set up new interview sessions with custom questions and scoring criteria.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleCreateInterview}
          >
            Create
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">View Analytics</h2>
          <p className="mt-2 text-gray-600">
            Analyze candidate performance and track interview progress.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={handleViewAnalytics}
          >
            View Analytics
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
          <p className="mt-2 text-gray-600">
            Add, remove, and edit interview sessions to your liking!
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleManageInterviews}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
