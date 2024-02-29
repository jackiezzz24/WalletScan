package com.cs5500.walletscan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ServletComponentScan(basePackages = "com.cs5500.walletscan.servlet")
public class WalletscanApplication {

	public static void main(String[] args) {
		SpringApplication.run(WalletscanApplication.class, args);
	}

}
