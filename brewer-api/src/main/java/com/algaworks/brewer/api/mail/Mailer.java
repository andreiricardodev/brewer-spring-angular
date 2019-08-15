package com.algaworks.brewer.api.mail;

import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.model.ItemVenda;
import com.algaworks.brewer.api.model.Venda;
import com.algaworks.brewer.api.storage.FotoStorage;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.generic.NumberTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class Mailer {

    private static Logger logger = LoggerFactory.getLogger(Mailer.class);

    @Value("${spring.mail.from}")
    private String mailFrom;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private FotoStorage fotoStorage;

    @Async
    public void enviar(Venda venda) {
        VelocityEngine engine = new VelocityEngine();
        engine.setProperty("resource.loader", "class");
        engine.setProperty("class.resource.loader.class","org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        engine.init();

        VelocityContext context = new VelocityContext();
        Template template = engine.getTemplate("/templates/mail/ResumoVenda.vm", "UTF-8");

        context.put("venda", venda);
        context.put("logo", "logo");
        context.put("numberTool", new NumberTool());
        context.put("locale", new Locale("pt", "BR"));

        Map<String, String> fotos = new HashMap<>();
        boolean adicionarMockCerveja = false;
        for (ItemVenda itemVenda : venda.getItens()) {
            Cerveja cerveja = itemVenda.getCerveja();
            if (!StringUtils.isEmpty(cerveja.getFoto())) {
                String cid = "foto-" + cerveja.getCodigo();
                context.put(cid, cid);

                fotos.put(cid, cerveja.getFoto()+"|"+cerveja.getContentType());
            } else {
                adicionarMockCerveja = true;
                context.put("cervejaMock", "cervejaMock");
            }
        }

        StringWriter writer = new StringWriter();
        template.merge(context, writer);

        try {
            String email = writer.toString();
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(venda.getCliente().getEmail());
            helper.setSubject(String.format("Brewer - Venda nº %d", venda.getCodigo()));
            helper.setText(email, true);

            helper.addInline("logo", new ClassPathResource("static/images/logo-gray.png"));

            if (adicionarMockCerveja) {
                helper.addInline("cervejaMock", new ClassPathResource("static/images/thumbnail.cerveja-mock.png"));
            }

            for (String cid : fotos.keySet()) {
                String[] fotoContentType = fotos.get(cid).split("\\|");
                String foto = fotoContentType[0];
                String contentType = fotoContentType[1];
                byte[] arrayFoto = fotoStorage.recuperarThumbnail(foto);
                helper.addInline(cid, new  ByteArrayResource(arrayFoto), contentType);
            }

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Erro enviando e-mail", e);
        }
    }

}
