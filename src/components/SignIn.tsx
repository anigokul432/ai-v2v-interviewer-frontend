import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface SignInProps {
  apiUrl: string;
}

const SignIn: React.FC<SignInProps> = ({ apiUrl }) => {
  const navigate = useNavigate();

  const handleSuccess = (response: CredentialResponse) => {
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

  const handleError = () => {
    console.log('Google Login Error');
  };

  return (
    <GoogleOAuthProvider clientId="342239470218-5kbiijcep7ghcgr7em0b6fs6vug90v04.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Sign In</h1>
            <p className="text-gray-600 mb-8">
              Access your dashboard and manage your interviews with ease.
            </p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                size="large"
                theme="outline"
                shape="rectangular"
                type="standard"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
