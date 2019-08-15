package com.algaworks.brewer.api.repository.listener;

import com.algaworks.brewer.api.model.Cerveja;
import com.algaworks.brewer.api.storage.FotoStorage;
import org.springframework.util.StringUtils;

import javax.persistence.PostLoad;

public class CervejaEntityListener {

    @PostLoad
    public void postLoad(final Cerveja cerveja) {
        cerveja.setUrlFoto(FotoStorage.URL + getFotoOuMock(cerveja) + "?noAuth=true");
        cerveja.setUrlThumbnailFoto(FotoStorage.URL + FotoStorage.THUMBNAIL_PREFIX + getFotoOuMock(cerveja) + "?noAuth=true");
    }

    private String getFotoOuMock(Cerveja cerveja) {
        return !StringUtils.isEmpty(cerveja.getFoto()) ? cerveja.getFoto() : "cerveja-mock.png";
    }

}
