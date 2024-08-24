import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

// Define the structure of an Interview object
interface Interview {
  id: string;
  title: string;
  description: string;
  taken: boolean;
  score: number | null;
}

// Define the props expected by the Analytics component
interface AnalyticsProps {
  apiUrl: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ apiUrl }) => {
  // State to hold the list of interviews and a loading indicator
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch interviews from the API when the component mounts
  useEffect(() => {
    fetch(`${apiUrl}/interview/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data: Interview[]) => {
        // Update state with the fetched interviews and turn off loading
        setInterviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching interviews:', error);
        // Ensure loading is turned off even if there's an error
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div>
      {/* Navbar at the top of the page */}
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 pt-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Interview Analytics</h1>

        {/* Conditionally render content based on loading state and data availability */}
        {loading ? (
          // Show loading message while interviews are being fetched
          <p className="text-lg text-gray-600">Loading interviews...</p>
        ) : interviews.length === 0 ? (
          // Show message if no interviews are found
          <p className="text-lg text-gray-600">No interviews found.</p>
        ) : (
          // Display the interviews in a table format
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Interview Title</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Taken Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Score</th>
                </tr>
              </thead>
              <tbody>
                {/* Iterate through the interviews and render each one in a table row */}
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-t">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{interview.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{interview.description}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {interview.taken ? "Taken" : "Not Taken"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {interview.taken ? (interview.score !== null ? interview.score : "Not Scored Yet") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
