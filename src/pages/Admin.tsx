
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  LineChart,
  Settings,
  Globe,
  MessageSquare,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import Layout from '@/components/layout/Layout';
import { useAppSelector } from '@/redux/hooks';

// Mock data
const jobData = [
  { name: 'Jan', jobs: 12 },
  { name: 'Feb', jobs: 19 },
  { name: 'Mar', jobs: 25 },
  { name: 'Apr', jobs: 22 },
  { name: 'May', jobs: 30 },
  { name: 'Jun', jobs: 27 },
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate, toast]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <div className="relative">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <div className="h-8 w-8 rounded-full bg-job-blue text-white flex items-center justify-center">
              A
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1,247</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-job-blue" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">458</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Briefcase className="h-5 w-5 text-job-blue" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-1">+5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">3,642</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <LineChart className="h-5 w-5 text-job-blue" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-1">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">128</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Globe className="h-5 w-5 text-job-blue" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-1">+3% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 h-10 w-[200px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm" className="h-10">
                <Settings className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Posted (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#0A66C2" barSize={30} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="jobs" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Senior Frontend Developer', 'Backend Engineer', 'UI/UX Designer', 'Product Manager'].map((job, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{job}</p>
                          <p className="text-sm text-gray-500">Posted {i + 1} day{i > 0 ? 's' : ''} ago</p>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Signups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['John Smith', 'Maria Garcia', 'Alex Wong', 'Sarah Johnson'].map((user, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                            {user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user}</p>
                            <p className="text-sm text-gray-500">Joined {i + 1} day{i > 0 ? 's' : ''} ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Jobs Management</h3>
                <p className="text-gray-600">
                  This section will contain a full table of jobs with filtering, sorting, and management options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">User Management</h3>
                <p className="text-gray-600">
                  This section will contain a full table of users with filtering, sorting, and management options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="companies">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Companies Management</h3>
                <p className="text-gray-600">
                  This section will contain a full table of companies with filtering, sorting, and management options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
