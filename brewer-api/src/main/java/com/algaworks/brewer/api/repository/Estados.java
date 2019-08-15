package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Estados extends JpaRepository<Estado, Long> {

}
