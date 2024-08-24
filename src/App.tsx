import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Import routing components
import Home from './components/Home';
import Interview from './components/Interview';
import EnterpriseDashboard from './components/EnterpriseDashboard';
import CreateInterview from './components/CreateInterview';
import ManageInterviews from './components/ManageInterviews';
import EditInterview from './components/EditInterview';
import UserDashboard from './components/UserDashboard';
import SignIn from './components/SignIn';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  // Base API URL used throughout the application
  const apiUrl = 'https://ai-interview-bot1-dsctbpcsamcsgqas.southindia-01.azurewebsites.net';
  // const apiUrl = 'http://localhost:8000'; // Uncomment this line if you need to test locally

  return (
    <Router>
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home apiUrl={apiUrl} />} />
        {/* Route for conducting an interview with dynamic interviewId */}
        <Route path="/interview/:interviewId" element={<Interview apiUrl={apiUrl} />} />
        {/* Route for the Enterprise Dashboard */}
        <Route path="/enterprise-dashboard" element={<EnterpriseDashboard apiUrl={apiUrl} />} />
        {/* Route for creating a new interview */}
        <Route path="/create-interview" element={<CreateInterview apiUrl={apiUrl} />} />
        {/* Route for managing existing interviews */}
        <Route path="/manage-interviews" element={<ManageInterviews apiUrl={apiUrl} />} />
        {/* Route for editing an existing interview, identified by interviewId */}
        <Route path="/edit-interview/:interviewId" element={<EditInterview apiUrl={apiUrl} />} />
        {/* Route for the User Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard apiUrl={apiUrl} />} />
        {/* Route for the Sign-In page */}
        <Route path="/signin" element={<SignIn apiUrl={apiUrl} />} />
        {/* Route for viewing interview analytics */}
        <Route path="/analytics" element={<Analytics apiUrl={apiUrl} />} />
      </Routes>
    </Router>
  );
}

export default App;
