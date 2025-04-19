
package com.jobportal.controllers;

import com.jobportal.dto.JobRequest;
import com.jobportal.models.Job;
import com.jobportal.services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest) {
        try {
            String employerId = getCurrentUserId();
            Job job = jobService.createJob(jobRequest, employerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(job);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<Job>> getAllJobs(Pageable pageable) {
        Page<Job> jobs = jobService.getAllJobs(pageable);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        Optional<Job> job = jobService.getJobById(id);
        if (job.isPresent()) {
            return ResponseEntity.ok(job.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable String id, @RequestBody JobRequest jobRequest) {
        try {
            String employerId = getCurrentUserId();
            Job updatedJob = jobService.updateJob(id, jobRequest, employerId);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {
        try {
            String employerId = getCurrentUserId();
            jobService.deleteJob(id, employerId);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/employer")
    public ResponseEntity<List<Job>> getJobsByEmployer() {
        String employerId = getCurrentUserId();
        List<Job> jobs = jobService.getJobsByEmployer(employerId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) List<String> jobTypes,
            @RequestParam(required = false) List<String> experienceLevels,
            @RequestParam(required = false) List<String> salaryRanges,
            @RequestParam(required = false, defaultValue = "false") boolean remote) {
        
        List<Job> jobs = jobService.searchJobs(query, location, jobTypes, 
                                              experienceLevels, salaryRanges, remote);
        return ResponseEntity.ok(jobs);
    }
    
    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername(); // In our case, username is the user ID
    }
}
