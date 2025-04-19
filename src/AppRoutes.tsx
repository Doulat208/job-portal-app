
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import EmployerDashboard from '@/pages/EmployerDashboard';
import PostJob from '@/pages/PostJob';
import ManageJobs from '@/pages/ManageJobs';
import EditJob from '@/pages/EditJob';
import Applications from '@/pages/Applications';
import Admin from '@/pages/Admin';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/employer-dashboard" element={<EmployerDashboard />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/manage-jobs" element={<ManageJobs />} />
      <Route path="/edit-job/:id" element={<EditJob />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
