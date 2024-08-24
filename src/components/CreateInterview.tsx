import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateInterviewProps {
  apiUrl: string;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({ apiUrl }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [questions, setQuestions] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const interviewData = {
      title: name, // Match the key names with those in your schema
      description,
      email,
      questions: questions.split('\n'), // Ensure this is an array of strings
    };

    console.log('Interview Data:', interviewData);

    fetch(`${apiUrl}/interview/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Interview created successfully:', data);
        navigate('/enterprise-dashboard');
      })
      .catch((error) => {
        console.error('Error creating interview:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Interview</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Interview Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              User's Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Create Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;
