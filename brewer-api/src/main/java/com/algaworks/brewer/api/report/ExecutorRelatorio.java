package com.algaworks.brewer.api.report;

import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.hibernate.jdbc.Work;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;
import java.util.Map;

public class ExecutorRelatorio implements Work {

    private String caminhoRelatorio;
    private Map<String, Object> parametros;
    private byte[] relatorio;

    private boolean relatorioGerado;

    public ExecutorRelatorio(String caminhoRelatorio, Map<String, Object> parametros) {
        this.caminhoRelatorio = caminhoRelatorio;
        this.parametros = parametros;

        this.parametros.put(JRParameter.REPORT_LOCALE, new Locale("pt", "BR"));
    }

    @Override
    public void execute(Connection connection) throws SQLException {
        try {
            InputStream relatorioStream = this.getClass().getResourceAsStream(caminhoRelatorio);

            JasperPrint print = JasperFillManager.fillReport(relatorioStream, parametros, connection);
            relatorioGerado = print.getPages().size() > 0;

            if (relatorioGerado) {
                relatorio = JasperExportManager.exportReportToPdf(print);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao executar relatório " + this.caminhoRelatorio, e);
        }
    }

    public boolean isRelatorioGerado() {
        return relatorioGerado;
    }

    public byte[] getRelatorio() {
        return relatorio;
    }
}
