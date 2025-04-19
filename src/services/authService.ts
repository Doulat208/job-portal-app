
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with email:', email);
    
    // First ensure we're signed out to prevent automatic login
    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Login Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
      return { success: false, error };
    }
    
    console.log('Login successful:', data.user?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Login try/catch error:', error);
    toast({
      title: 'Login Error',
      description: error.message || 'Failed to sign in',
      variant: 'destructive',
    });
    return { success: false, error };
  }
};

export const signUp = async (email: string, password: string, name: string, role: string) => {
  try {
    console.log('Signing up with:', email, name, role);
    
    // First ensure we're signed out
    await supabase.auth.signOut();
    
    // Register user with Supabase auth and store user data in metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          preferred_role: role // Store in user metadata
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    // Attempt to create profile immediately after signup
    if (data && data.user) {
      console.log('Creating profile during signup for user:', data.user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: name,
          email: email,
          role: role,
        });
        
      if (profileError) {
        console.error('Error creating profile during signup:', profileError);
      }
    }

    // Show success toast
    toast({
      title: 'Success!',
      description: 'Your account has been created. Please check your email for verification.',
    });
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Signup try/catch error:', error);
    toast({
      title: 'Registration Error',
      description: error.message || 'Failed to create account',
      variant: 'destructive',
    });
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
    return { success: !error, error };
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast({
      title: 'Sign Out Error',
      description: error.message || 'Failed to sign out',
      variant: 'destructive',
    });
    return { success: false, error };
  }
};
