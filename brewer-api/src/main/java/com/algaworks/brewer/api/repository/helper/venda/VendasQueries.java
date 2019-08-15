package com.algaworks.brewer.api.repository.helper.venda;

import com.algaworks.brewer.api.dto.VendaMes;
import com.algaworks.brewer.api.dto.VendaOrigem;
import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.repository.filter.VendaFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface VendasQueries {

    public Page<Venda> filtrar(VendaFilter vendaFilter, Pageable pageable);

    public BigDecimal valorTotalNoAno();

    public BigDecimal valorTotalNoMes();

    public BigDecimal valorTicketMedioNoAno();

    public List<VendaMes> totalPorMes();

    public List<VendaOrigem> totalPorOrigem();
}
