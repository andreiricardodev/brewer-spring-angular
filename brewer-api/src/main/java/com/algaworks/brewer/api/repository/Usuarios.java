package com.algaworks.brewer.api.repository;

import com.algaworks.brewer.api.model.Usuario;
import com.algaworks.brewer.api.repository.helper.usuario.UsuariosQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Usuarios extends JpaRepository<Usuario, Long>, UsuariosQueries {

    public Optional<Usuario> findByEmail(String email);
}
