
# Job Portal API Documentation

This document outlines the REST APIs provided by the Job Portal backend system.

## Base URL

```
http://localhost:8080/api
```

## Authentication Endpoints

### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "JOBSEEKER"  // JOBSEEKER, EMPLOYER, ADMIN
  }
  ```
- **Response**: User object without password

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN",
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "JOBSEEKER"
  }
  ```

## Job Endpoints

### Get All Jobs

- **URL**: `/jobs`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 0)
  - `size`: Items per page (default: 20)
  - `sort`: Sort field (default: postedDate,desc)
- **Response**: Paginated list of jobs

### Search Jobs

- **URL**: `/jobs/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query`: Search term for title/description
  - `location`: Location to filter by
  - `jobTypes`: List of job types (e.g., FULL_TIME, PART_TIME)
  - `experienceLevels`: List of experience levels
  - `salaryRanges`: List of salary ranges
  - `remote`: Boolean for remote jobs only
- **Response**: List of matching jobs

### Create Job

- **URL**: `/jobs`
- **Method**: `POST`
- **Authentication**: Required (EMPLOYER role)
- **Request Body**:
  ```json
  {
    "title": "Senior Frontend Developer",
    "company": "TechCorp",
    "description": "Job description...",
    "location": "San Francisco, CA",
    "type": "FULL_TIME",
    "salary": "$120,000 - $150,000",
    "requirements": ["React", "JavaScript", "5+ years experience"],
    "experienceLevel": "Senior level",
    "remote": true,
    "category": "Technology",
    "deadline": "2025-05-01"
  }
  ```
- **Response**: Created job object

### Get Job by ID

- **URL**: `/jobs/{id}`
- **Method**: `GET`
- **Response**: Job object

### Update Job

- **URL**: `/jobs/{id}`
- **Method**: `PUT`
- **Authentication**: Required (EMPLOYER who created the job)
- **Request Body**: Same as Create Job
- **Response**: Updated job object

### Delete Job

- **URL**: `/jobs/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (EMPLOYER who created the job)
- **Response**: Success message

### Get Jobs by Current Employer

- **URL**: `/jobs/employer`
- **Method**: `GET`
- **Authentication**: Required (EMPLOYER role)
- **Response**: List of jobs created by the authenticated employer

## Application Endpoints

### Apply for Job (with file upload)

- **URL**: `/applications`
- **Method**: `POST`
- **Authentication**: Required (JOBSEEKER role)
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `jobId`: ID of the job
  - `resume`: Resume file
  - `coverLetter`: Cover letter text (optional)
- **Response**: Application object

### Apply for Job (with base64 resume)

- **URL**: `/applications/base64`
- **Method**: `POST`
- **Authentication**: Required (JOBSEEKER role)
- **Request Parameters**:
  - `jobId`: ID of the job
  - `resume`: Base64 encoded resume
  - `coverLetter`: Cover letter text (optional)
- **Response**: Application object

### Get User Applications

- **URL**: `/applications/user`
- **Method**: `GET`
- **Authentication**: Required (JOBSEEKER role)
- **Response**: List of applications submitted by the authenticated user

### Get Job Applications

- **URL**: `/applications/job/{jobId}`
- **Method**: `GET`
- **Authentication**: Required (EMPLOYER who created the job)
- **Response**: List of applications for the specified job

### Update Application Status

- **URL**: `/applications/{id}/status`
- **Method**: `PUT`
- **Authentication**: Required (EMPLOYER who created the job)
- **Request Parameters**:
  - `status`: New status (PENDING, REVIEWED, REJECTED, INTERVIEW, HIRED)
- **Response**: Updated application object

## Admin Endpoints

### Get All Users

- **URL**: `/admin/users`
- **Method**: `GET`
- **Authentication**: Required (ADMIN role)
- **Query Parameters**:
  - `page`: Page number (default: 0)
  - `size`: Items per page (default: 20)
- **Response**: Paginated list of users

### Get System Statistics

- **URL**: `/admin/statistics`
- **Method**: `GET`
- **Authentication**: Required (ADMIN role)
- **Response**: Statistics object with counts of users, jobs, applications, etc.

### Moderate Job

- **URL**: `/admin/jobs/{id}/moderate`
- **Method**: `PUT`
- **Authentication**: Required (ADMIN role)
- **Request Parameters**:
  - `active`: Boolean to activate/deactivate the job
- **Response**: Updated job object

### Ban User

- **URL**: `/admin/users/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (ADMIN role)
- **Response**: Success message
