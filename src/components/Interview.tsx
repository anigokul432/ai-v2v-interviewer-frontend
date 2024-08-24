import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface InterviewProps {
  apiUrl: string;
}

interface InterviewData {
  id: string;
  title: string;
  questions: string[];
}

interface FollowUpResponse {
  followup_question: string;
}

const Interview: React.FC<InterviewProps> = ({ apiUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { interview } = location.state as { interview: InterviewData } || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversation, setConversation] = useState<[string, string][]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpStage, setFollowUpStage] = useState(0); // 0: No follow-up, 1: First follow-up, 2: Second follow-up

  const handleNextQuestion = async () => {
    const question = followUp || interview.questions[currentQuestionIndex];
    
    // Store the current question and user's answer in the conversation array
    setConversation([...conversation, [question, userAnswer]]);
    setUserAnswer("");
    setLoading(true);

    if (followUpStage === 0) {
      // First follow-up
      const response = await fetch(`${apiUrl}/interview/gpt-followup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previous_question: question,
          previous_answer: userAnswer,
        }),
      });

      const data: FollowUpResponse = await response.json();
      setLoading(false);

      if (response.ok) {
        // Set the first follow-up question
        setFollowUp(data.followup_question);
        setFollowUpStage(1);
      } else {
        console.error("Error fetching GPT follow-up:", data);
      }
    } else if (followUpStage === 1) {
      // Second follow-up
      const response = await fetch(`${apiUrl}/interview/gpt-followup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previous_question: followUp, // First follow-up question
          previous_answer: userAnswer,
        }),
      });

      const data: FollowUpResponse = await response.json();
      setLoading(false);

      if (response.ok) {
        // Set the second follow-up question
        setFollowUp(data.followup_question);
        setFollowUpStage(2);
      } else {
        console.error("Error fetching GPT follow-up:", data);
      }
    } else {
      // Move to the next original question after the second follow-up
      setFollowUp(null);
      setFollowUpStage(0);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLoading(false);
    }
  };

  const handleSubmitInterview = async () => {
    const payload = {
      interview_id: interview.id,
      conversation: conversation,
    };
  
    try {
      const response = await fetch(`${apiUrl}/interview/submit-conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Conversation submitted successfully:", data);
        navigate('/user-dashboard');
      } else {
        console.error("Error submitting conversation:", data);
      }
    } catch (error) {
      console.error("Error submitting conversation:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          {interview?.title || 'Interview'}
        </h1>

        {(currentQuestionIndex < interview.questions.length || followUp) && !loading && (
          <>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-blue-600">Q:</span> {followUp || interview.questions[currentQuestionIndex]}
            </p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Type your answer here..."
            />
            <button
              onClick={handleNextQuestion}
              className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {followUpStage === 0 ? "Submit Answer" : "Next Follow-Up"}
            </button>
          </>
        )}

        {loading && <p className="text-lg text-gray-600 mt-4 text-center">Loading next question...</p>}

        {currentQuestionIndex >= interview.questions.length && !followUp && (
          <button
            onClick={handleSubmitInterview}
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default Interview;
