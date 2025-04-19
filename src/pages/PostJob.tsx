
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import JobPostForm from '@/components/employer/JobPostForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const PostJob = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Check if user is authenticated and is an employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'employer') {
      toast({
        title: "Access Denied",
        description: "Only employers can post jobs.",
        variant: "destructive"
      });
      navigate('/jobs');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Handle successful job posting
  const handleJobPostSuccess = async (jobData: any) => {
    try {
      // Ensure we have the current user ID
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to post jobs.",
          variant: "destructive"
        });
        return;
      }
      
      // Format job data to match database schema
      const formattedJobData = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        salary: jobData.salary,
        type: jobData.type,
        experienceLevel: jobData.experienceLevel,
        category: jobData.category,
        remote: jobData.remote,
        requirements: jobData.requirements ? 
          jobData.requirements.split('\n').filter((req: string) => req.trim().length > 0) : 
          [],
        deadline: jobData.deadline || null,
        employer_id: user.id,
        is_active: true
      };
      
      console.log("Submitting job data:", formattedJobData);
      
      // Insert the job into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([formattedJobData]);
        
      if (error) {
        console.error("Error posting job:", error);
        throw new Error(error.message);
      }
      
      toast({
        title: "Job Posted Successfully",
        description: "Your job has been published and is now visible to job seekers."
      });
      navigate('/manage-jobs');
    } catch (error: any) {
      console.error("Error in job submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
        
        <div className="max-w-4xl mx-auto">
          <JobPostForm onSuccess={handleJobPostSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
