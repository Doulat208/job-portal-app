
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-10 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Portal</h3>
            <p className="text-gray-600 text-sm">
              Connecting talented professionals with great companies around the world.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-600 text-sm hover:text-job-blue">Browse Jobs</Link></li>
              <li><Link to="/companies" className="text-gray-600 text-sm hover:text-job-blue">Browse Companies</Link></li>
              <li><Link to="/career-advice" className="text-gray-600 text-sm hover:text-job-blue">Career Advice</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li><Link to="/post-job" className="text-gray-600 text-sm hover:text-job-blue">Post a Job</Link></li>
              <li><Link to="/pricing" className="text-gray-600 text-sm hover:text-job-blue">Pricing</Link></li>
              <li><Link to="/resources" className="text-gray-600 text-sm hover:text-job-blue">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 text-sm hover:text-job-blue">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 text-sm hover:text-job-blue">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 text-sm hover:text-job-blue">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 text-sm hover:text-job-blue">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-gray-600 text-sm text-center">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
