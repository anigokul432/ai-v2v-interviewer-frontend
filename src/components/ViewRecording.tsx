import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewRecording: React.FC = () => {
  const location = useLocation();
  const { recordingBlob } = location.state as { recordingBlob: Blob };
    
  if (!recordingBlob) {
    return <p>No recording available.</p>;
  }

  const recordingUrl = URL.createObjectURL(recordingBlob);
  console.log(recordingUrl)

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
