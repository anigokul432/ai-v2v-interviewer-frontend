import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Define the props expected by the Interview component
interface InterviewProps {
  apiUrl: string;
}

// Define the structure of the interview data
interface InterviewData {
  id: string;
  title: string;
  questions: string[];
}

// Define the structure of the follow-up response from the API
interface FollowUpResponse {
  followup_question: string;
}

// Define the structure of each conversation entry
interface ConversationEntry {
  question: string;
  answer: string;
  timestamp: number;
}

// Constants for input validation
const MAX_INPUT_LENGTH = 500; // Maximum allowed input length
const VALID_CHARACTERS = /^[a-zA-Z0-9\s.,?!'"-]*$/; // Allowed characters in user input

// Main Interview component
const Interview: React.FC<InterviewProps> = ({ apiUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { interview } = location.state as { interview: InterviewData } || {}; // Extract interview data from location state
  
  // State variables for managing interview progress and conversation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpStage, setFollowUpStage] = useState(0); // Track follow-up question stages: 0: No follow-up, 1: First follow-up, 2: Second follow-up
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [outro, setOutro] = useState<string>("");
  const [showOutro, setShowOutro] = useState<boolean>(false);
  const [introFinished, setIntroFinished] = useState<boolean>(false);
  const [revealedText, setRevealedText] = useState<string>("");
  const [revealIntervalId, setRevealIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Refs for handling media streams and recording
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Function to stop any ongoing text-to-speech and text reveal animations
  const stopSpeechAndReveal = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech synthesis
    if (revealIntervalId) {
      clearInterval(revealIntervalId); // Clear the text reveal interval
      setRevealIntervalId(null);
    }
  };

  // Function to handle text-to-speech with gradual text reveal
  const speakTextWithReveal = (text: string, callback?: () => void) => {
    stopSpeechAndReveal(); // Stop any ongoing TTS and reveal before starting a new one
    setRevealedText(""); // Reset revealed text
    setLastSpokenText(text); // Store the last spoken text for reference

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language for speech synthesis

    let charIndex = 0;

    // Gradually reveal text
    const intervalId = setInterval(() => {
      setRevealedText(text.slice(0, charIndex));
      charIndex += 1;
      if (charIndex > text.length) {
        clearInterval(intervalId);
        setRevealIntervalId(null);
      }
    }, 50); // Speed of text reveal can be adjusted by changing the interval

    setRevealIntervalId(intervalId); // Store the interval ID for potential future use

    // Trigger callback when TTS ends
    if (callback) {
      utterance.onend = () => {
        clearInterval(intervalId);
        setRevealIntervalId(null);
        callback();
      };
    }

    window.speechSynthesis.speak(utterance); // Start speech synthesis
  };

  // Fetch introductory and outro text from the API on component mount
  useEffect(() => {
    const fetchIntroAndOutro = async () => {
      try {
        // Fetch the introduction
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
          // Speak the introduction and then trigger the first question
          speakTextWithReveal(introData.introduction, () => {
            setIntroFinished(true); // Mark the intro as finished
            askFirstQuestion(); // Trigger the first interview question
          });
        } else {
          console.error("Error fetching GPT intro:", introData);
        }

        // Fetch the outro
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

    fetchIntroAndOutro(); // Trigger intro and outro fetch
    initRecognition(); // Initialize speech recognition
    startRecordingAudio(); // Start recording audio when component mounts

    // Clean up function to stop recording when component unmounts
    return () => {
      stopRecordingAudio();
    };
  }, [apiUrl, interview.id]);

  // Function to initialize the Speech Recognition API
  const initRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      // Use webkitSpeechRecognition if available
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true; // Enable interim results for real-time updates
      recognition.maxAlternatives = 1;
      recognition.continuous = true; // Keep recognition running until manually stopped

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');

        transcript = validateInput(transcript); // Validate and sanitize the input
        setUserAnswer(transcript); // Update user answer in real-time
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart recognition if it stops automatically
        } else {
          setIsRecording(false); // Update recording state
        }
      };

      setRecognition(recognition); // Set recognition state
    } else if ('SpeechRecognition' in window) {
      // Fallback for non-webkit browsers
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');

        transcript = validateInput(transcript);
        setUserAnswer(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        } else {
          setIsRecording(false);
        }
      };

      setRecognition(recognition);
    } else {
      alert("Speech Recognition API not supported by this browser. Please use Google Chrome or another supported browser.");
    }
  };

  // Function to validate and sanitize user input
  const validateInput = (input: string): string => {
    // Limit input length
    let sanitizedInput = input.slice(0, MAX_INPUT_LENGTH);

    // Remove invalid characters
    sanitizedInput = sanitizedInput.split('').filter(char => VALID_CHARACTERS.test(char)).join('');

    return sanitizedInput;
  };

  // Function to start recording audio streams
  const startRecordingAudio = async () => {
    try {
        // Capture microphone audio
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Attempt to capture system audio
        let desktopStream;
        try {
            desktopStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    sampleRate: 44100,
                }
            });
        } catch (err) {
            console.warn("System audio capture not supported or permission denied, proceeding with mic audio only.", err);
        }

        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        // Add microphone audio to the destination
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);

        // Add system audio to the destination if available
        if (desktopStream && desktopStream.getAudioTracks().length > 0) {
            const desktopSource = audioContext.createMediaStreamSource(desktopStream);
            desktopSource.connect(destination);
        } else {
            console.warn("No system audio track available.");
        }

        // Combine mic and system audio (if available)
        const combinedStream = destination.stream;

        // Record the combined stream
        audioRecorderRef.current = new MediaRecorder(combinedStream);

        audioRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data); // Save recorded data chunks
            }
        };

        audioRecorderRef.current.start();
        console.log("Audio recording started.");
    } catch (error) {
        console.error("Error starting audio recording:", error);
    }
};

  // Function to stop recording audio streams
  const stopRecordingAudio = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
  };

  // Function to save the recording to a file
  const saveRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'interview-recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Function to start speech recognition recording
  const startRecording = () => {
    stopSpeechAndReveal(); // Stop any ongoing TTS and text reveal
    if (recognition && !isRecording) {
      recognition.start();
      setIsRecording(true);
      setUserAnswer(""); // Clear the previous answer
    }
  };

  // Function to stop speech recognition recording
  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
    handleNextQuestion(); // Proceed to the next question after stopping recording
  };

  // Function to handle moving to the next question or follow-up
  const handleNextQuestion = async () => {
    const question = followUp || interview.questions[currentQuestionIndex];

    // Save the current question, answer, and timestamp to conversation
    const timestamp = Date.now();
    const newEntry: ConversationEntry = { question, answer: userAnswer, timestamp };
    setConversation([...conversation, newEntry]);

    setUserAnswer("");
    setLoading(true);

    // Clear the intro after the first question
    if (currentQuestionIndex === 0) {
        setIntro("");
    }

    if (followUpStage === 0) {
      // Fetch the first follow-up question
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
      // Fetch the second follow-up question
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
        // No more questions, show the outro
        setShowOutro(true);
        speakTextWithReveal(outro, handleSubmitInterview); // Speak the outro and automatically submit the interview
      }
    }
  };

  // Function to submit the conversation and save the recording
  const handleSubmitInterview = async () => {
    stopRecordingAudio(); // Stop the recording
    const recordingBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' }); // Create a blob from the recorded chunks
    
    // Convert Blob to Base64
    const recordingBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(recordingBlob);
    });

    // Prepare the conversation data
    const formattedConversation = conversation.map(entry => [entry.question, entry.answer, entry.timestamp]);

    // Prepare the payload with the recording as a Base64 string
    const payload = {
        interview_id: interview.id,
        conversation: formattedConversation,
        recording: recordingBase64.split(',')[1], // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
    };

    try {
        const response = await fetch(`${apiUrl}/interview/submit-conversation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Send the payload with the conversation and recording
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Conversation submitted successfully:", data);
            saveRecording(); // Save the audio recording locally (optional)
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

        {/* Display the introduction text */}
        {lastSpokenText && !introFinished && (
          <p className="text-lg text-gray-700 mb-4">{revealedText}</p> // Display revealed intro
        )}

        {/* Display the current question and input field */}
        {introFinished && (currentQuestionIndex < interview.questions.length || followUp) && !loading && (
          <>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-blue-600">Q:</span> {revealedText}
            </p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(validateInput(e.target.value))} // Validate and sanitize the input
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

        {/* Display loading message when fetching the next question */}
        {loading && <p className="text-lg text-gray-600 mt-4 text-center">Loading next question...</p>}

        {/* Display the outro text and navigation button */}
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

        {/* Display end interview button */}
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
