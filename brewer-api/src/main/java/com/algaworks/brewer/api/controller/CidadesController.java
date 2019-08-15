package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler.Erro;
import com.algaworks.brewer.api.model.Cidade;
import com.algaworks.brewer.api.repository.Cidades;
import com.algaworks.brewer.api.repository.filter.CidadeFilter;
import com.algaworks.brewer.api.service.CadastroCidadeService;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.NomeCidadeJaCadastradaException;
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
@RequestMapping("/cidades")
public class CidadesController {

    @Autowired
    private Cidades cidades;

    @Autowired
    private CadastroCidadeService cadastroCidadeService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @PostMapping
    public ResponseEntity<Cidade> salvar(@Valid @RequestBody Cidade cidade, HttpServletResponse response) {
        Cidade cidadeSalvo = cadastroCidadeService.salvar(cidade);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, cidadeSalvo.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(cidadeSalvo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Cidade> atualizar(@PathVariable Long codigo, @Valid @RequestBody Cidade cidade) {
        Cidade cidadeSalvo = cadastroCidadeService.atualizar(codigo, cidade);
        return ResponseEntity.ok(cidadeSalvo);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long codigo) {
        cadastroCidadeService.remover(codigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Cidade> buscarPeloCodigo(@PathVariable Long codigo) {
        Cidade cidade = cidades.findOne(codigo);
        return cidade != null ? ResponseEntity.ok(cidade) : ResponseEntity.notFound().build();
    }

    @GetMapping("/porEstado/{codigoEstado}")
    public List<Cidade> pesquisarPorEstado(@PathVariable Long codigoEstado) {
        return cidades.findByEstadoCodigo(codigoEstado);
    }

    @GetMapping
    public Page<Cidade> pesquisar(CidadeFilter cidadeFilter, Pageable pageable) {
        return cidades.filtrar(cidadeFilter, pageable);
    }

    @ExceptionHandler({ NomeCidadeJaCadastradaException.class, ImpossivelExcluirEntidadeException.class })
    public ResponseEntity<Object> handleCidadeException(RuntimeException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }

}
