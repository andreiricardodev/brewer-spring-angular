package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.StatusVenda;
import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.repository.Vendas;
import com.algaworks.brewer.api.service.event.venda.VendaEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class CadastroVendaService {

    @Autowired
    private Vendas vendas;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Transactional
    public Venda salvar(Venda venda) {
        if (venda.isNova()) {
            venda.setDataCriacao(LocalDateTime.now());
        } else {
            Venda vendaExistente = vendas.findOne(venda.getCodigo());
            venda.setDataCriacao(vendaExistente.getDataCriacao());
        }

        if (venda.getDataEntrega() != null) {
            venda.setDataHoraEntrega(LocalDateTime.of(venda.getDataEntrega(), venda.getHorarioEntrega() != null ? venda.getHorarioEntrega() : LocalTime.NOON));
        }

        return vendas.saveAndFlush(venda);
    }

    @Transactional
    public Venda emitir(Venda venda) {
        venda.setStatus(StatusVenda.EMITIDA);
        Venda vendaSalva = salvar(venda);

        publisher.publishEvent(new VendaEvent(venda));

        return vendaSalva;
    }

    @Transactional
    public Venda cancelar(Venda venda) {
        Venda vendaExistente = vendas.findOne(venda.getCodigo());
        vendaExistente.setStatus(StatusVenda.CANCELADA);
        return vendas.saveAndFlush(vendaExistente);
    }
}
