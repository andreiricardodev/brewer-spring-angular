package com.algaworks.brewer.api;

import com.algaworks.brewer.api.config.property.BrewerApiProperty;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(BrewerApiProperty.class)
public class BrewerApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrewerApiApplication.class, args);
    }
}
