
# Frontend Integration Guide

This document explains how to integrate the Spring Boot backend with your React frontend.

## 1. Authentication Integration

### Setting Up JWT Authentication

1. Store the JWT token in local/session storage upon login

```javascript
// After successful login response
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token and user data in Redux
      dispatch(loginSuccess({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token
      }));
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', data.token);
      
      return { success: true };
    } else {
      dispatch(loginFail(data.message || 'Login failed'));
      return { success: false, message: data.message };
    }
  } catch (error) {
    dispatch(loginFail('Network error'));
    return { success: false, message: 'Network error' };
  }
};
```

2. Create an API client with an authorization header

```javascript
// src/utils/apiClient.js
const apiClient = {
  baseUrl: 'http://localhost:8080/api',
  
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add token to headers if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method,
      headers,
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    
    return await response.json();
  },
  
  // Convenience methods
  get(endpoint) {
    return this.request(endpoint);
  },
  
  post(endpoint, data) {
    return this.request(endpoint, 'POST', data);
  },
  
  put(endpoint, data) {
    return this.request(endpoint, 'PUT', data);
  },
  
  delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  },
  
  // For file uploads with multipart/form-data
  async uploadFile(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {};
    
    // Add token to headers if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return await response.json();
  }
};

export default apiClient;
```

## 2. Job Search Integration

Update your Redux job slice to use the actual API:

```javascript
// src/redux/slices/jobsSlice.js

// Action creators
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        filters.jobTypes.forEach(type => queryParams.append('jobTypes', type));
      }
      if (filters.experience && filters.experience.length > 0) {
        filters.experience.forEach(level => queryParams.append('experienceLevels', level));
      }
      if (filters.salary && filters.salary.length > 0) {
        filters.salary.forEach(range => queryParams.append('salaryRanges', range));
      }
      if (filters.remote) queryParams.append('remote', 'true');
      
      const endpoint = `/jobs/search?${queryParams.toString()}`;
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 3. Job Filters Integration

Update your JobFilters component to dispatch the real API action:

```javascript
// src/components/jobs/JobFilters.jsx
const handleFilterChange = (filters) => {
  // Send the filters to the parent component
  onFilterChange(filters);
  
  // Dispatch the action to fetch filtered jobs
  dispatch(fetchJobs(filters));
};
```

## 4. Applications Management

Handle job applications with file uploads:

```javascript
// Function to apply for a job
const applyForJob = async (jobId, resume, coverLetter) => {
  try {
    // Create FormData for the multipart request
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resume); // File object
    if (coverLetter) {
      formData.append('coverLetter', coverLetter);
    }
    
    const response = await apiClient.uploadFile('/applications', formData);
    
    if (response) {
      // Handle successful application
      dispatch(submitApplicationSuccess(response));
      return { success: true };
    }
  } catch (error) {
    dispatch(submitApplicationFail(error.message));
    return { success: false, message: error.message };
  }
};
```

## 5. Profile and Resume Management

Create a component for resume upload:

```jsx
// src/components/profile/ResumeUpload.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import apiClient from '@/utils/apiClient';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await apiClient.uploadFile('/profile/resume', formData);
      
      if (response) {
        onUploadSuccess(response.filePath);
      }
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <input 
        type="file" 
        accept=".pdf,.doc,.docx" 
        onChange={handleFileChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || loading}
        className="w-full"
      >
        {loading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </div>
  );
};

export default ResumeUpload;
```

## 6. Admin Dashboard Integration

```javascript
// Fetch admin statistics
const fetchAdminStats = async () => {
  try {
    const stats = await apiClient.get('/admin/statistics');
    return stats;
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return null;
  }
};

// Moderate a job
const moderateJob = async (jobId, isActive) => {
  try {
    await apiClient.put(`/admin/jobs/${jobId}/moderate?active=${isActive}`);
    // Refresh job listings after moderation
    fetchJobsList();
  } catch (error) {
    console.error('Error moderating job:', error);
  }
};
```

## 7. Error Handling

Add consistent error handling across your app:

```javascript
// Example error handling component
import { toast } from '@/components/ui/toast';

// Use this in your API response handlers
const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  let message = fallbackMessage;
  
  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
  
  return message;
};
```

This guide provides the main integration points between your React frontend and Spring Boot backend. Adapt these examples to your specific component structure and state management approach.
