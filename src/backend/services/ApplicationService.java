
package com.jobportal.services;

import com.jobportal.models.Application;
import com.jobportal.models.Job;
import com.jobportal.repositories.ApplicationRepository;
import com.jobportal.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    private final Path fileStorageLocation = Paths.get("uploads/resumes");

    public ApplicationService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", e);
        }
    }

    // Apply for a job with file upload
    public Application applyForJob(String jobId, String userId, MultipartFile resume, String coverLetter) throws IOException {
        // Check if job exists
        Optional<Job> job = jobRepository.findById(jobId);
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        // Check if user has already applied
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new RuntimeException("You have already applied for this job");
        }
        
        Application application = new Application();
        application.setJobId(jobId);
        application.setUserId(userId);
        application.setCoverLetter(coverLetter);
        application.setStatus("PENDING");
        
        // Store resume as file
        String resumePath = storeFile(resume);
        application.setResume(resumePath);
        
        // Set dates
        String now = LocalDateTime.now().toString();
        application.setAppliedDate(now);
        application.setLastUpdated(now);
        
        return applicationRepository.save(application);
    }
    
    // Alternative: Apply with base64 encoded resume
    public Application applyWithBase64Resume(String jobId, String userId, String base64Resume, String coverLetter) {
        // Check if job exists
        Optional<Job> job = jobRepository.findById(jobId);
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        // Check if user has already applied
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new RuntimeException("You have already applied for this job");
        }
        
        Application application = new Application();
        application.setJobId(jobId);
        application.setUserId(userId);
        application.setResume(base64Resume);
        application.setCoverLetter(coverLetter);
        application.setStatus("PENDING");
        
        // Set dates
        String now = LocalDateTime.now().toString();
        application.setAppliedDate(now);
        application.setLastUpdated(now);
        
        return applicationRepository.save(application);
    }
    
    // Get applications by job seeker
    public List<Application> getApplicationsByUser(String userId) {
        return applicationRepository.findByUserId(userId);
    }
    
    // Get applications by job
    public List<Application> getApplicationsByJob(String jobId, String employerId) {
        // Verify that the employer is the owner of the job
        Optional<Job> job = jobRepository.findById(jobId);
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        if (!job.get().getEmployerId().equals(employerId)) {
            throw new RuntimeException("You don't have permission to view these applications");
        }
        
        return applicationRepository.findByJobId(jobId);
    }
    
    // Update application status
    public Application updateApplicationStatus(String id, String status, String employerId) {
        Optional<Application> existingApplication = applicationRepository.findById(id);
        if (!existingApplication.isPresent()) {
            throw new RuntimeException("Application not found");
        }
        
        Application application = existingApplication.get();
        
        // Verify that the employer is the owner of the job
        Optional<Job> job = jobRepository.findById(application.getJobId());
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        if (!job.get().getEmployerId().equals(employerId)) {
            throw new RuntimeException("You don't have permission to update this application");
        }
        
        application.setStatus(status);
        application.setLastUpdated(LocalDateTime.now().toString());
        
        return applicationRepository.save(application);
    }
    
    // Helper method to store file
    private String storeFile(MultipartFile file) throws IOException {
        // Normalize file name
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // Copy file to the target location
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);
        
        return fileName;
    }
}
