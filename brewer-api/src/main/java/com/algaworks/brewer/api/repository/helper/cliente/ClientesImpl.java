package com.algaworks.brewer.api.repository.helper.cliente;

import com.algaworks.brewer.api.model.Cliente;
import com.algaworks.brewer.api.repository.filter.ClienteFilter;
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

public class ClientesImpl implements ClientesQueries {

    @Autowired
    private PaginacaoUtil<Cliente> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public Page<Cliente> filtrar(ClienteFilter clienteFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Cliente> criteria = builder.createQuery(Cliente.class);

        Root<Cliente> root = criteria.from(Cliente.class);
        root.fetch("endereco").fetch("cidade", JoinType.LEFT).fetch("estado", JoinType.LEFT);

        Predicate[] predicates = criarRestricoes(clienteFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Cliente> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Cliente>(query.getResultList(), pageable, total(clienteFilter));
    }

    private Long total(ClienteFilter clienteFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Cliente> root = criteria.from(Cliente.class);

        Predicate[] predicates = criarRestricoes(clienteFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

    private Predicate[] criarRestricoes(ClienteFilter clienteFilter, CriteriaBuilder builder, Root<Cliente> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(clienteFilter.getNome())) {
            predicates.add(builder.like(builder.upper(root.get("nome")), "%" + clienteFilter.getNome().toUpperCase() + "%"));
        }
        if (!StringUtils.isEmpty(clienteFilter.getCpfOuCnpj())) {
            predicates.add(builder.equal(root.get("cpfOuCnpj"), clienteFilter.getCpfOuCnpj()));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }

}
