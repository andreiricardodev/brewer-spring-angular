package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.mail.Mailer;
import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.repository.Vendas;
import com.algaworks.brewer.api.repository.filter.VendaFilter;
import com.algaworks.brewer.api.service.CadastroVendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@RequestMapping("/vendas")
public class VendasController {

    @Autowired
    private Vendas vendas;

    @Autowired
    private CadastroVendaService cadastroVendaService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private Mailer mailer;

    @PostMapping("/salvar")
    public ResponseEntity<Venda> salvar(@Valid @RequestBody Venda venda, HttpServletResponse response) {
        venda.prepararItens();
        Venda vendaSalva = cadastroVendaService.salvar(venda);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, vendaSalva.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(vendaSalva);
    }

    @PostMapping("/emitir")
    public ResponseEntity<Venda> emitir(@Valid @RequestBody Venda venda, HttpServletResponse response) {
        venda.prepararItens();
        Venda vendaSalva = cadastroVendaService.emitir(venda);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, vendaSalva.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(vendaSalva);
    }

    @PostMapping("/enviarEmail")
    public ResponseEntity<Venda> enviarEmail(@Valid @RequestBody Venda venda, HttpServletResponse response) {
        venda.prepararItens();
        Venda vendaSalva = cadastroVendaService.salvar(venda);
        if (!StringUtils.isEmpty(vendaSalva.getCliente().getEmail())) {
            mailer.enviar(vendaSalva);
        }
        publisher.publishEvent(new RecursoCriadoEvent(this, response, vendaSalva.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(vendaSalva);
    }

    @PostMapping("/cancelar")
    @PreAuthorize("hasAuthority('ROLE_CANCELAR_VENDA')")
    public ResponseEntity<Venda> cancelar(@Valid @RequestBody Venda venda, HttpServletResponse response) {
        Venda vendaCancelada = cadastroVendaService.cancelar(venda);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, vendaCancelada.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(vendaCancelada);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Venda> buscarPeloCodigo(@PathVariable Long codigo) {
        Venda venda = vendas.findOne(codigo);
        return venda != null ? ResponseEntity.ok(venda) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public Page<Venda> pesquisar(VendaFilter vendaFilter, Pageable pageable) {
        return vendas.filtrar(vendaFilter, pageable);
    }
}
