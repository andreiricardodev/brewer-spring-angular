package com.algaworks.brewer.api.repository.helper.venda;

import com.algaworks.brewer.api.dto.VendaMes;
import com.algaworks.brewer.api.dto.VendaOrigem;
import com.algaworks.brewer.api.model.StatusVenda;
import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.repository.filter.VendaFilter;
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
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.MonthDay;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class VendasImpl implements VendasQueries {

    @Autowired
    private PaginacaoUtil<Venda> paginacaoUtil;

    @PersistenceContext
    private EntityManager manager;

    @Override
    public BigDecimal valorTotalNoAno() {
        Optional<BigDecimal> optional = Optional.ofNullable(
                manager.createQuery("select sum(valorTotal) from Venda where year(dataCriacao) = :ano and status = :status", BigDecimal.class)
                    .setParameter("ano", Year.now().getValue())
                    .setParameter("status", StatusVenda.EMITIDA)
                    .getSingleResult());
        return optional.orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal valorTotalNoMes() {
        Optional<BigDecimal> optional = Optional.ofNullable(
                manager.createQuery("select sum(valorTotal) from Venda where month(dataCriacao) = :mes and status = :status", BigDecimal.class)
                        .setParameter("mes", MonthDay.now().getMonth().getValue())
                        .setParameter("status", StatusVenda.EMITIDA)
                        .getSingleResult());
        return optional.orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal valorTicketMedioNoAno() {
        Optional<BigDecimal> optional = Optional.ofNullable(
                manager.createQuery("select sum(valorTotal)/count(*) from Venda where year(dataCriacao) = :ano and status = :status", BigDecimal.class)
                        .setParameter("ano", Year.now().getValue())
                        .setParameter("status", StatusVenda.EMITIDA)
                        .getSingleResult());
        return optional.orElse(BigDecimal.ZERO);
    }

    @Override
    public List<VendaMes> totalPorMes() {
        @SuppressWarnings("unchecked")
        List<Object[]> results = manager.createNativeQuery(VendaMes.SQL).getResultList();

        List<VendaMes> vendasMes = new ArrayList<>();
        results.stream().forEach(r -> vendasMes.add(new VendaMes((String) r[0], ((BigInteger) r[1]).intValue())));

        LocalDate hoje = LocalDate.now();
        for (int i = 1; i <= 6; i++) {
            String mesIdeal = String.format("%d/%02d", hoje.getYear(), hoje.getMonth().getValue());

            boolean possuiMes = vendasMes.stream().filter(v -> v.getMes().equals(mesIdeal)).findAny().isPresent();
            if (!possuiMes) {
                vendasMes.add(i - 1, new VendaMes(mesIdeal, 0));
            }

            hoje = hoje.minusMonths(1);
        }

        return vendasMes;
    }

    @Override
    public List<VendaOrigem> totalPorOrigem() {
        @SuppressWarnings("unchecked")
        List<Object[]> results = manager.createNativeQuery(VendaOrigem.SQL).getResultList();

        List<VendaOrigem> vendasOrigem = new ArrayList<>();
        results.stream().forEach(r -> vendasOrigem.add(new VendaOrigem((String) r[0], Integer.valueOf((String) r[1]) , Integer.valueOf((String) r[2]))));

        LocalDate hoje = LocalDate.now();
        for (int i = 1; i <= 6; i++) {
            String mesIdeal = String.format("%d/%02d", hoje.getYear(), hoje.getMonth().getValue());

            boolean possuiMes = vendasOrigem.stream().filter(v -> v.getMes().equals(mesIdeal)).findAny().isPresent();
            if (!possuiMes) {
                vendasOrigem.add(i - 1, new VendaOrigem(mesIdeal, 0, 0));
            }

            hoje = hoje.minusMonths(1);
        }

        return vendasOrigem;
    }

    @Override
    public Page<Venda> filtrar(VendaFilter vendaFilter, Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Venda> criteria = builder.createQuery(Venda.class);

        Root<Venda> root = criteria.from(Venda.class);

        Predicate[] predicates = criarRestricoes(vendaFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Venda> query = paginacaoUtil.preparar(manager, criteria, builder, root, pageable);

        return new PageImpl<Venda>(query.getResultList(), pageable, total(vendaFilter));
    }

    private long total(VendaFilter vendaFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Venda> root = criteria.from(Venda.class);

        Predicate[] predicates = criarRestricoes(vendaFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

    private Predicate[] criarRestricoes(VendaFilter vendaFilter, CriteriaBuilder builder, Root<Venda> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (vendaFilter.getCodigo() != null) {
            predicates.add(builder.equal(root.get("codigo"), vendaFilter.getCodigo()));
        }
        if (vendaFilter.getStatus() != null) {
            predicates.add(builder.equal(root.get("status"), vendaFilter.getStatus()));
        }
        if (vendaFilter.getDataInicial() != null && vendaFilter.getDataFinal() != null) {
            predicates.add(builder.between(root.get("dataCriacao"),
                    vendaFilter.getDataInicial(),
                    vendaFilter.getDataFinal()));
        }
        if (vendaFilter.getValorInicial() != null) {
            predicates.add(builder.ge(root.get("valorTotal"), vendaFilter.getValorInicial()));
        }
        if (vendaFilter.getValorFinal() != null) {
            predicates.add(builder.le(root.get("valorTotal"), vendaFilter.getValorFinal()));
        }
        if (!StringUtils.isEmpty(vendaFilter.getNomeCliente())) {
            predicates.add(builder.like(root.get("cliente").get("nome"), "%" + vendaFilter.getNomeCliente() + "%"));
        }
        if (!StringUtils.isEmpty(vendaFilter.getCpfOuCnpjCliente())) {
            predicates.add(builder.equal(root.get("cliente").get("cpfOuCnpj"), vendaFilter.getCpfOuCnpjCliente()));
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }
}
