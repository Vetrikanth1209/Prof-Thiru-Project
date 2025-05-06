import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnhancedSignIn from './login';
import AdmissionForm from './AdminForm';
import Dashboard from './Dash';
import StudentDetails from './Table';
import Admin from './Admin';
import EditStudent from './EditStudent';
import Bill from './BillPage';
import CoursePage from './CoursePage';
import FeePage from './FeePage';

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
              <Route path="/admission" element={<AdmissionForm />} />
            </>
          ) : (
            // Normal user routes
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admission" element={<AdmissionForm />} />
              <Route path="/table" element={<StudentDetails />} />
              <Route path="/bill" element={<Bill />} />
              <Route path="/course" element={<CoursePage />} />
              <Route path="/fee" element={<FeePage />} />

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
