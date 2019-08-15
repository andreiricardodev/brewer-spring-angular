package com.algaworks.brewer.api.config;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.S3ClientOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Bean
    public AmazonS3 amazonS3() {
        AWSCredentials credenciais = new BasicAWSCredentials(
                "AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
        );
        AmazonS3 amazonS3 = new AmazonS3Client(credenciais, new ClientConfiguration());
        amazonS3.setS3ClientOptions(S3ClientOptions.builder().setPathStyleAccess(true).build());
        amazonS3.setEndpoint("http://localhost:9444/s3");
        return  amazonS3;
    }


}
