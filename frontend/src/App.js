import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnhancedSignIn from './login';
import AdmissionForm from './AdminForm';
import Dashboard from './Dash';
import StudentDetails from './Table';
import Admin from './Admin';
import EditStudent from './EditStudent';

const App = () => {
  const loggedData = JSON.parse(sessionStorage.getItem('logged') || '{}');
  const isLoggedIn = !!loggedData.token;
  const isAdmin = loggedData.user?.admin === true;

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          isAdmin ? (
            // Admin routes
            <>
              <Route path="/" element={<StudentDetails />} />
              <Route path="/edit_student/:student_id" element={<EditStudent />} />
            </>
          ) : (
            // Normal user routes
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admission" element={<AdmissionForm />} />
              <Route path="/table" element={<StudentDetails />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )
        ) : (
          // Not logged in routes
          <>
            <Route path="/" element={<EnhancedSignIn />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
