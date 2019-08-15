package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.dto.PeriodoRelatorio;
import com.algaworks.brewer.api.exceptionhandler.BrewerExceptionHandler;
import com.algaworks.brewer.api.report.ExecutorRelatorio;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/relatorios")
public class RelatoriosController {

    @Autowired
    private EntityManager manager;

    @PostMapping("/vendasEmitidas")
    public ResponseEntity<?> emitir(@RequestBody  PeriodoRelatorio periodoRelatorio) {
        Map<String, Object> parametros = new HashMap<>();

        Date dataInicio = Date.from(LocalDateTime.of(periodoRelatorio.getDataInicio(), LocalTime.of(0, 0, 0))
            .atZone(ZoneId.systemDefault()).toInstant());
        Date dataFim = Date.from(LocalDateTime.of(periodoRelatorio.getDataFim(), LocalTime.of(23, 59, 59))
                .atZone(ZoneId.systemDefault()).toInstant());

        parametros.put("data_inicio", dataInicio);
        parametros.put("data_fim", dataFim);

        ExecutorRelatorio executor = new ExecutorRelatorio("/relatorios/relatorio_vendas_emitidas.jasper",
                 parametros);

        Session session = manager.unwrap(Session.class);
        session.doWork(executor);

        if (executor.isRelatorioGerado()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "VendasEmitidas.pdf";
            headers.setContentDispositionFormData(filename, filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            return new ResponseEntity<byte[]>(executor.getRelatorio(), headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @ExceptionHandler({ SQLException.class })
    public ResponseEntity<Object> handleSQLException(SQLException ex) {
        String mensagemUsuario = ex.getMessage();
        String mensagemDesenvolvedor = ex.toString();
        List<BrewerExceptionHandler.Erro> erros = Arrays.asList(new BrewerExceptionHandler.Erro(mensagemUsuario, mensagemDesenvolvedor));
        return ResponseEntity.badRequest().body(erros);
    }
}
