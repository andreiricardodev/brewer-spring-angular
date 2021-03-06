package com.algaworks.brewer.api.storage.s3;

import com.algaworks.brewer.api.storage.FotoStorage;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Profile("storage-s3")
@Component
public class FotoStorageS3 implements FotoStorage {

    private static final Logger logger = LoggerFactory.getLogger(FotoStorageS3.class);

    private static final String BUCKET = "brewer_angular";

    private static final String URL_S3 = "http://localhost:9444/s3/" + BUCKET + "/";

    @Autowired
    private AmazonS3 amazonS3;

    @Override
    public String salvar(MultipartFile file) {
        String novoNome = null;
        if (file != null) {
            MultipartFile arquivo = file;
            novoNome = renomearArquivo(arquivo.getOriginalFilename());

            try {
                AccessControlList acl = new AccessControlList();
                acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);

                enviarFoto(novoNome, arquivo, acl);
                enviarThumbnail(novoNome, arquivo, acl);
            } catch (IOException e) {
                throw new RuntimeException("Erro salvando arquivo no S3", e);
            }
        }

        return novoNome;
    }

    @Override
    public byte[] recuperar(String nome) {
        InputStream is = amazonS3.getObject(BUCKET, nome).getObjectContent();
        try {
            return IOUtils.toByteArray(is);
        } catch (IOException e) {
            logger.error("Não conseguiu recuerar foto do S3", e);
        }
        return null;
    }

    @Override
    public byte[] recuperarThumbnail(String nome) {
        return recuperar(FotoStorage.THUMBNAIL_PREFIX + nome);
    }

    @Override
    public void excluir(String foto) {
        amazonS3.deleteObject(BUCKET, THUMBNAIL_PREFIX + foto);
        amazonS3.deleteObject(BUCKET, foto);
    }

    @Override
    public String getUrl(String foto) {
        if (!StringUtils.isEmpty(foto)) {
            return  URL_S3 + foto + "?noAuth=true";
        }

        return null;
    }

    private ObjectMetadata enviarFoto(String novoNome, MultipartFile arquivo, AccessControlList acl) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(arquivo.getContentType());
        metadata.setContentLength(arquivo.getSize());
        amazonS3.putObject(new PutObjectRequest(BUCKET, novoNome, arquivo.getInputStream(), metadata)
                .withAccessControlList(acl));
        return metadata;
    }

    private void enviarThumbnail(String novoNome, MultipartFile arquivo, AccessControlList acl) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(arquivo.getInputStream()).size(40, 68).toOutputStream(os);
        byte[] array = os.toByteArray();
        InputStream is = new ByteArrayInputStream(array);
        ObjectMetadata thumbMetadata = new ObjectMetadata();
        thumbMetadata.setContentType(arquivo.getContentType());
        thumbMetadata.setContentLength(array.length);
        amazonS3.putObject(new PutObjectRequest(BUCKET, THUMBNAIL_PREFIX + novoNome, is, thumbMetadata)
                .withAccessControlList(acl));
    }
}
