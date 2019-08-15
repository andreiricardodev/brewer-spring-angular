package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.Cliente;
import com.algaworks.brewer.api.model.TipoPessoa;
import com.algaworks.brewer.api.repository.Clientes;
import com.algaworks.brewer.api.service.exception.CpfCnpjClienteJaCadastradoException;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CadastroClienteService {

    @Autowired
    private Clientes clientes;

    @Transactional
    public Cliente salvar(Cliente cliente) {
        Optional<Cliente> clienteOptional = clientes.findByCpfOuCnpj(cliente.getCpfOuCnpj());

        if (clienteOptional.isPresent()) {
            throw new CpfCnpjClienteJaCadastradoException((cliente.getTipoPessoa() == TipoPessoa.FISICA ? "CPF" : "CNPJ") + " já cadastrado");
        }

        return clientes.save(cliente);
    }

    @Transactional
    public Cliente atualizar(Long codigo, Cliente cliente) {
        Optional<Cliente> clienteOptional = buscarClientePeloCodigo(codigo);

        BeanUtils.copyProperties(cliente, clienteOptional.get(), "codigo");
        return clientes.save(cliente);
    }

    @Transactional
    public void remover(Long codigo) {
        try {
            clientes.delete(codigo);
            clientes.flush();
        } catch (Exception e) {
            throw new ImpossivelExcluirEntidadeException("Impossível excluir cliente. Já foi utilizado em alguma venda.");
        }
    }

    private Optional<Cliente> buscarClientePeloCodigo(Long codigo) {
        Optional<Cliente> clienteOptional = Optional.ofNullable(clientes.findOne(codigo));
        if (!clienteOptional.isPresent()) {
            throw new EmptyResultDataAccessException(1);
        }

        return clienteOptional;
    }
}
