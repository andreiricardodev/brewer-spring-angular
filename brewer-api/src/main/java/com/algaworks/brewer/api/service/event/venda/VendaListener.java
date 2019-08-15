package com.algaworks.brewer.api.service.event.venda;

import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.model.ItemVenda;
import com.algaworks.brewer.api.repository.Cervejas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class VendaListener {

    @Autowired
    private Cervejas cervejas;

    @EventListener
    public void vendaEmitida(VendaEvent vendaEvent) {
        for (ItemVenda item : vendaEvent.getVenda().getItens()) {
            Cerveja cerveja = cervejas.findOne(item.getCerveja().getCodigo());
            cerveja.setQuantidadeEstoque(cerveja.getQuantidadeEstoque() - item.getQuantidade());
            cervejas.save(cerveja);
        }
    }

}
