package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.repository.helper.cerveja.CervejasQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Cervejas extends JpaRepository<Cerveja, Long>, CervejasQueries {

    public Optional<Cerveja> findBySkuIgnoreCase(String sku);

}
