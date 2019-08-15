package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.model.Grupo;
import com.algaworks.brewer.api.repository.Grupos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/grupos")
public class GruposController {

    @Autowired
    private Grupos grupos;

    @GetMapping
    public List<Grupo> listar() {
        return grupos.findAll();
    }

}
