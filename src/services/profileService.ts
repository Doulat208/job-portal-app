
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { loginSuccess } from '@/redux/slices/authSlice';

export const fetchUserProfile = async (user: User, dispatch: any) => {
  try {
    console.log('Fetching profile for user:', user.id);
    
    // Try to get profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      
      // Only create a new profile if the error is "not found"
      if (error.code === 'PGRST116') { // This is the "no rows returned" error code
        await createNewProfile(user, dispatch);
      }
      return;
    }

    // If profile exists in the profiles table
    if (profile) {
      console.log('Profile found:', profile);
      console.log('User role from profile:', profile.role);
      
      // Make sure role is always properly set
      const role = profile.role === 'employer' ? 'employer' : 
                   profile.role === 'admin' ? 'admin' : 'jobseeker';
      
      dispatch(loginSuccess({
        id: user.id,
        name: profile.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: role as 'jobseeker' | 'employer' | 'admin',
      }));
    } else {
      // If no profile exists yet, create one
      await createNewProfile(user, dispatch);
    }
  } catch (error) {
    console.error('Error in profile handling:', error);
    // If we can't get or create the profile, use the basic user info
    const fallbackName = user.email?.split('@')[0] || 'User';
    console.log('Using fallback user info:', fallbackName);
    dispatch(loginSuccess({
      id: user.id,
      name: fallbackName,
      email: user.email || '',
      role: 'jobseeker' as const, // Default role as a literal type
    }));
  }
};

export const createNewProfile = async (user: User, dispatch: any) => {
  try {
    console.log('Creating new profile for user:', user.id);
    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || user.email?.split('@')[0] || 'User';
    
    // Extract role from metadata, ensuring it's either 'employer' or 'jobseeker'
    const preferred_role = metadata.preferred_role === 'employer' ? 'employer' : 
                           metadata.preferred_role === 'admin' ? 'admin' : 'jobseeker';
    
    console.log('Creating profile with role:', preferred_role);
    
    // Create a profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        email: user.email,
        role: preferred_role,
      })
      .select()
      .single();
      
    if (insertError) {
      console.error('Could not create profile:', insertError);
      throw insertError;
    } else {
      console.log('Successfully created profile:', newProfile);
      // Log the user in with the newly created profile info
      dispatch(loginSuccess({
        id: user.id,
        name: fullName,
        email: user.email || '',
        role: preferred_role as 'jobseeker' | 'employer' | 'admin',
      }));
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};
