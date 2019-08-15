package com.algaworks.brewer.api.storage;

import com.algaworks.brewer.api.dto.FotoDTO;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.multipart.MultipartFile;

public class FotoStorageRunnable implements Runnable {

    private MultipartFile file;
    private DeferredResult<FotoDTO> resultado;
    private FotoStorage fotoStorage;

    public FotoStorageRunnable(MultipartFile file, DeferredResult<FotoDTO> resultado, FotoStorage fotoStorage) {
        this.file = file;
        this.resultado = resultado;
        this.fotoStorage = fotoStorage;
    }

    @Override
    public void run() {
        String nomeFoto    = this.fotoStorage.salvar(file);
        String contentType = file.getContentType();
        resultado.setResult(new FotoDTO(nomeFoto, contentType, fotoStorage.getUrl(nomeFoto)));
    }
}
