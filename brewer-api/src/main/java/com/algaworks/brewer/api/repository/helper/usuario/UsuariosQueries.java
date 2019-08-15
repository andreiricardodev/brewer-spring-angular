package com.algaworks.brewer.api.repository.helper.usuario;

import com.algaworks.brewer.api.model.Usuario;
import com.algaworks.brewer.api.repository.filter.UsuarioFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UsuariosQueries {

    public Page<Usuario> filtrar(UsuarioFilter usuarioFilter, Pageable pageable);

    public List<String> permissoes(Usuario usuario);

}
