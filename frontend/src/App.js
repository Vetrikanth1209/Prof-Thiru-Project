import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedSignIn from './login';
import AdmissionForm from './AdminForm';
import Dashboard from './Dash';
import StudentDetails from './Table';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admission" element={<AdmissionForm />} />
        <Route path="/table" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
