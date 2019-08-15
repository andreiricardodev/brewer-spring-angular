package com.algaworks.brewer.api.repository.helper.cidade;

import com.algaworks.brewer.api.model.Cidade;
import com.algaworks.brewer.api.repository.filter.CidadeFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CidadesQueries {

    public Page<Cidade> filtrar(CidadeFilter cidadeFilter, Pageable pageable);

}
