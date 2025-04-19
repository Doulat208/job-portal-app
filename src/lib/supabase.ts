import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Use the actual values directly from our connected project
const supabaseUrl = "https://ywudgkmrbbwpcbvlakrb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dWRna21yYmJ3cGNidmxha3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzE3NjksImV4cCI6MjA1OTg0Nzc2OX0.ng6SmC8e2fG67UrUgjZ3eWKH9fnegdmwJdJGC8k8XjQ";

// Create a client with error handling
let supabaseInstance;

try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a mock client for development to prevent crashes
  supabaseInstance = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({}),
      resetPasswordForEmail: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
    }),
  };
}

// Export the client
export const supabase = supabaseInstance;

// Session helper functions
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  try {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    return await supabase.auth.signUp({
      email,
      password,
    });
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return { data: null, error };
  }
};

export const updateUserPassword = async (password: string) => {
  try {
    return await supabase.auth.updateUser({
      password,
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error };
  }
};

// Profile helper functions
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    return { data, error };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

// Job helper functions
export const getJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('posted_date', { ascending: false });
    
    return { data: data || [], error };
  } catch (error) {
    console.error('Error getting jobs:', error);
    return { data: [], error };
  }
};

export const getJob = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error getting job:', error);
    return { data: null, error };
  }
};

// Application helper functions
export const getUserApplications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company,
          company_logo
        )
      `)
      .eq('user_id', userId);
    
    return { data: data || [], error };
  } catch (error) {
    console.error('Error getting user applications:', error);
    return { data: [], error };
  }
};

export const submitApplication = async (application: any) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([application]);
    
    return { data, error };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { data: null, error };
  }
};
