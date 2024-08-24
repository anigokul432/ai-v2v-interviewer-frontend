import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface UserDashboardProps {
  apiUrl: string;
}

interface Interview {
  id: string;
  title: string;
  description: string;
  taken: boolean;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ apiUrl }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/interview/user-interviews`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInterviews(data);
        } else if (data && typeof data === 'object') {
          setInterviews([data]);
        } else {
          setInterviews([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching interviews:', error);
      });
  }, [apiUrl]);

  const handleTakeInterview = (interview: Interview) => {
    if (!interview.taken) {
      navigate(`/interview/${interview.id}`, { state: { interview } });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-40">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Interviews</h1>
        {interviews.length === 0 ? (
          <p className="text-lg text-gray-600">No interviews assigned to you yet.</p>
        ) : (
          <ul className="w-full max-w-lg">
            {interviews.map((interview, index) => (
              <li key={index} className="p-4 mb-4 bg-white rounded shadow">
                <h2 className="text-xl font-medium text-gray-800">{interview.title}</h2>
                <p className="text-gray-600">{interview.description}</p>
                <button
                  onClick={() => handleTakeInterview(interview)}
                  className={`mt-4 px-4 py-2 rounded ${
                    interview.taken 
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={interview.taken}
                >
                  {interview.taken ? "Taken" : "Take"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
