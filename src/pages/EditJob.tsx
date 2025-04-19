
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { supabase } from '@/lib/supabase';
import JobPostForm from '@/components/employer/JobPostForm';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is authenticated and is an employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'employer') {
      toast({
        title: "Access Denied",
        description: "Only employers can edit jobs.",
        variant: "destructive"
      });
      navigate('/jobs');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      if (!id || !user?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('employer_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error('Job not found or you do not have permission to edit it');
        }
        
        setJob(data);
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to load job details');
        toast({
          title: "Error",
          description: "Failed to load job details. You may not have permission to edit this job.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, user]);
  
  // Handle successful job update
  const handleUpdateSuccess = () => {
    toast({
      title: "Job Updated Successfully",
      description: "Your job listing has been updated."
    });
    navigate('/manage-jobs');
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading job details...</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh] flex-col">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-500">{error || 'Job not found'}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => navigate('/manage-jobs')}
            >
              Back to Manage Jobs
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Edit Job</h1>
        
        <div className="max-w-4xl mx-auto">
          <JobPostForm 
            editMode={true} 
            initialData={job} 
            onSuccess={handleUpdateSuccess} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditJob;
