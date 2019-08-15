package com.algaworks.brewer.api.repository.helper.estilo;

import com.algaworks.brewer.api.model.Estilo;
import com.algaworks.brewer.api.repository.filter.EstiloFilter;
import com.algaworks.brewer.api.repository.paginacao.PaginacaoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class EstilosImpl implements EstilosQueries {

    @Autowired
    private PaginacaoUtil<Estilo> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public Page<Estilo> filtrar(EstiloFilter estiloFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Estilo> criteria = builder.createQuery(Estilo.class);
        Root<Estilo> root = criteria.from(Estilo.class);

        Predicate[] predicates = criarRestricoes(estiloFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Estilo> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Estilo>(query.getResultList(), pageable, total(estiloFilter));
    }

    private Predicate[] criarRestricoes(EstiloFilter estiloFilter, CriteriaBuilder builder, Root<Estilo> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(estiloFilter.getNome())) {
            predicates.add(builder.like(builder.lower(root.get("nome")), "%" + estiloFilter.getNome().toLowerCase() + "%"));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }

    private Long total(EstiloFilter estiloFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Estilo> root = criteria.from(Estilo.class);

        Predicate[] predicates = criarRestricoes(estiloFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }
}
