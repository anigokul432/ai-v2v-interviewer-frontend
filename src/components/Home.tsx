import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-blue-50 to-blue-100">
        <h1 className="text-6xl font-extrabold text-blue-900 mb-6">Start Hiring the best FAST!</h1>
        <p className="text-2xl text-gray-800 mb-10">Start your journey to success with our AI-powered interviews!</p>

        <div className="flex space-x-6">
          <button
            onClick={handleEnterpriseLogin}
            className="px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-800"
          >
            Enterprise Login
          </button>

          <button
            onClick={handleCandidateLogin}
            className="px-8 py-4 bg-gray-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-800"
          >
            Candidate Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
