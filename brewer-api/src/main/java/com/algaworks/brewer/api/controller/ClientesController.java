package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler.Erro;
import com.algaworks.brewer.api.model.Cliente;
import com.algaworks.brewer.api.repository.Clientes;
import com.algaworks.brewer.api.repository.filter.ClienteFilter;
import com.algaworks.brewer.api.service.CadastroClienteService;
import com.algaworks.brewer.api.service.exception.CpfCnpjClienteJaCadastradoException;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClientesController {

    @Autowired
    private Clientes clientes;

    @Autowired
    private CadastroClienteService cadastroClienteService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @PostMapping
    public ResponseEntity<Cliente> salvar(@Valid @RequestBody Cliente cliente, HttpServletResponse response) {
        Cliente clienteSalvo = cadastroClienteService.salvar(cliente);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, clienteSalvo.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteSalvo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long codigo, @Valid @RequestBody Cliente cliente) {
        Cliente clienteSalvo = cadastroClienteService.atualizar(codigo, cliente);
        return ResponseEntity.ok(clienteSalvo);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long codigo) {
        cadastroClienteService.remover(codigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Cliente> buscarPeloCodigo(@PathVariable Long codigo) {
        Cliente cliente = clientes.findOne(codigo);
        return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
    }

    @GetMapping("/porNome")
    public List<Cliente> pesquisarPorNome(String nome) {
        return clientes.findByNomeStartingWithIgnoreCase(nome);
    }

    @GetMapping
    public Page<Cliente> pesquisar(ClienteFilter clienteFilter, Pageable pageable) {
        return clientes.filtrar(clienteFilter, pageable);
    }

    @ExceptionHandler({ CpfCnpjClienteJaCadastradoException.class, ImpossivelExcluirEntidadeException.class })
    public ResponseEntity<Object> handleClientesException(RuntimeException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }

}
