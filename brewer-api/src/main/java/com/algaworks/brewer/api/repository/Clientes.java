package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Cliente;
import com.algaworks.brewer.api.repository.helper.cliente.ClientesQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Clientes extends JpaRepository<Cliente, Long>, ClientesQueries {

    public Optional<Cliente> findByCpfOuCnpj(String cpfOuCnpj);

    public List<Cliente> findByNomeStartingWithIgnoreCase(String nome);

}
