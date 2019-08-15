package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.dto.FotoDTO;
import com.algaworks.brewer.api.storage.FotoStorage;
import com.algaworks.brewer.api.storage.FotoStorageRunnable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/fotos")
public class FotosController {

    @Autowired
    private FotoStorage fotoStorage;

    @PostMapping
    public DeferredResult<FotoDTO> upload(@RequestParam("file") MultipartFile files) {
        DeferredResult<FotoDTO> resultado = new DeferredResult<>();

        Thread thread                     = new Thread(new FotoStorageRunnable(files, resultado, fotoStorage));
        thread.start();

        return resultado;
    }

    @DeleteMapping
    public void delete(@RequestParam("foto") String foto) {
        fotoStorage.excluir(foto);
    }
}
