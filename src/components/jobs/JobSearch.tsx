
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { filterJobs } from '@/redux/slices/jobsSlice';

const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const dispatch = useAppDispatch();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(filterJobs({ query, location }));
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Job title, keywords, or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 filter-input"
          />
        </div>
        
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="City, state, or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 filter-input"
          />
        </div>
        
        <Button type="submit" className="bg-job-blue hover:bg-job-blue-light">
          Search Jobs
        </Button>
      </form>
    </div>
  );
};

export default JobSearch;
