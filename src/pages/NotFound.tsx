
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-job-blue mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</p>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Link to="/">
            <Button className="bg-job-blue hover:bg-job-blue-light flex items-center gap-2">
              <Home className="h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
