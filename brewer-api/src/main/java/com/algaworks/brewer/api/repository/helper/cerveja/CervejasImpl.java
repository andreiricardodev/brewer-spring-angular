package com.algaworks.brewer.api.repository.helper.cerveja;

import com.algaworks.brewer.api.dto.ValorItensEstoque;
import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.repository.filter.CervejaFilter;
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

public class CervejasImpl implements CervejasQueries {

    @Autowired
    private PaginacaoUtil<Cerveja> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public ValorItensEstoque valorItensEstoque() {
        return manager.createQuery(
                "select new com.algaworks.brewer.api.dto.ValorItensEstoque(coalesce(sum(valor * quantidadeEstoque),0), coalesce(sum(quantidadeEstoque),0)) from Cerveja)",
                ValorItensEstoque.class
        ).getSingleResult();
    }

    @Override
    public List<Cerveja> porSkuOuNome(String skuOuNome) {
        List<Cerveja> cervejasFiltradas = manager.createQuery(
                "from Cerveja c where lower(c.sku) like lower(:skuOuNome) or lower(c.nome) like (:skuOuNome)", Cerveja.class)
                .setParameter("skuOuNome", skuOuNome+"%")
                .getResultList();
        return cervejasFiltradas;
    }

    @Override
    public Page<Cerveja> filtrar(CervejaFilter cervejaFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Cerveja> criteria = builder.createQuery(Cerveja.class);
        Root<Cerveja> root = criteria.from(Cerveja.class);
        root.fetch("estilo", JoinType.INNER);

        Predicate[] predicates = criarRestricoes(cervejaFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Cerveja> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Cerveja>(query.getResultList(), pageable, total(cervejaFilter));
    }

    private Predicate[] criarRestricoes(CervejaFilter cervejaFilter, CriteriaBuilder builder, Root<Cerveja> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(cervejaFilter.getSku())) {
            predicates.add(builder.equal(root.get("sku"), cervejaFilter.getSku()));
        }

        if (!StringUtils.isEmpty(cervejaFilter.getNome())) {
            predicates.add(builder.like(root.get("nome"), "%" + cervejaFilter.getNome().toUpperCase() + "%"));
        }

        if (isEstiloPresente(cervejaFilter)) {
            predicates.add(builder.equal(root.get("estilo"), cervejaFilter.getEstilo()));
        }

        if (cervejaFilter.getSabor() != null) {
            predicates.add(builder.equal(root.get("sabor"), cervejaFilter.getSabor()));
        }

        if (cervejaFilter.getOrigem() != null) {
            predicates.add(builder.equal(root.get("origem"), cervejaFilter.getOrigem()));
        }

        if (cervejaFilter.getValorDe() != null) {
            predicates.add(builder.ge(root.get("valor"), cervejaFilter.getValorDe()));
        }

        if (cervejaFilter.getValorAte() != null) {
            predicates.add(builder.le(root.get("valor"), cervejaFilter.getValorAte()));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }

    private boolean isEstiloPresente(CervejaFilter cervejaFilter) {
        return cervejaFilter.getEstilo() != null && cervejaFilter.getEstilo().getCodigo() != null;
    }

    private Long total(CervejaFilter cervejaFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Cerveja> root = criteria.from(Cerveja.class);

        Predicate[] predicates = criarRestricoes(cervejaFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

}
