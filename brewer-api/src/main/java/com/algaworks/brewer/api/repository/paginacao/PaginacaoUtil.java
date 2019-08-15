package com.algaworks.brewer.api.repository.paginacao;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.From;
import javax.persistence.criteria.Root;

@Component
public class PaginacaoUtil<T> {

    public TypedQuery<T> preparar(EntityManager manager, CriteriaQuery<T> criteria, CriteriaBuilder builder,
                                  Root<?> root, Pageable pageable) {
        From<?, ?> orderByFromEntity = null;

        Sort sort = pageable.getSort();
        if (sort != null) {
            orderByFromEntity = root;
            Sort.Order order = sort.iterator().next();
            String field = order.getProperty();

            if (order.getProperty().contains(".")) {
                criteria.orderBy(order.isAscending() ? builder.asc(orderByFromEntity.get(field.substring(0, order.getProperty().indexOf("."))).get(field.substring(order.getProperty().indexOf(".") + 1))) :
                        builder.desc(orderByFromEntity.get(field.substring(0, order.getProperty().indexOf("."))).get(field.substring(order.getProperty().indexOf(".") + 1))));
            } else {
                criteria.orderBy(order.isAscending() ? builder.asc(orderByFromEntity.get(field)) :
                        builder.desc(orderByFromEntity.get(field)));
            }
        }

        int paginaAtual = pageable.getPageNumber();
        int totalRegistroPorPagina = pageable.getPageSize();
        int primeiroRegistroDaPagina = paginaAtual * totalRegistroPorPagina;

        TypedQuery<T> query = manager.createQuery(criteria);
        query.setFirstResult(primeiroRegistroDaPagina);
        query.setMaxResults(totalRegistroPorPagina);

        return query;
    }

}
