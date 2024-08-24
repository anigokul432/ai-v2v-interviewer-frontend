import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewRecording: React.FC = () => {
  // Retrieve the recordingBlob passed through the state from the location
  const location = useLocation();
  const { recordingBlob } = location.state as { recordingBlob: Blob };
    
  // Handle the case where no recording is available
  if (!recordingBlob) {
    return <p>No recording available.</p>;
  }

  // Create a URL for the Blob to be used as the source in the audio player
  const recordingUrl = URL.createObjectURL(recordingBlob);
  console.log(recordingUrl);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Interview Recording</h1>
      <audio controls>
        <source src={recordingUrl} type="audio/webm" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default ViewRecording;
