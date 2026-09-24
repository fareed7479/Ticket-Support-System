import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerTickets from './pages/CustomerTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import AgentDashboard from './pages/AgentDashboard';
import AgentTickets from './pages/AgentTickets';
import AgentTicketDetails from './pages/AgentTicketDetails';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Guest / Public Routes (Guarded with PublicRoute) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Customer Protected Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/tickets"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/tickets/new"
            element={
              <ProtectedRoute allowedRole="customer">
                <CreateTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/tickets/:id"
            element={
              <ProtectedRoute allowedRole="customer">
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          {/* Agent Protected Routes */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRole="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/tickets"
            element={
              <ProtectedRoute allowedRole="agent">
                <AgentTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/tickets/:id"
            element={
              <ProtectedRoute allowedRole="agent">
                <AgentTicketDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/users"
            element={
              <ProtectedRoute allowedRole="agent">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* User Profile Route (Accessible by both Customer & Agent) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
