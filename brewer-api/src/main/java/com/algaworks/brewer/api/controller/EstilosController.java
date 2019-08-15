package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler.Erro;
import com.algaworks.brewer.api.model.Estilo;
import com.algaworks.brewer.api.repository.Estilos;
import com.algaworks.brewer.api.repository.filter.EstiloFilter;
import com.algaworks.brewer.api.service.CadastroEstiloService;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.NomeEstiloJaCadastradoException;
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
@RequestMapping("/estilos")
public class EstilosController {

    @Autowired
    private Estilos estilos;

    @Autowired
    private CadastroEstiloService cadastroEstiloService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @PostMapping
    public ResponseEntity<Estilo> salvar(@Valid @RequestBody Estilo estilo, HttpServletResponse response) {
        Estilo estiloSalvo = cadastroEstiloService.salvar(estilo);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, estiloSalvo.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(estiloSalvo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Estilo> atualizar(@PathVariable Long codigo, @Valid @RequestBody Estilo estilo) {
        Estilo estiloSalvo = cadastroEstiloService.atualizar(codigo, estilo);
        return ResponseEntity.ok(estiloSalvo);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long codigo) {
        cadastroEstiloService.remover(codigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Estilo> buscarPeloCodigo(@PathVariable Long codigo) {
        Estilo estilo = estilos.findOne(codigo);
        return estilo != null ? ResponseEntity.ok(estilo) : ResponseEntity.notFound().build();
    }

    @GetMapping("/listar")
    public List<Estilo> listar() {
        return estilos.findAll();
    }

    @GetMapping
    public Page<Estilo> pesquisar(EstiloFilter estiloFilter, Pageable pageable) {
        return estilos.filtrar(estiloFilter, pageable);
    }

    @ExceptionHandler({ NomeEstiloJaCadastradoException.class, ImpossivelExcluirEntidadeException.class })
    public ResponseEntity<Object> handleEstiloException(RuntimeException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }

}
