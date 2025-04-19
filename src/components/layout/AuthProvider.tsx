
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAppSelector } from '@/redux/hooks';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading, signOut } = useAuth();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  // Force check session validity on app load
  useEffect(() => {
    const checkAndClearInvalidSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("No valid session found on AuthProvider mount");
          // If there's no valid session but localStorage has session data,
          // we should force sign out to clear any stale data
          await signOut();
        } else {
          console.log("Valid session found in AuthProvider:", data.session.user.id);
          console.log("Current user role:", user?.role);
        }
      } catch (error) {
        console.error("Error in AuthProvider session check:", error);
      }
    };
    
    checkAndClearInvalidSession();
  }, []);

  // Log auth state changes for debugging
  useEffect(() => {
    console.log("AuthProvider - Auth state changed:", { isAuthenticated, userRole: user?.role });
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
