package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Grupos extends JpaRepository<Grupo, Long> {

}
