package com.algaworks.brewer.api.service.event.venda;

import com.algaworks.brewer.api.model.Venda;

public class VendaEvent {

    private Venda venda;

    public VendaEvent(Venda venda) {
        this.venda = venda;
    }

    public Venda getVenda() {
        return venda;
    }

}
