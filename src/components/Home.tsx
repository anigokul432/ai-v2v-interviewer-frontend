import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  apiUrl: string;
}

const Home: React.FC<HomeProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  const handleEnterpriseLogin = () => {
    navigate('/enterprise-dashboard');
  };

  const handleCandidateLogin = () => {
    navigate('/signin');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to AI Interview Bot</h1>
      <p className="mt-4 text-lg text-gray-700">Start your journey to success with our AI-powered interviews!</p>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleEnterpriseLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Enterprise Login
        </button>

        <button
          onClick={handleCandidateLogin}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Candidate Login
        </button>
      </div>
    </div>
  );
};

export default Home;
