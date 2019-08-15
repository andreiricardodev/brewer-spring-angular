package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.repository.helper.venda.VendasQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Vendas extends JpaRepository<Venda, Long>, VendasQueries {

}
