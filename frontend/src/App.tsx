import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Representatives from './pages/Representatives';
import Commissions from './pages/Commissions';
import Decisions from './pages/Decisions';
import Documents from './pages/Documents';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="representatives" element={<Representatives />} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="documents" element={<Documents />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
