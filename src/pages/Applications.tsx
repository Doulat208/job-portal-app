
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  updateApplicationStatus,
  Application
} from '@/redux/slices/applicationsSlice';
import ApplicationsTable from '@/components/applications/ApplicationsTable';
import ViewApplicationDialog from '@/components/applications/ViewApplicationDialog';
import { supabase } from '@/lib/supabase';

const Applications = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { applications, loading } = useAppSelector(state => state.applications);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your applications",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const fetchApplications = async () => {
      dispatch(fetchApplicationsStart());
      try {
        let query = supabase
          .from('applications')
          .select(`
            *,
            jobs (
              title,
              company
            )
          `);

        // Filter based on user role
        if (user?.role === 'jobseeker') {
          query = query.eq('user_id', user.id);
        } else if (user?.role === 'employer') {
          // For employers, we need to join with jobs to get their applications
          query = query.eq('jobs.employer_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to match our Application type
        const transformedApplications = data.map(app => ({
          id: app.id,
          jobId: app.job_id,
          userId: app.user_id,
          jobTitle: app.jobs.title,
          company: app.jobs.company,
          status: app.status,
          appliedDate: app.applied_date,
          resume: app.resume,
          coverLetter: app.cover_letter
        }));

        dispatch(fetchApplicationsSuccess(transformedApplications));
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch applications. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchApplications();
  }, [dispatch, isAuthenticated, navigate, toast, user]);

  const handleUpdateStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      dispatch(updateApplicationStatus({ id: applicationId, status: newStatus }));
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-job-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user?.role === 'employer' ? 'Manage Applications' : 'My Applications'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'employer' 
              ? 'Review and manage applications for your job postings'
              : 'Track the status of your job applications'}
          </p>
        </div>

        {applications.length > 0 ? (
          <ApplicationsTable 
            applications={applications}
            onViewApplication={(app) => {
              setSelectedApplication(app);
              setViewDialogOpen(true);
            }}
            onUpdateStatus={user?.role === 'employer' ? handleUpdateStatus : undefined}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'employer'
                ? "You haven't received any applications yet."
                : "You haven't applied for any jobs yet."}
            </p>
            <Button 
              className="bg-job-blue hover:bg-job-blue-light"
              onClick={() => navigate('/jobs')}
            >
              {user?.role === 'employer' ? 'Post a Job' : 'Browse Jobs'}
            </Button>
          </div>
        )}

        <ViewApplicationDialog
          application={selectedApplication}
          isOpen={viewDialogOpen}
          onClose={() => {
            setViewDialogOpen(false);
            setSelectedApplication(null);
          }}
        />
      </div>
    </Layout>
  );
};

export default Applications;
