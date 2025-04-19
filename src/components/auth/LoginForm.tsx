
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginStart } from '@/redux/slices/authSlice';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { signIn, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  // Initialize the form with useForm and zodResolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Sign out on component mount to prevent auto-login
  useEffect(() => {
    const performInitialSignOut = async () => {
      await signOut();
      console.log("Signed out on login form mount");
    };
    
    performInitialSignOut();
  }, []);
  
  // Check if user is already authenticated and redirect based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated:', user);
      console.log('User role:', user.role);
      
      // Redirect based on user role
      if (user.role === 'employer') {
        console.log('Redirecting to employer dashboard');
        navigate('/employer-dashboard');
      } else if (user.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Redirecting to jobs page (jobseeker)');
        navigate('/jobs');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    setIsSubmitting(true);
    dispatch(loginStart());
    
    try {
      console.log('Attempting to sign in with:', data.email);
      const { success, error } = await signIn(data.email, data.password);
      
      if (success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        
        // Redirect will happen in useEffect based on user role
      } else if (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Invalid email or password');
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      setLoginError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-180px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                {isSubmitting || authLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don't have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
          <div className="text-sm text-center">
            <Button variant="link" className="p-0" onClick={() => navigate('/forgot-password')}>
              Forgot your password?
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
