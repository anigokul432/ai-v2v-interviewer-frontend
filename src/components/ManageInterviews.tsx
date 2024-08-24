import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all interviews created by the enterprise
    fetch(`${apiUrl}/interview/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure the token is stored in localStorage
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
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching interviews:', error);
      });
  }, [apiUrl]);

  const handleEditInterview = (interviewId: string) => {
    navigate(`/edit-interview/${interviewId}`);
  };

  const handleDeleteInterview = (interviewId: string) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      fetch(`${apiUrl}/interview/delete/${interviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete interview');
          }
          // Remove the deleted interview from the state
          setInterviews(interviews.filter((interview) => interview.id !== interviewId));
        })
        .catch((error) => {
          setError(error.message);
          console.error('Error deleting interview:', error);
        });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900">Manage Interviews</h1>
      <p className="mt-4 text-lg text-gray-700">
        Edit and manage your existing interviews below.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800">{interview.title}</h2>
              <p className="mt-2 text-gray-600">{interview.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleEditInterview(interview.id)}
              >
                Edit
              </button>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
                onClick={() => handleDeleteInterview(interview.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">No interviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageInterviews;
