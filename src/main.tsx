import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, isTokenExpired } from './auth';
import './index.css';

function Protected({ children }: { children: React.ReactElement }) {
  const token = getToken();
  if (!token || isTokenExpired(token)) return <Navigate to="/login" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protected><App /></Protected>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
