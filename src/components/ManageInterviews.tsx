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
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/interview/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setInterviews(data);
        } else {
          throw new Error('Expected an array of interviews');
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching interviews:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, [apiUrl]);

  const handleEditInterview = (interviewId: string) => {
    navigate(`/edit-interview/${interviewId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 pt-20">
        <h1 className="text-4xl font-bold text-gray-900">Manage Interviews</h1>
        <p className="mt-4 text-lg text-gray-700">
          Edit and manage your existing interviews below.
        </p>

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
          <p className="text-lg text-gray-600 mt-8">No interviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageInterviews;
