import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface EditInterviewProps {
  apiUrl: string;
}

interface InterviewData {
  title: string;
  description: string;
  questions: string[];
}

const EditInterview: React.FC<EditInterviewProps> = ({ apiUrl }) => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [questions, setQuestions] = useState<string>('');

  useEffect(() => {
    fetch(`${apiUrl}/interview/${interviewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure the token is included
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch interview');
        }
        return response.json();
      })
      .then((data: InterviewData) => {
        console.log("Fetched interview data:", data);
        setInterview(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setQuestions((data.questions && data.questions.join('\n')) || '');
      })
      .catch((error) => {
        console.error('Error fetching interview:', error);
      });
  }, [apiUrl, interviewId]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedInterview: InterviewData = {
      title,
      description,
      questions: questions.split('\n'),
    };

    fetch(`${apiUrl}/interview/update/${interviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedInterview),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update interview');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Interview updated successfully:', data);
        navigate('/manage-interviews');
      })
      .catch((error) => {
        console.error('Error updating interview:', error);
      });
  };

  if (!interview) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Interview</h1>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Interview Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questions">
              Questions (one per line)
            </label>
            <textarea
              id="questions"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              rows={6}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;
