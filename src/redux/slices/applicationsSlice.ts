
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'interview' | 'hired';
  appliedDate: string;
  resume: string;
  coverLetter?: string;
}

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess(state, action: PayloadAction<Application[]>) {
      state.applications = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchApplicationsFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    submitApplicationStart(state) {
      state.loading = true;
      state.error = null;
    },
    submitApplicationSuccess(state, action: PayloadAction<Application>) {
      state.applications.push(action.payload);
      state.loading = false;
    },
    submitApplicationFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateApplicationStatus(state, action: PayloadAction<{id: string, status: Application['status']}>) {
      const { id, status } = action.payload;
      const application = state.applications.find(app => app.id === id);
      if (application) {
        application.status = status;
      }
    },
  },
});

export const { 
  fetchApplicationsStart, 
  fetchApplicationsSuccess, 
  fetchApplicationsFail,
  submitApplicationStart,
  submitApplicationSuccess,
  submitApplicationFail,
  updateApplicationStatus
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
