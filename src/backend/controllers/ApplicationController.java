
package com.jobportal.controllers;

import com.jobportal.models.Application;
import com.jobportal.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> applyForJob(
            @RequestParam("jobId") String jobId,
            @RequestParam("resume") MultipartFile resume,
            @RequestParam(value = "coverLetter", required = false) String coverLetter) {
        try {
            String userId = getCurrentUserId();
            Application application = applicationService.applyForJob(jobId, userId, resume, coverLetter);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload resume");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/base64")
    public ResponseEntity<?> applyWithBase64Resume(
            @RequestParam("jobId") String jobId,
            @RequestParam("resume") String base64Resume,
            @RequestParam(value = "coverLetter", required = false) String coverLetter) {
        try {
            String userId = getCurrentUserId();
            Application application = applicationService.applyWithBase64Resume(jobId, userId, base64Resume, coverLetter);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Application>> getUserApplications() {
        String userId = getCurrentUserId();
        List<Application> applications = applicationService.getApplicationsByUser(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable String jobId) {
        try {
            String employerId = getCurrentUserId();
            List<Application> applications = applicationService.getApplicationsByJob(jobId, employerId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String id,
            @RequestParam("status") String status) {
        try {
            String employerId = getCurrentUserId();
            Application application = applicationService.updateApplicationStatus(id, status, employerId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername(); // In our case, username is the user ID
    }
}
