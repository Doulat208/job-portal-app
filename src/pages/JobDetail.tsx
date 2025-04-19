import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Share2,
  Bookmark,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import type { Job } from '@/redux/slices/jobsSlice';
import ApplicationDialog from '@/components/applications/ApplicationDialog';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const mockJobs = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA (Remote)',
            salary: '$120,000 - $150,000',
            description: 'We are looking for an experienced Frontend Developer to join our growing team. The ideal candidate has strong experience with React, TypeScript, and modern frontend development practices.',
            requirements: ['React', 'TypeScript', 'CSS', '5+ years experience'],
            postedDate: '2025-03-15T14:30:00Z',
            companyLogo: 'https://via.placeholder.com/150',
          },
          // ... add other mock jobs here
        ];
        
        const foundJob = mockJobs.find(j => j.id === id);
        if (foundJob) {
          setJob(foundJob);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);
  
  const handleApply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this job",
        variant: "destructive",
      });
      return;
    }
    setIsApplicationDialogOpen(true);
  };
  
  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save jobs",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Job saved",
        description: "This job has been added to your saved list",
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-job-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </Layout>
    );
  }
  
  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="h-12 w-12 object-contain" />
                    ) : (
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} size="sm" variant="outline" className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={() => {}} size="sm" variant="outline" className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-job-blue" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2 text-job-blue" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-job-blue" />
                  <span>Posted {format(new Date(job.postedDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="text-gray-700 mb-6">{job.description}</p>
                
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-gray-700">Design, develop, and maintain frontend applications</li>
                  <li className="text-gray-700">Collaborate with cross-functional teams to define and implement new features</li>
                  <li className="text-gray-700">Ensure the technical feasibility of UI/UX designs</li>
                  <li className="text-gray-700">Optimize applications for maximum performance and scalability</li>
                  <li className="text-gray-700">Participate in code reviews and maintain code quality</li>
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-center">
                <Button onClick={handleApply} size="lg" className="bg-job-blue hover:bg-job-blue-light w-full max-w-md">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">About the Company</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="h-10 w-10 object-contain" />
                  ) : (
                    <Briefcase className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{job.company}</h4>
                  <p className="text-sm text-gray-500">Technology</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">
                TechCorp Inc. is a leading technology company specializing in innovative software solutions for businesses of all sizes.
              </p>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Globe className="h-4 w-4 mr-2" />
                <a href="#" className="text-job-blue hover:underline">techcorp.com</a>
              </div>
              
              <Button variant="outline" className="w-full">View Company Profile</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-job-blue hover:text-job-blue-light">
                      <Link to={`/jobs/${i + 10}`}>
                        {i === 1 ? 'Frontend Developer' : i === 2 ? 'UI Engineer' : 'React Developer'}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/jobs" className="text-job-blue hover:underline text-sm">
                  View all similar jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <ApplicationDialog
          jobId={id!}
          isOpen={isApplicationDialogOpen}
          onClose={() => setIsApplicationDialogOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default JobDetail;
