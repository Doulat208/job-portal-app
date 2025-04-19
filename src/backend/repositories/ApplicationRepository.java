
package com.jobportal.repositories;

import com.jobportal.models.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByUserId(String userId);
    
    List<Application> findByJobId(String jobId);
    
    boolean existsByUserIdAndJobId(String userId, String jobId);
}
