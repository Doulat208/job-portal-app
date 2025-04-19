
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchJobsStart, fetchJobsSuccess, fetchJobsFail } from '@/redux/slices/jobsSlice';
import Layout from '@/components/layout/Layout';
import JobSearch from '@/components/jobs/JobSearch';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const Jobs = () => {
  const dispatch = useAppDispatch();
  const { filteredJobs, loading } = useAppSelector(state => state.jobs);
  
  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(fetchJobsStart());
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('posted_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        dispatch(fetchJobsSuccess(data || []));
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive"
        });
        dispatch(fetchJobsFail(error.message));
      }
    };
    
    fetchJobs();
  }, [dispatch]);
  
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Here you would typically dispatch an action to apply these filters
    // But for now, we're just logging them
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>
        
        <JobSearch />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <JobFilters onFilterChange={handleFilterChange} />
          </div>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-job-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
