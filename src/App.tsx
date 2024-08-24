import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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
  // const apiUrl = 'https://ai-interview-bot1-dsctbpcsamcsgqas.southindia-01.azurewebsites.net';
  const apiUrl = 'http://localhost:8000';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home apiUrl={apiUrl} />} />
        <Route path="/interview/:interviewId" element={<Interview apiUrl={apiUrl} />} />
        <Route path="/enterprise-dashboard" element={<EnterpriseDashboard apiUrl={apiUrl} />} />
        <Route path="/create-interview" element={<CreateInterview apiUrl={apiUrl} />} />
        <Route path="/manage-interviews" element={<ManageInterviews apiUrl={apiUrl} />} />
        <Route path="/edit-interview/:interviewId" element={<EditInterview apiUrl={apiUrl} />} />
        <Route path="/user-dashboard" element={<UserDashboard apiUrl={apiUrl} />} />
        <Route path="/signin" element={<SignIn apiUrl={apiUrl} />} />
        <Route path="/analytics" element={<Analytics apiUrl={apiUrl} />} />
      </Routes>
    </Router>
  );
}

export default App;
