package com.cs5500.walletscan.repository;

import com.cs5500.walletscan.entity.Subscribe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface SubscribeRepository extends JpaRepository<Subscribe, String> {

}
