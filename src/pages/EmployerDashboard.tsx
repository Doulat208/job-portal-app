
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, Settings, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EmployerDashboard = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Redirect if user is not authenticated or not an employer
  useEffect(() => {
    console.log("EmployerDashboard - Auth state:", { isAuthenticated, userRole: user?.role });
    
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'employer') {
      console.log(`User is ${user.role}, not employer. Redirecting to jobs page`);
      toast({
        title: "Access Denied",
        description: "This page is only accessible to employers",
        variant: "destructive"
      });
      navigate('/jobs');
    }
  }, [isAuthenticated, user, navigate]);

  // If still checking auth state or not authenticated, show loading
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p>Checking authentication status...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If authenticated but not an employer, this is a fallback (should be redirected by the useEffect)
  if (user.role !== 'employer') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p>This page is only accessible to employers. Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Only render the dashboard if the user is an employer
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name}!</CardTitle>
              <CardDescription>Manage your job postings and applications from this dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You are logged in as an employer. From here, you can post new jobs, review applications, and manage your company profile.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Post a New Job
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Create a new job posting to find the perfect candidates for your company.</p>
              <Button onClick={() => navigate('/post-job')}>Post Job</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Manage Job Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">View, edit, or remove your current job postings.</p>
              <Button onClick={() => navigate('/manage-jobs')}>View Jobs</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Review Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Review and manage applications submitted to your job postings.</p>
              <Button onClick={() => navigate('/applications')}>View Applications</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerDashboard;
