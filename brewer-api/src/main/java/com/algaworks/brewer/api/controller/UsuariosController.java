package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.event.RecursoCriadoEvent;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler.Erro;
import com.algaworks.brewer.api.model.Usuario;
import com.algaworks.brewer.api.repository.Usuarios;
import com.algaworks.brewer.api.repository.filter.UsuarioFilter;
import com.algaworks.brewer.api.service.CadastroUsuarioService;
import com.algaworks.brewer.api.service.exception.EmailUsuarioJaCadastradoException;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.SenhaObrigatoriaUsuarioException;
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
@RequestMapping("/usuarios")
public class UsuariosController {

    @Autowired
    private Usuarios usuarios;

    @Autowired
    private CadastroUsuarioService cadastroUsuarioService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @PostMapping
    public ResponseEntity<Usuario> salvar(@Valid @RequestBody Usuario usuario, HttpServletResponse response) {
        Usuario usuarioSalvo = cadastroUsuarioService.salvar(usuario);
        publisher.publishEvent(new RecursoCriadoEvent(this, response, usuarioSalvo.getCodigo()));
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long codigo, @Valid @RequestBody Usuario usuario) {
        Usuario usuarioSalvo = cadastroUsuarioService.atualizar(codigo, usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long codigo) {
        cadastroUsuarioService.remover(codigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Usuario> buscarPeloCodigo(@PathVariable Long codigo) {
        Usuario usuario = usuarios.findOne(codigo);
        return usuario != null ? ResponseEntity.ok(usuario) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public Page<Usuario> pesquisar(UsuarioFilter usuarioFilter, Pageable pageable) {
        return usuarios.filtrar(usuarioFilter, pageable);
    }

    @ExceptionHandler({ EmailUsuarioJaCadastradoException.class, SenhaObrigatoriaUsuarioException.class,
            ImpossivelExcluirEntidadeException.class })
    public ResponseEntity<Object> handleUsuarioException(RuntimeException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }
}
