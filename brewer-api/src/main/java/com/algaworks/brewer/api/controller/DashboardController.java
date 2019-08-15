package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.dto.DashboardDTO;
import com.algaworks.brewer.api.repository.Cervejas;
import com.algaworks.brewer.api.repository.Clientes;
import com.algaworks.brewer.api.repository.Vendas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private Vendas vendas;

    @Autowired
    private Clientes clientes;

    @Autowired
    private Cervejas cervejas;

    @GetMapping
    public ResponseEntity<DashboardDTO> dashboard(HttpServletResponse response) {
        DashboardDTO dashboardDTO = new DashboardDTO();

        dashboardDTO.setVendasNoAno(vendas.valorTotalNoAno());
        dashboardDTO.setVendasNoMes(vendas.valorTotalNoMes());
        dashboardDTO.setTicketMedio(vendas.valorTicketMedioNoAno());
        dashboardDTO.setValorItensEstoque(cervejas.valorItensEstoque());
        dashboardDTO.setTotalClientes(clientes.findAll().size());
        dashboardDTO.setTotalPorMes(vendas.totalPorMes());
        dashboardDTO.setTotalPorOrigem(vendas.totalPorOrigem());

        return ResponseEntity.ok(dashboardDTO);
    }

}
