
package com.jobportal.repositories;

import com.jobportal.models.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByEmployerId(String employerId);
    
    List<Job> findByActive(boolean active);
    
    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<Job> findByTitleContaining(String title);
    
    @Query("{'location': {$regex: ?0, $options: 'i'}}")
    List<Job> findByLocationContaining(String location);
    
    List<Job> findByType(String type);
    
    List<Job> findByRemote(boolean remote);
    
    @Query("{'experienceLevel': ?0}")
    List<Job> findByExperienceLevel(String experienceLevel);
    
    @Query("{'category': ?0}")
    List<Job> findByCategory(String category);
}
