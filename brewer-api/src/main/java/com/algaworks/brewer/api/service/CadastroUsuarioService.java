package com.algaworks.brewer.api.service;

import com.algaworks.brewer.api.model.Usuario;
import com.algaworks.brewer.api.repository.Usuarios;
import com.algaworks.brewer.api.service.exception.EmailUsuarioJaCadastradoException;
import com.algaworks.brewer.api.service.exception.ImpossivelExcluirEntidadeException;
import com.algaworks.brewer.api.service.exception.SenhaObrigatoriaUsuarioException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CadastroUsuarioService {

    @Autowired
    private Usuarios usuarios;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario salvar(Usuario usuario) {
        Optional<Usuario> usuarioOptional = usuarios.findByEmail(usuario.getEmail());
        if (usuarioOptional.isPresent() && !usuarioOptional.get().equals(usuario)) {
            throw new EmailUsuarioJaCadastradoException("E-mail já cadastrado");
        }

        if (usuario.isNovo() && StringUtils.isEmpty(usuario.getSenha())) {
            throw new SenhaObrigatoriaUsuarioException("Senha é obrigatória para novo usuário");
        }
        if (usuario.isNovo() || !StringUtils.isEmpty(usuario.getSenha())) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        } else if (StringUtils.isEmpty(usuario.getSenha())) {
            usuario.setSenha(usuarioOptional.get().getSenha());
        }
        usuario.setConfirmacaoSenha(usuario.getSenha());

        if (!usuario.isNovo() && usuario.getAtivo() == null) {
            usuario.setAtivo(usuarioOptional.get().getAtivo());
        }

        return usuarios.save(usuario);
    }

    @Transactional
    public Usuario atualizar(Long codigo, Usuario usuario) {
        Optional<Usuario> usuarioOptional = buscarUsuarioPeloCodigo(codigo);

        if (usuario.isNovo() || !StringUtils.isEmpty(usuario.getSenha())) {
            usuario.setSenha(this.passwordEncoder.encode(usuario.getSenha()));
        } else if (StringUtils.isEmpty(usuario.getSenha())) {
            usuario.setSenha(usuarioOptional.get().getSenha());
        }
        usuario.setConfirmacaoSenha(usuario.getSenha());

        if (!usuario.isNovo() && usuario.getAtivo() == null) {
            usuario.setAtivo(usuarioOptional.get().getAtivo());
        }

        BeanUtils.copyProperties(usuario, usuarioOptional.get(), "codigo");
        return usuarios.save(usuario);
    }

    @Transactional
    public void remover(Long codigo) {
        try {
            usuarios.delete(codigo);
            usuarios.flush();
        } catch (Exception e) {
            throw new ImpossivelExcluirEntidadeException("Impossível excluir usuário. Já foi utilizado em alguma venda.");
        }
    }

    private Optional<Usuario> buscarUsuarioPeloCodigo(Long codigo) {
        Optional<Usuario> usuarioOptional = Optional.ofNullable(usuarios.findOne(codigo));
        if (!usuarioOptional.isPresent()) {
            throw new EmptyResultDataAccessException(1);
        }

        return usuarioOptional;
    }

}
