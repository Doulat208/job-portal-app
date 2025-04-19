
package com.jobportal.services;

import com.jobportal.models.Job;
import com.jobportal.models.User;
import com.jobportal.repositories.ApplicationRepository;
import com.jobportal.repositories.JobRepository;
import com.jobportal.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // Get all users with pagination
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // Get system statistics
    public Map<String, Object> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        
        // Count by role
        long employers = 0;
        long jobSeekers = 0;
        
        for (User user : userRepository.findAll()) {
            if ("EMPLOYER".equals(user.getRole())) {
                employers++;
            } else if ("JOBSEEKER".equals(user.getRole())) {
                jobSeekers++;
            }
        }
        
        // Job statistics
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.findByActive(true).size();
        
        // Application statistics
        long totalApplications = applicationRepository.count();
        
        // Populate the statistics map
        statistics.put("totalUsers", totalUsers);
        statistics.put("employers", employers);
        statistics.put("jobSeekers", jobSeekers);
        statistics.put("totalJobs", totalJobs);
        statistics.put("activeJobs", activeJobs);
        statistics.put("totalApplications", totalApplications);
        
        return statistics;
    }
    
    // Moderate job - toggle active status
    public Job moderateJob(String jobId, boolean active) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.setActive(active);
        return jobRepository.save(job);
    }
    
    // Ban user
    public void banUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // In a real application, you might set a banned flag or delete the user
        userRepository.delete(user);
    }
}
