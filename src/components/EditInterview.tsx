import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Define the props expected by the EditInterview component
interface EditInterviewProps {
  apiUrl: string;
}

// Define the structure of the interview data
interface InterviewData {
  title: string;
  description: string;
  questions: string[];
}

const EditInterview: React.FC<EditInterviewProps> = ({ apiUrl }) => {
  const { interviewId } = useParams<{ interviewId: string }>(); // Get the interview ID from the URL
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewData | null>(null); // State to hold the fetched interview data
  const [title, setTitle] = useState<string>(''); // State to hold the interview title input
  const [description, setDescription] = useState<string>(''); // State to hold the interview description input
  const [questions, setQuestions] = useState<string>(''); // State to hold the interview questions input

  // Fetch the interview data when the component mounts
  useEffect(() => {
    fetch(`${apiUrl}/interview/${interviewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure the token is included for authentication
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch interview'); // Handle any errors that occur
        }
        return response.json(); // Parse the response data
      })
      .then((data: InterviewData) => {
        console.log("Fetched interview data:", data);
        setInterview(data); // Set the fetched interview data to state
        setTitle(data.title || ''); // Initialize the title input with fetched data
        setDescription(data.description || ''); // Initialize the description input with fetched data
        setQuestions((data.questions && data.questions.join('\n')) || ''); // Initialize the questions input with fetched data
      })
      .catch((error) => {
        console.error('Error fetching interview:', error); // Log any errors
      });
  }, [apiUrl, interviewId]); // Dependency array ensures this effect runs only when apiUrl or interviewId changes

  // Handle form submission to update the interview
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    const updatedInterview: InterviewData = {
      title, // Use the current title input value
      description, // Use the current description input value
      questions: questions.split('\n'), // Split the questions input into an array of strings
    };

    // Send a PUT request to update the interview with the new data
    fetch(`${apiUrl}/interview/update/${interviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is included for authentication
      },
      body: JSON.stringify(updatedInterview), // Convert the updated interview data to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update interview'); // Handle any errors that occur
        }
        return response.json(); // Parse the response data
      })
      .then((data) => {
        console.log('Interview updated successfully:', data);
        navigate('/manage-interviews'); // Redirect to the manage interviews page after a successful update
      })
      .catch((error) => {
        console.error('Error updating interview:', error); // Log any errors
      });
  };

  // Display a loading message while the interview data is being fetched
  if (!interview) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Interview</h1>
        <form onSubmit={handleUpdate}>
          {/* Interview Title Input */}
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
              Update Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;
