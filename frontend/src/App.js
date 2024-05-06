import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import AdminPanel from './components/admin_panel/AdminPanel';
import Installations from './components/installations/Installations';

function isAuthenticated() {
  return !!localStorage.getItem('userToken');
}

const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={
          <RequireAuth>
            <AdminPanel />
          </RequireAuth>
        } />
        <Route path="/installations/:guid" element={
          <RequireAuth>
            <Installations />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;