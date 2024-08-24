import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = ({ username, role, handleLogout }) => {
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
        <h1 className="text-5xl font-bold text-white mb-6">Welcome!</h1>
        <p className="text-lg text-gray-300 mb-10">This is a basic template of a full-stack app.</p>
        <div className="space-y-4">
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
