
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Users,
  Calendar,
  Clock,
  Loader2 
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  posted_date: string;
  is_active: boolean;
  // Add other fields as needed
}

const ManageJobs = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  
  // Check if user is authenticated and is an employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'employer') {
      toast({
        title: "Access Denied",
        description: "Only employers can access this page.",
        variant: "destructive"
      });
      navigate('/jobs');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Fetch employer's jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('employer_id', user.id)
          .order('posted_date', { ascending: false });
          
        if (error) throw error;
        
        setJobs(data || []);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load your job listings');
        toast({
          title: "Error",
          description: "Failed to load your job listings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [user]);
  
  // Delete job handler
  const handleDeleteJob = async (jobId: string) => {
    try {
      setDeletingJobId(jobId);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Update local state
      setJobs(jobs.filter(job => job.id !== jobId));
      
      toast({
        title: "Job Deleted",
        description: "Your job listing has been successfully removed."
      });
    } catch (err: any) {
      console.error('Error deleting job:', err);
      toast({
        title: "Error",
        description: "Failed to delete the job listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingJobId(null);
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Status badge component
  const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
  
  // Job type badge component
  const JobTypeBadge = ({ type }: { type: string }) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "default";
    
    switch (type) {
      case "FULL_TIME":
        variant = "default";
        break;
      case "PART_TIME":
        variant = "secondary";
        break;
      case "CONTRACT":
        variant = "outline";
        break;
      default:
        variant = "secondary";
    }
    
    return (
      <Badge variant={variant}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          
          <Button onClick={() => navigate('/post-job')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Post New Job
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your job listings...</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Job Listings</CardTitle>
              <CardDescription>You haven't posted any jobs yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create your first job listing to start receiving applications.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/post-job')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Post Your First Job
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Job Listings</CardTitle>
              <CardDescription>
                Manage all your job postings from this dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell><JobTypeBadge type={job.type} /></TableCell>
                      <TableCell>{formatDate(job.posted_date)}</TableCell>
                      <TableCell><StatusBadge isActive={job.is_active} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            title="View Job"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/edit-job/${job.id}`)}
                            title="Edit Job"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                title="Delete Job"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this job listing? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingJobId === job.id ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                                  ) : (
                                    'Delete'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ManageJobs;
