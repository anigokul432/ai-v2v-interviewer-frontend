import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// Define the props expected by the Home component
interface HomeProps {
  apiUrl: string;
}

// Home component that serves as the landing page
const Home: React.FC<HomeProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  // Function to navigate to the Enterprise Dashboard
  const handleEnterpriseLogin = () => {
    navigate('/enterprise-dashboard');
  };

  // Function to navigate to the Candidate Sign-In page
  const handleCandidateLogin = () => {
    navigate('/signin');
  };

  return (
    <div>
      {/* Navbar component at the top of the page */}
      <Navbar />

      {/* Main content section with a centered layout */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-blue-50 to-blue-100">
        {/* Page title */}
        <h1 className="text-6xl font-extrabold text-blue-900 mb-6">Start Hiring the best FAST!</h1>

        {/* Introductory text */}
        <p className="text-2xl text-gray-800 mb-10">
          Start your journey to success with our AI-powered interviews!
        </p>

        {/* Buttons for navigating to different parts of the application */}
        <div className="flex space-x-6">
          {/* Button for Enterprise Login */}
          <button
            onClick={handleEnterpriseLogin}
            className="px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-800"
          >
            Enterprise Login
          </button>

          {/* Button for Candidate Login */}
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
