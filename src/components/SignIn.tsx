import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  apiUrl: string;
}

const SignIn: React.FC<SignInProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  const handleSuccess = (response: CredentialResponse) => {
    console.log('Google Login Success:', response);
    if (response.credential) {
      fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('token', data.access_token);
          navigate('/user-dashboard');
        })
        .catch((error) => {
          console.error('Error adding user to DB:', error);
        });
    } else {
      console.error('No credential found in the response.');
    }
  };

  // Adjusted to match the expected type
  const handleError = () => {
    console.log('Google Login Error');
  };

  return (
    <GoogleOAuthProvider clientId="342239470218-5kbiijcep7ghcgr7em0b6fs6vug90v04.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Sign In</h1>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
