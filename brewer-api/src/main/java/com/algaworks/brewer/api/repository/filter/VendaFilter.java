package com.algaworks.brewer.api.repository.filter;

import com.algaworks.brewer.api.model.StatusVenda;

import java.math.BigDecimal;
import java.time.LocalDate;

public class VendaFilter {

    private Long codigo;
    private StatusVenda status;
    private LocalDate dataInicial;
    private LocalDate dataFinal;
    private BigDecimal valorInicial;
    private BigDecimal valorFinal;
    private String nomeCliente;
    private String cpfOuCnpjCliente;

    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public StatusVenda getStatus() {
        return status;
    }

    public void setStatus(StatusVenda status) {
        this.status = status;
    }

    public LocalDate getDataInicial() {
        return dataInicial;
    }

    public void setDataInicial(LocalDate dataInicial) {
        this.dataInicial = dataInicial;
    }

    public LocalDate getDataFinal() {
        return dataFinal;
    }

    public void setDataFinal(LocalDate dataFinal) {
        this.dataFinal = dataFinal;
    }

    public BigDecimal getValorInicial() {
        return valorInicial;
    }

    public void setValorInicial(BigDecimal valorInicial) {
        this.valorInicial = valorInicial;
    }

    public BigDecimal getValorFinal() {
        return valorFinal;
    }

    public void setValorFinal(BigDecimal valorFinal) {
        this.valorFinal = valorFinal;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getCpfOuCnpjCliente() {
        return cpfOuCnpjCliente;
    }

    public void setCpfOuCnpjCliente(String cpfOuCnpjCliente) {
        this.cpfOuCnpjCliente = cpfOuCnpjCliente;
    }
}
