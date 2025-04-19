
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { supabase } from '@/integrations/supabase/client'; 
import { logout } from '@/redux/slices/authSlice';
import { signIn, signUp, signOut } from '@/services/authService';
import { fetchUserProfile } from '@/services/profileService';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set up authentication listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session) {
        // Get user profile data from our users table
        fetchUserProfile(session.user, dispatch)
          .finally(() => setLoading(false));
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout());
        setLoading(false);
      }
    });

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Current session on init:", session);
        
        if (session) {
          await fetchUserProfile(session.user, dispatch);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return {
    signIn: async (email: string, password: string) => {
      setLoading(true);
      try {
        const result = await signIn(email, password);
        if (!result.success) {
          setLoading(false);
        }
        return result;
      } catch (error) {
        setLoading(false);
        return { success: false, error };
      }
    },
    signUp: async (email: string, password: string, name: string, role: string) => {
      setLoading(true);
      try {
        console.log(`Signing up with role: ${role}`);
        const result = await signUp(email, password, name, role);
        setLoading(false);
        return result;
      } catch (error) {
        setLoading(false);
        return { success: false, error };
      }
    },
    signOut: async () => {
      setLoading(true);
      try {
        const result = await signOut();
        setLoading(false);
        return result;
      } catch (error) {
        setLoading(false);
        return { success: false, error };
      }
    },
    loading,
  };
};
