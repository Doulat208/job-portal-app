
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Index = () => {
  // Mock featured companies
  const featuredCompanies = [
    { id: 1, name: 'Acme Inc', logo: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Globex Corp', logo: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Stark Industries', logo: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Wayne Enterprises', logo: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Umbrella Corp', logo: 'https://via.placeholder.com/150' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-job-blue to-job-blue-light text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect with top companies and opportunities that match your skills and career goals
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="default" className="bg-white text-job-blue hover:bg-gray-100">
                <Search className="mr-2 h-5 w-5" />
                Search Jobs
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Briefcase className="mr-2 h-5 w-5" />
                For Employers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg">
              <div className="text-job-blue text-4xl font-bold mb-2">10,000+</div>
              <p className="text-gray-600">Active Job Listings</p>
            </div>
            <div className="p-6 rounded-lg">
              <div className="text-job-blue text-4xl font-bold mb-2">5,000+</div>
              <p className="text-gray-600">Companies Hiring</p>
            </div>
            <div className="p-6 rounded-lg">
              <div className="text-job-blue text-4xl font-bold mb-2">50,000+</div>
              <p className="text-gray-600">Happy Job Seekers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Job Categories</h2>
            <p className="text-gray-600 mt-2">Explore opportunities across industries</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['Technology', 'Healthcare', 'Finance', 'Marketing', 'Design', 'Education', 'Engineering', 'Customer Service'].map((category) => (
              <Link to="/jobs" key={category} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">100+ jobs</span>
                  <ChevronRight className="h-5 w-5 text-job-blue" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/jobs">
              <Button variant="outline" className="border-job-blue text-job-blue">
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-600 mt-2">Simple steps to find your next opportunity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-job-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
              <p className="text-gray-600">Browse thousands of jobs across various industries and locations</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-job-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
              <p className="text-gray-600">Submit your resume and application with just a few clicks</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-job-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
              <p className="text-gray-600">Land your dream job and take the next step in your career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Companies</h2>
            <p className="text-gray-600 mt-2">Top employers currently hiring on our platform</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {featuredCompanies.map((company) => (
              <div key={company.id} className="bg-white p-6 rounded-lg shadow-sm">
                <img src={company.logo} alt={company.name} className="h-12 w-auto mx-auto" />
                <h3 className="text-center mt-3 font-medium">{company.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-job-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream careers through our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-job-blue hover:bg-gray-100">
                Create an Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
