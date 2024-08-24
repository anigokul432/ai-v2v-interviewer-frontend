import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the props expected by the CreateInterview component
interface CreateInterviewProps {
  apiUrl: string;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({ apiUrl }) => {
  // State variables to hold the form inputs
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [questions, setQuestions] = useState<string>('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare the interview data to be sent to the backend
    const interviewData = {
      title: name, // The name of the interview
      description, // The description of the interview
      email, // The email associated with the interview
      questions: questions.split('\n'), // Convert the multiline input into an array of questions
    };

    console.log('Interview Data:', interviewData); // Log the interview data for debugging

    // Send a POST request to create the interview
    fetch(`${apiUrl}/interview/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData), // Convert the interview data to a JSON string
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log('Interview created successfully:', data); // Log success message
        navigate('/enterprise-dashboard'); // Redirect to the enterprise dashboard after creation
      })
      .catch((error) => {
        console.error('Error creating interview:', error); // Log any errors that occur
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Interview</h1>
        <form onSubmit={handleSubmit}>
          {/* Interview Name Input */}
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
          {/* Description Input */}
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
          {/* User's Email Input */}
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
          {/* Questions Input */}
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
          {/* Submit Button */}
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
