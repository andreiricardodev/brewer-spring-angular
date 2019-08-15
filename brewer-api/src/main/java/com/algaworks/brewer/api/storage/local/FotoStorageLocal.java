package com.algaworks.brewer.api.storage.local;

import com.algaworks.brewer.api.storage.FotoStorage;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.file.FileSystems.getDefault;

@Profile("storage-local")
@Component
public class FotoStorageLocal implements FotoStorage {

    private static final Logger logger = LoggerFactory.getLogger(FotoStorageLocal.class);

    private Path local;

    public FotoStorageLocal() {
        this(getDefault().getPath(System.getenv("USERPROFILE"), "brewer_angular_fotos"));
    }

    public FotoStorageLocal(Path local) {
        this.local = local;
        criarPastas();
    }

    @Override
    public String salvar(MultipartFile file) {
        String novoNome = null;
        if (file != null) {
            MultipartFile arquivo = file;
            novoNome              = renomearArquivo(arquivo.getOriginalFilename());
            try {
                arquivo.transferTo(new File(this.local.toAbsolutePath().toString() + getDefault().getSeparator() + novoNome));
            } catch (IOException e) {
                throw new RuntimeException("Erro salvando a foto na pasta", e);
            }

            try {
                Thumbnails.of(this.local.resolve(novoNome).toString()).size(40, 68).toFiles(Rename.PREFIX_DOT_THUMBNAIL);
            } catch (IOException e) {
                throw new RuntimeException("Erro gerando thumbnail", e);
            }
        }

        return novoNome;
    }

    @Override
    public byte[] recuperar(String nome) {
        try {
            return Files.readAllBytes(this.local.resolve(nome));
        } catch (IOException e) {
            throw new RuntimeException("Erro recuperando a foto", e);
        }
    }

    @Override
    public byte[] recuperarThumbnail(String nome) {
        return recuperar(THUMBNAIL_PREFIX+nome);
    }

    @Override
    public void excluir(String foto) {
        try {
            Files.deleteIfExists(this.local.resolve(foto));
            Files.deleteIfExists(this.local.resolve(THUMBNAIL_PREFIX+foto));
        } catch (IOException e) {
            logger.warn(String.format("Erro apagando foto '%s'. Mensagem '%s'.", foto, e.getMessage()));
        }
    }

    @Override
    public String getUrl(String foto) {
        return "http://localhost:8080/fotos/" + foto;
    }

    private void criarPastas() {
        try {
            Files.createDirectories(this.local);

            if (logger.isDebugEnabled()) {
                logger.debug("Pastas criadas para salvar fotos.");
                logger.debug("Pasta default: " + this.local.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro criando pasta para salvar foto", e);
        }
    }
}
