import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface ManageInterviewsProps {
  apiUrl: string;
}

interface Interview {
  id: string;
  title: string;
  description: string;
}

const ManageInterviews: React.FC<ManageInterviewsProps> = ({ apiUrl }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]); // State to store fetched interviews
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to store any errors encountered
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Fetch interviews when the component mounts
  useEffect(() => {
    fetch(`${apiUrl}/interview/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the auth token in the request
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch interviews'); // Handle non-200 HTTP responses
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setInterviews(data); // Store the fetched interviews in state
        } else {
          throw new Error('Expected an array of interviews'); // Handle unexpected data format
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        setError(error.message); // Store the error message in state
        console.error('Error fetching interviews:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, [apiUrl]);

  // Handle the action of editing an interview by navigating to the edit page
  const handleEditInterview = (interviewId: string) => {
    navigate(`/edit-interview/${interviewId}`);
  };

  return (
    <div>
      <Navbar /> {/* Navbar component for consistent navigation */}
      <div className="min-h-screen bg-gray-100 p-8 pt-20">
        <h1 className="text-4xl font-bold text-gray-900">Manage Interviews</h1>
        <p className="mt-4 text-lg text-gray-700">
          Edit and manage your existing interviews below.
        </p>

        {/* Conditionally render content based on loading, error, and data availability */}
        {loading ? (
          <p className="text-lg text-gray-600 mt-8">Loading interviews...</p> // Display loading message while fetching
        ) : error ? (
          <p className="text-lg text-red-600 mt-8">Error: {error}</p> // Display error message if there's an error
        ) : interviews.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800">{interview.title}</h2>
                <p className="mt-2 text-gray-600">{interview.description}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleEditInterview(interview.id)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600 mt-8">No interviews found.</p> // Display message when no interviews are found
        )}
      </div>
    </div>
  );
};

export default ManageInterviews;
