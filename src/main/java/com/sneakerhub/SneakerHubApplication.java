package com.sneakerhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan // Enables scanning of @WebServlet, @WebFilter, and @WebListener classes
public class SneakerHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(SneakerHubApplication.class, args);
    }
}
