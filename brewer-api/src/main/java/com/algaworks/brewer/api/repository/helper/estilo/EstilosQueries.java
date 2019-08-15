package com.algaworks.brewer.api.repository.helper.estilo;

import com.algaworks.brewer.api.model.Estilo;
import com.algaworks.brewer.api.repository.filter.EstiloFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EstilosQueries {

    public Page<Estilo> filtrar(EstiloFilter estiloFilter, Pageable pageable);

}
