package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.Cidade;
import com.algaworks.brewer.api.repository.Cidades;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.NomeCidadeJaCadastradaException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CadastroCidadeService {

    @Autowired
    private Cidades cidades;

    @Transactional
    public Cidade salvar(Cidade cidade) {
        Optional<Cidade> cidadeOptional = cidades.findByNomeAndEstado(cidade.getNome(), cidade.getEstado());

        if (cidadeOptional.isPresent()) {
            throw new NomeCidadeJaCadastradaException("Nome da Cidade já cadastrado");
        }

        return cidades.save(cidade);
    }

    @Transactional
    public Cidade atualizar(Long codigo, Cidade cidade) {
        Optional<Cidade> cidadeOptional = buscarCidadePeloCodigo(codigo);

        BeanUtils.copyProperties(cidade, cidadeOptional.get(), "codigo");
        return cidades.save(cidade);
    }

    @Transactional
    public void remover(Long codigo) {
        try {
            cidades.delete(codigo);
            cidades.flush();
        } catch (Exception e) {
            throw new ImpossivelExcluirEntidadeException("Impossível excluir cidade. Já foi utilizada em algum cliente.");
        }
    }

    private Optional<Cidade> buscarCidadePeloCodigo(Long codigo) {
        Optional<Cidade> cidadeOptional = Optional.ofNullable(cidades.findOne(codigo));
        if (!cidadeOptional.isPresent()) {
            throw new EmptyResultDataAccessException(1);
        }

        return cidadeOptional;
    }

}
