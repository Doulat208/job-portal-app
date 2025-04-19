
package com.jobportal.services;

import com.jobportal.dto.JobRequest;
import com.jobportal.models.Job;
import com.jobportal.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // Create a new job
    public Job createJob(JobRequest jobRequest, String employerId) {
        Job job = new Job();
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setCompany(jobRequest.getCompany());
        job.setLocation(jobRequest.getLocation());
        job.setType(jobRequest.getType());
        job.setSalary(jobRequest.getSalary());
        job.setRequirements(jobRequest.getRequirements());
        job.setExperienceLevel(jobRequest.getExperienceLevel());
        job.setRemote(jobRequest.isRemote());
        job.setCategory(jobRequest.getCategory());
        job.setDeadline(jobRequest.getDeadline());
        job.setEmployerId(employerId);
        job.setPostedDate(LocalDateTime.now().toString());
        job.setActive(true);
        
        return jobRepository.save(job);
    }

    // Get all jobs with pagination
    public Page<Job> getAllJobs(Pageable pageable) {
        return jobRepository.findAll(pageable);
    }

    // Get job by id
    public Optional<Job> getJobById(String id) {
        return jobRepository.findById(id);
    }

    // Update job
    public Job updateJob(String id, JobRequest jobRequest, String employerId) {
        Optional<Job> existingJob = jobRepository.findById(id);
        
        if (!existingJob.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        Job job = existingJob.get();
        
        // Check if the current user is the owner of this job
        if (!job.getEmployerId().equals(employerId)) {
            throw new RuntimeException("You don't have permission to update this job");
        }
        
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setLocation(jobRequest.getLocation());
        job.setType(jobRequest.getType());
        job.setSalary(jobRequest.getSalary());
        job.setRequirements(jobRequest.getRequirements());
        job.setExperienceLevel(jobRequest.getExperienceLevel());
        job.setRemote(jobRequest.isRemote());
        job.setCategory(jobRequest.getCategory());
        job.setDeadline(jobRequest.getDeadline());
        
        return jobRepository.save(job);
    }

    // Delete job
    public void deleteJob(String id, String employerId) {
        Optional<Job> existingJob = jobRepository.findById(id);
        
        if (!existingJob.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        
        Job job = existingJob.get();
        
        // Check if the current user is the owner of this job
        if (!job.getEmployerId().equals(employerId)) {
            throw new RuntimeException("You don't have permission to delete this job");
        }
        
        jobRepository.delete(job);
    }

    // Find jobs by employer
    public List<Job> getJobsByEmployer(String employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    // Search jobs with filters
    public List<Job> searchJobs(String query, String location, List<String> jobTypes, 
                               List<String> experienceLevels, List<String> salaryRanges, 
                               boolean remote) {
        // This is a simplified implementation
        // In a real application, you would use more sophisticated querying
        // or a search engine like Elasticsearch
        
        List<Job> allJobs = jobRepository.findByActive(true);
        List<Job> filteredJobs = new ArrayList<>();
        
        for (Job job : allJobs) {
            boolean matchesQuery = query == null || 
                                   job.getTitle().toLowerCase().contains(query.toLowerCase()) || 
                                   job.getDescription().toLowerCase().contains(query.toLowerCase());
            
            boolean matchesLocation = location == null || location.isEmpty() ||
                                     job.getLocation().toLowerCase().contains(location.toLowerCase());
            
            boolean matchesType = jobTypes == null || jobTypes.isEmpty() ||
                                 jobTypes.contains(job.getType());
            
            boolean matchesExperience = experienceLevels == null || experienceLevels.isEmpty() ||
                                       experienceLevels.contains(job.getExperienceLevel());
            
            boolean matchesRemote = !remote || job.isRemote();
            
            // Simplified salary range check - in a real app you'd parse and compare numeric ranges
            boolean matchesSalary = salaryRanges == null || salaryRanges.isEmpty() ||
                                   (job.getSalary() != null && salaryRanges.stream()
                                   .anyMatch(range -> job.getSalary().contains(range)));
            
            if (matchesQuery && matchesLocation && matchesType && 
                matchesExperience && matchesRemote && matchesSalary) {
                filteredJobs.add(job);
            }
        }
        
        return filteredJobs;
    }
}
