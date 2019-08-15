package com.algaworks.brewer.api.repository.helper.usuario;

import com.algaworks.brewer.api.model.Usuario;
import com.algaworks.brewer.api.repository.filter.UsuarioFilter;
import com.algaworks.brewer.api.repository.paginacao.PaginacaoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class UsuariosImpl implements UsuariosQueries {

    @Autowired
    private PaginacaoUtil<Usuario> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public List<String> permissoes(Usuario usuario) {
        return manager
                .createQuery("select distinct p.nome from Usuario u inner join u.grupos g inner join g.permissoes p where u = :usuario", String.class)
                .setParameter("usuario", usuario)
                .getResultList();
    }

    @Override
    public Page<Usuario> filtrar(UsuarioFilter usuarioFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Usuario> criteria = builder.createQuery(Usuario.class);

        Root<Usuario> root = criteria.from(Usuario.class);
        root.fetch("grupos", JoinType.LEFT);

        Predicate[] predicates = criarRestricoes(usuarioFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Usuario> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Usuario>(query.getResultList(), pageable, total(usuarioFilter));
    }

    private Long total(UsuarioFilter usuarioFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Usuario> root = criteria.from(Usuario.class);

        Predicate[] predicates = criarRestricoes(usuarioFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

    private Predicate[] criarRestricoes(UsuarioFilter usuarioFilter, CriteriaBuilder builder, Root<Usuario> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(usuarioFilter.getNome())) {
            predicates.add(builder.like(builder.lower(root.get("nome")), "%" + usuarioFilter.getNome().toLowerCase() + "%"));
        }
        if (!StringUtils.isEmpty(usuarioFilter.getEmail())) {
            predicates.add(builder.equal(root.get("email"), usuarioFilter.getEmail()));
        }
        if (usuarioFilter.getGrupos() != null && !usuarioFilter.getGrupos().isEmpty()) {
            usuarioFilter.getGrupos().forEach( grupo -> predicates.add(builder.equal(root.join("grupos").get("codigo"), grupo.getCodigo())));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }


}
