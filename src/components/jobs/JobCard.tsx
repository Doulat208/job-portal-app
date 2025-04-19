
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, isValid } from 'date-fns';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import type { Job } from '@/redux/slices/jobsSlice';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  // Function to safely format dates
  const formatPostedDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    if (!isValid(date)) return 'Recently';
    
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  // Function to safely format "Posted X ago"
  const formatTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    if (!isValid(date)) return 'Recently posted';
    
    try {
      return `Posted ${formatDistanceToNow(date)} ago`;
    } catch (error) {
      console.error('Error formatting time ago:', error);
      return 'Recently posted';
    }
  };

  return (
    <div className="job-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="h-10 w-10 object-contain" />
            ) : (
              <Briefcase className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {formatPostedDate(job.postedDate)}
        </span>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatTimeAgo(job.postedDate)}</span>
        </div>
      </div>
      
      <div className="mt-4 line-clamp-2 text-sm text-gray-700">
        {job.description}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {job.requirements && Array.isArray(job.requirements) && job.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="bg-blue-50 text-job-blue text-xs px-2 py-1 rounded">
              {req}
            </span>
          ))}
          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 3 && (
            <span className="bg-blue-50 text-job-blue text-xs px-2 py-1 rounded">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>
        <Link to={`/jobs/${job.id}`} className="apply-button text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
