
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  companyLogo?: string;
  type?: string;
  experienceLevel?: string;
  remote?: boolean;
  category?: string;
  deadline?: string;
  employer_id?: string;
  is_active?: boolean;
  posted_date?: string; // Added to handle Supabase's column name
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

// Helper function to normalize job data from Supabase
const normalizeJobData = (job: any): Job => {
  return {
    id: job.id,
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    salary: job.salary || '',
    description: job.description || '',
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    // Map Supabase's posted_date to our postedDate
    postedDate: job.posted_date || job.postedDate || new Date().toISOString(),
    companyLogo: job.company_logo || job.companyLogo,
    type: job.type,
    experienceLevel: job.experienceLevel,
    remote: job.remote,
    category: job.category,
    deadline: job.deadline,
    employer_id: job.employer_id,
    is_active: job.is_active
  };
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess(state, action: PayloadAction<any[]>) {
      // Normalize the data coming from Supabase
      const normalizedJobs = action.payload.map(normalizeJobData);
      state.jobs = normalizedJobs;
      state.filteredJobs = normalizedJobs;
      state.loading = false;
      state.error = null;
    },
    fetchJobsFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectJob(state, action: PayloadAction<string>) {
      state.selectedJob = state.jobs.find(job => job.id === action.payload) || null;
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
    },
    filterJobs(state, action: PayloadAction<{query: string, location: string}>) {
      const { query, location } = action.payload;
      state.filteredJobs = state.jobs.filter(job => {
        const matchesQuery = !query || 
          job.title.toLowerCase().includes(query.toLowerCase()) || 
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase());
        
        const matchesLocation = !location || 
          job.location.toLowerCase().includes(location.toLowerCase());
        
        return matchesQuery && matchesLocation;
      });
    },
  },
});

export const { 
  fetchJobsStart, 
  fetchJobsSuccess, 
  fetchJobsFail,
  selectJob,
  clearSelectedJob,
  filterJobs
} = jobsSlice.actions;

export default jobsSlice.reducer;
