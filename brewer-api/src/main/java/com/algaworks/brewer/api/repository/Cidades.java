package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Cidade;
import com.algaworks.brewer.api.model.Estado;
import com.algaworks.brewer.api.repository.helper.cidade.CidadesQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Cidades extends JpaRepository<Cidade, Long>, CidadesQueries {

    public Optional<Cidade> findByNomeAndEstado(String nome, Estado estado);

    public List<Cidade> findByEstadoCodigo(Long codigoEstado);
}
