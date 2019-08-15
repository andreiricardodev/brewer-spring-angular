package com.algaworks.brewer.api.repository.helper.cidade;

import com.algaworks.brewer.api.model.Cidade;
import com.algaworks.brewer.api.repository.filter.CidadeFilter;
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

public class CidadesImpl implements CidadesQueries {

    @Autowired
    private PaginacaoUtil<Cidade> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public Page<Cidade> filtrar(CidadeFilter cidadeFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Cidade> criteria = builder.createQuery(Cidade.class);
        Root<Cidade> root = criteria.from(Cidade.class);

        Predicate[] predicates = criarRestricoes(cidadeFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Cidade> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Cidade>(query.getResultList(), pageable, total(cidadeFilter));
    }

    private Long total(CidadeFilter cidadeFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Cidade> root = criteria.from(Cidade.class);

        Predicate[] predicates = criarRestricoes(cidadeFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

    private Predicate[] criarRestricoes(CidadeFilter cidadeFilter, CriteriaBuilder builder, Root<Cidade> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (cidadeFilter.getEstado() != null) {
            predicates.add(builder.equal(root.get("estado"), cidadeFilter.getEstado()));
        }

        if (!StringUtils.isEmpty(cidadeFilter.getNome())) {
            predicates.add(builder.like(builder.upper(root.get("nome")), "%" + cidadeFilter.getNome().toUpperCase() + "%"));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }

}
