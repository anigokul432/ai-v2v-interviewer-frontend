import React, { useState, useEffect } from 'react';
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
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null); // Track the last spoken text (intro/question/outro)
  const [isRecording, setIsRecording] = useState(false); // Track if recording is ongoing
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [intro, setIntro] = useState<string>(""); // Store GPT intro
  const [outro, setOutro] = useState<string>(""); // Store GPT outro
  const [showOutro, setShowOutro] = useState<boolean>(false); // Track if outro is shown
  const [introFinished, setIntroFinished] = useState<boolean>(false); // Track if intro has finished
  const [revealedText, setRevealedText] = useState<string>(""); // Track the currently revealed text
  const [revealIntervalId, setRevealIntervalId] = useState<NodeJS.Timeout | null>(null); // Store the interval ID for text reveal

  // Function to stop the ongoing TTS and text reveal
  const stopSpeechAndReveal = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech synthesis
    if (revealIntervalId) {
      clearInterval(revealIntervalId); // Clear the text reveal interval
      setRevealIntervalId(null);
    }
  };

  // Function to handle text-to-speech with text reveal
  const speakTextWithReveal = (text: string, callback?: () => void) => {
    stopSpeechAndReveal(); // Ensure any ongoing TTS and reveal are stopped before starting a new one
    setRevealedText(""); // Reset revealed text
    setLastSpokenText(text); // Set the last spoken text for reveal

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language; adjust as needed

    let charIndex = 0;

    // Reveal text gradually
    const intervalId = setInterval(() => {
      setRevealedText(text.slice(0, charIndex));
      charIndex += 1;
      if (charIndex > text.length) {
        clearInterval(intervalId);
        setRevealIntervalId(null);
      }
    }, 50); // Adjust speed of text reveal by changing the interval

    setRevealIntervalId(intervalId); // Store the interval ID

    if (callback) {
      utterance.onend = () => {
        clearInterval(intervalId);
        setRevealIntervalId(null);
        callback();
      };
    }

    window.speechSynthesis.speak(utterance);
  };

  // Fetch GPT intro and outro on mount
  useEffect(() => {
    const fetchIntroAndOutro = async () => {
      try {
        // Fetch Intro
        const introResponse = await fetch(`${apiUrl}/interview/gpt-intro?interview_id=${interview.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const introData = await introResponse.json();
        if (introResponse.ok) {
          setIntro(introData.introduction);
          // Speak the introduction and after it finishes, trigger the first question
          speakTextWithReveal(introData.introduction, () => {
            setIntroFinished(true); // Mark intro as finished
            askFirstQuestion(); // Speak the first question after the intro
          });
        } else {
          console.error("Error fetching GPT intro:", introData);
        }

        // Fetch Outro
        const outroResponse = await fetch(`${apiUrl}/interview/gpt-outro?interview_id=${interview.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const outroData = await outroResponse.json();
        if (outroResponse.ok) {
          setOutro(outroData.outro);
        } else {
          console.error("Error fetching GPT outro:", outroData);
        }
      } catch (error) {
        console.error("Error fetching GPT intro/outro:", error);
      }
    };

    fetchIntroAndOutro();
    initRecognition();
  }, [apiUrl, interview.id]);

  // Function to initialize the Speech Recognition API
  const initRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true; // Enable interim results for real-time updates
      recognition.maxAlternatives = 1;
      recognition.continuous = true; // Keep the recognition running until manually stopped

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setUserAnswer(transcript); // Set the captured speech as the user's answer in real-time
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart if it stops automatically
        } else {
          setIsRecording(false); // Update recording state
        }
      };

      setRecognition(recognition);
    } else if ('SpeechRecognition' in window) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true; // Enable interim results for real-time updates
      recognition.maxAlternatives = 1;
      recognition.continuous = true; // Keep the recognition running until manually stopped

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setUserAnswer(transcript); // Set the captured speech as the user's answer in real-time
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart if it stops automatically
        } else {
          setIsRecording(false); // Update recording state
        }
      };

      setRecognition(recognition);
    } else {
      alert("Speech Recognition API not supported by this browser. Please use Google Chrome or another supported browser.");
    }
  };

  // Start recording
  const startRecording = () => {
    stopSpeechAndReveal(); // Stop any ongoing TTS and text reveal
    if (recognition && !isRecording) {
      recognition.start();
      setIsRecording(true);
      setUserAnswer(""); // Clear previous answer
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
    handleNextQuestion();
  };

  // Function to handle the next question and TTS
  const handleNextQuestion = async () => {
    const question = followUp || interview.questions[currentQuestionIndex];

    // Store the current question and user's answer in the conversation array
    setConversation([...conversation, [question, userAnswer]]);
    setUserAnswer("");
    setLoading(true);

    // Clear the intro after the first question is answered
    if (currentQuestionIndex === 0) {
      setIntro("");
    }

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
        speakTextWithReveal(data.followup_question); // Speak the follow-up question with reveal effect
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
        speakTextWithReveal(data.followup_question); // Speak the follow-up question with reveal effect
      } else {
        console.error("Error fetching GPT follow-up:", data);
      }
    } else {
      // Move to the next original question after the second follow-up
      setFollowUp(null);
      setFollowUpStage(0);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLoading(false);

      if (currentQuestionIndex + 1 < interview.questions.length) {
        const nextQuestion = interview.questions[currentQuestionIndex + 1];
        setLastSpokenText(nextQuestion); // Update the last spoken text
        speakTextWithReveal(nextQuestion); // Speak the next question with reveal effect
      } else {
        // No more questions, time to show the outro
        setShowOutro(true);
        speakTextWithReveal(outro, handleSubmitInterview); // Speak the outro and automatically submit the interview
      }
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
        navigate('/user-dashboard'); // Redirect to the user dashboard
      } else {
        console.error("Error submitting conversation:", data);
      }
    } catch (error) {
      console.error("Error submitting conversation:", error);
    }
  };

  // Function to ask the first question after the intro is spoken
  const askFirstQuestion = () => {
    const firstQuestion = interview.questions[0];
    if (firstQuestion) {
      setLastSpokenText(firstQuestion); // Update the last spoken text
      speakTextWithReveal(firstQuestion); // Speak the first question with reveal effect
    }
  };

  // Function to handle ending the interview early
  const endInterview = () => {
    handleSubmitInterview(); // Submit the interview up to this point
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          {interview?.title || 'Interview'}
        </h1>

        {lastSpokenText && !introFinished && (
          <p className="text-lg text-gray-700 mb-4">{revealedText}</p> // Display revealed intro
        )}

        {introFinished && (currentQuestionIndex < interview.questions.length || followUp) && !loading && (
          <>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-blue-600">Q:</span> {revealedText}
            </p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Your spoken response will appear here..."
              readOnly
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={startRecording}
                className={`w-1/3 py-3 ${isRecording ? 'bg-red-600' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-lg hover:${isRecording ? 'bg-red-700' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                disabled={isRecording}
              >
                {isRecording ? 'Recording...' : 'Start Response'}
              </button>
              <button
                onClick={stopRecording}
                className="w-1/3 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={!isRecording}
              >
                End Response
              </button>
            </div>
          </>
        )}

        {loading && <p className="text-lg text-gray-600 mt-4 text-center">Loading next question...</p>}

        {showOutro && (
          <>
            <p className="text-lg text-gray-700 mt-4">{revealedText}</p> {/* Display revealed outro */}
            <button
              onClick={() => navigate('/user-dashboard')} // Redirect to home after interview is submitted
              className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Go Home
            </button>
          </>
        )}

        {!showOutro && introFinished && (
          <button
            onClick={endInterview}
            className="w-full mt-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            End Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default Interview;
