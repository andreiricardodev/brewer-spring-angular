package com.algaworks.brewer.api.repository.helper.cerveja;

import com.algaworks.brewer.api.dto.ValorItensEstoque;
import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.repository.filter.CervejaFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CervejasQueries {

    public Page<Cerveja> filtrar(CervejaFilter cervejaFilter, Pageable pageable);

    public List<Cerveja> porSkuOuNome(String skuOuNome);

    public ValorItensEstoque valorItensEstoque();
}
