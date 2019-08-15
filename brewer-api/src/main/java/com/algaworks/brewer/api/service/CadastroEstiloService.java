package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.Estilo;
import com.algaworks.brewer.api.repository.Estilos;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.NomeEstiloJaCadastradoException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CadastroEstiloService {

    @Autowired
    private Estilos estilos;

    @Transactional
    public Estilo salvar(Estilo estilo) {
        Optional<Estilo> estiloOptional = estilos.findByNomeIgnoreCase(estilo.getNome());

        if (estiloOptional.isPresent()) {
            throw new NomeEstiloJaCadastradoException("Nome do Estilo já cadastrado");
        }

        return estilos.save(estilo);
    }

    @Transactional
    public Estilo atualizar(Long codigo, Estilo estilo) {
        Optional<Estilo> estiloOptional = buscarEstiloPeloCodigo(codigo);

        BeanUtils.copyProperties(estilo, estiloOptional.get(), "codigo");
        return estilos.save(estilo);
    }

    @Transactional
    public void remover(Long codigo) {
        try {
            estilos.delete(codigo);
            estilos.flush();
        } catch (Exception e) {
            throw new ImpossivelExcluirEntidadeException("Impossível excluir estilo. Já foi utilizado em alguma cerveja");
        }
    }

    private Optional<Estilo> buscarEstiloPeloCodigo(Long codigo) {
        Optional<Estilo> estiloOptional = Optional.ofNullable(estilos.findOne(codigo));
        if (!estiloOptional.isPresent()) {
            throw new EmptyResultDataAccessException(1);
        }

        return estiloOptional;
    }
}
