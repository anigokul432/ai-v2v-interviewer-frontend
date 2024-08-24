import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface HomeProps {
  username: string;
  role: string;
  handleLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ username, role, handleLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      if (role === 'enterprise') {
        navigate('/dashboard/enterprise');
      } else {
        navigate('/dashboard/user');
      }
    }
  }, [username, role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col justify-center items-center overflow-hidden">
      <Navbar />
      <div className="text-center animate-fadeInUp">
        {/* Main Content */}
        <h1 className="text-6xl font-semibold text-white mb-6">Speed up hiring!</h1>
        <p className="text-2xl text-gray-300">Screen more applicants and make informed</p>
        <p className="text-2xl text-gray-300">decisions using your AI-powered recruiter</p>
        <div className="space-y-4 mt-10">
          <button
            onClick={() => navigate('/login')}
            className="block w-64 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl mx-auto transition duration-300 ease-in-out"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="block w-64 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl mx-auto transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
