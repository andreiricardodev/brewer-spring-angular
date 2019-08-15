package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler.Erro;
import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.repository.Cervejas;
import com.algaworks.brewer.api.repository.filter.CervejaFilter;
import com.algaworks.brewer.api.service.CadastroCervejaService;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.SkuCervejaJaCadastradoException;
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
@RequestMapping("/cervejas")
public class CervejasController {

    @Autowired
    private Cervejas cervejas;

    @Autowired
    private CadastroCervejaService cadastroCervejaService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @PostMapping
    public ResponseEntity<Cerveja> salvar(@Valid @RequestBody Cerveja cerveja, HttpServletResponse response) {
        Cerveja cervejaSalvo = cadastroCervejaService.salvar(cerveja);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, cervejaSalvo.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(cervejaSalvo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Cerveja> atualizar(@PathVariable Long codigo, @Valid @RequestBody Cerveja cerveja) {
        Cerveja cervejaSalvo = cadastroCervejaService.atualizar(codigo, cerveja);
        return ResponseEntity.ok(cervejaSalvo);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long codigo) {
        cadastroCervejaService.remover(codigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Cerveja> buscarPeloCodigo(@PathVariable Long codigo) {
        Cerveja cerveja = cervejas.findOne(codigo);
        return cerveja != null ? ResponseEntity.ok(cerveja) : ResponseEntity.notFound().build();
    }

    @GetMapping("/listar")
    public List<Cerveja> listar(String skuOuNome) {
        return cervejas.porSkuOuNome(skuOuNome);
    }

    @GetMapping
    public Page<Cerveja> pesquisar(CervejaFilter cervejaFilter, Pageable pageable) {
        return cervejas.filtrar(cervejaFilter, pageable);
    }

    @ExceptionHandler({ SkuCervejaJaCadastradoException.class, ImpossivelExcluirEntidadeException.class})
    public ResponseEntity<Object> handleCervejaException(RuntimeException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }

}
