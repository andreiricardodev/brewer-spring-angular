package com.algaworks.brewer.api.storage;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FotoStorage {

    public final String THUMBNAIL_PREFIX = "thumbnail.";

    public static final String URL = "http://localhost:9444/s3/brewer_angular/";

    public String salvar(MultipartFile file);

    public byte[] recuperar(String nome);

    public byte[] recuperarThumbnail(String nome);

    public void excluir(String foto);

    public String getUrl(String foto);

    default String renomearArquivo(String nomeOriginal) {
        return  UUID.randomUUID().toString() + "_" + nomeOriginal;
    }

}
