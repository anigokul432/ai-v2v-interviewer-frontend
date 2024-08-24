import React, { useState, useEffect } from 'react';

interface Interview {
  id: string;
  title: string;
  description: string;
  taken: boolean;
  score: number | null;
}

interface AnalyticsProps {
  apiUrl: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ apiUrl }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

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
        console.log("Fetched interviews:", data);
        setInterviews(data);
      })
      .catch((error) => {
        console.error('Error fetching interviews:', error);
      });
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Interview Analytics</h1>

      {interviews.length === 0 ? (
        <p className="text-lg text-gray-600">No interviews found.</p>
      ) : (
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
  );
};

export default Analytics;
