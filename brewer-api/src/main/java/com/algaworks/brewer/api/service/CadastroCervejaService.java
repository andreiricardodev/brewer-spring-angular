package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.repository.Cervejas;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.SkuCervejaJaCadastradoException;
import com.algaworks.brewer.api.storage.FotoStorage;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CadastroCervejaService {

    @Autowired
    private Cervejas cervejas;

    @Autowired
    private FotoStorage fotoStorage;

    @Transactional
    public Cerveja salvar(Cerveja cerveja) {
        Optional<Cerveja> cervejaOptional = cervejas.findBySkuIgnoreCase(cerveja.getSku());

        if (cervejaOptional.isPresent()) {
            throw new SkuCervejaJaCadastradoException("SKU da Cerveja já cadastrado");
        }

        return cervejas.save(cerveja);
    }

    @Transactional
    public Cerveja atualizar(Long codigo, Cerveja cerveja) {
        Optional<Cerveja> cervejaOptional = buscarCervejaPeloCodigo(codigo);

        BeanUtils.copyProperties(cerveja, cervejaOptional.get(), "codigo");
        return cervejas.save(cerveja);
    }

    @Transactional
    public void remover(Long codigo) {
        try {
            Cerveja cerveja = cervejas.findOne(codigo);
            String foto = cerveja.getFoto();
            cervejas.delete(codigo);
            cervejas.flush();
            fotoStorage.excluir(foto);
        } catch (Exception e) {
            throw new ImpossivelExcluirEntidadeException("Impossível apagar cerveja. Já foi utilizada em alguma venda.");
        }
    }

    private Optional<Cerveja> buscarCervejaPeloCodigo(Long codigo) {
        Optional<Cerveja> cervejaOptional = Optional.ofNullable(cervejas.findOne(codigo));
        if (!cervejaOptional.isPresent()) {
            throw new EmptyResultDataAccessException(1);
        }

        return cervejaOptional;
    }

}
