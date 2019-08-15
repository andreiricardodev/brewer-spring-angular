package com.algaworks.brewer.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {

    private BigDecimal vendasNoAno;
    private BigDecimal vendasNoMes;
    private BigDecimal ticketMedio;
    private ValorItensEstoque valorItensEstoque;
    private Integer totalClientes;
    private List<VendaMes> totalPorMes;
    private List<VendaOrigem> totalPorOrigem;

    public BigDecimal getVendasNoAno() {
        return vendasNoAno;
    }

    public void setVendasNoAno(BigDecimal vendasNoAno) {
        this.vendasNoAno = vendasNoAno;
    }

    public BigDecimal getVendasNoMes() {
        return vendasNoMes;
    }

    public void setVendasNoMes(BigDecimal vendasNoMes) {
        this.vendasNoMes = vendasNoMes;
    }

    public BigDecimal getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(BigDecimal ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public ValorItensEstoque getValorItensEstoque() {
        return valorItensEstoque;
    }

    public void setValorItensEstoque(ValorItensEstoque valorItensEstoque) {
        this.valorItensEstoque = valorItensEstoque;
    }

    public Integer getTotalClientes() {
        return totalClientes;
    }

    public void setTotalClientes(Integer totalClientes) {
        this.totalClientes = totalClientes;
    }

    public List<VendaMes> getTotalPorMes() {
        return totalPorMes;
    }

    public void setTotalPorMes(List<VendaMes> totalPorMes) {
        this.totalPorMes = totalPorMes;
    }

    public List<VendaOrigem> getTotalPorOrigem() {
        return totalPorOrigem;
    }

    public void setTotalPorOrigem(List<VendaOrigem> totalPorOrigem) {
        this.totalPorOrigem = totalPorOrigem;
    }
}
