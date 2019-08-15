package com.algaworks.brewer.api.model;

import com.algaworks.brewer.api.model.validation.group.CnpjGroup;
import com.algaworks.brewer.api.model.validation.group.CpfGroup;

public enum TipoPessoa {

    FISICA("000.000.000-00", CpfGroup.class) {
        @Override
        public String formatar(String cpfOuCnpj) {
            return cpfOuCnpj.replaceAll("(\\d{3})(\\d{3})(\\d{3})", "$1.$2.$3-");
        }
    },
    JURIDICA("00.000.000/0000-00", CnpjGroup.class) {
        @Override
        public String formatar(String cpfOuCnpj) {
            return cpfOuCnpj.replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1.$2.$3/$4-");
        }
    };

    private Class<?> grupo;
    private String mascara;

    TipoPessoa(String mascara, Class<?> grupo) {
        this.mascara = mascara;
        this.grupo = grupo;
    }

    public String getMascara() {
        return mascara;
    }

    public Class<?> getGrupo() {
        return grupo;
    }

    public static String removerFormatacao(String cpfOuCnpj) {
        return cpfOuCnpj.replaceAll("\\.|-|/", "");
    }

    public abstract String formatar(String cpfOuCnpj);
}
