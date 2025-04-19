
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Search, 
  FileText, 
  User,
  LogIn,
  LogOut,
  Settings,
  Building,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-job-blue" />
          <Link to="/" className="text-xl font-bold text-job-blue">JobPortal</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/jobs" className="flex items-center space-x-1 text-gray-600 hover:text-job-blue transition-colors">
            <Search className="h-4 w-4" />
            <span>Find Jobs</span>
          </Link>
          
          {isAuthenticated && user?.role === 'jobseeker' && (
            <Link to="/applications" className="flex items-center space-x-1 text-gray-600 hover:text-job-blue transition-colors">
              <FileText className="h-4 w-4" />
              <span>My Applications</span>
            </Link>
          )}
          
          {isAuthenticated && user?.role === 'employer' && (
            <Link to="/employer-dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-job-blue transition-colors">
              <Building className="h-4 w-4" />
              <span>Employer Dashboard</span>
            </Link>
          )}
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-job-blue transition-colors">
              <Settings className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-1 text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {user?.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
