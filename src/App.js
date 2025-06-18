import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabase';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';


import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditTicket from './pages/EditTicket';
import KanbanBoard from './pages/KanbanBoard';
import TicketDetails from './pages/TicketDetails';
import MyTickets from './pages/MyTickets';

import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  return (
    <AuthProvider>
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

        <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />

        <Route path="/projects/new" element={<ProtectedRoute><Layout><CreateProject /></Layout></ProtectedRoute>} />

        <Route path="/projects/:projectId/tickets" element={<ProtectedRoute><Layout><Tickets /></Layout></ProtectedRoute>} />

        <Route path="/projects/:projectId/tickets/new" element={<ProtectedRoute><Layout><CreateTicket /></Layout></ProtectedRoute>} />

        <Route path="/projects/:projectId/tickets/:ticketId/edit" element={<ProtectedRoute><Layout><EditTicket /></Layout></ProtectedRoute>} />

        <Route path="/projects/:projectId/kanban" element={<ProtectedRoute><Layout><KanbanBoard /></Layout></ProtectedRoute>} />

        <Route path="/projects/:projectId/tickets/:ticketId" element={<ProtectedRoute><Layout><TicketDetails /></Layout></ProtectedRoute>} />

        <Route path="/my-tickets" element={<ProtectedRoute><Layout><MyTickets /></Layout></ProtectedRoute>} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        
        
       

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
