package com.algaworks.brewer.api.controller;

import com.algaworks.brewer.api.model.Estado;
import com.algaworks.brewer.api.repository.Estados;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/estados")
public class EstadosController {

    @Autowired
    private Estados estados;

    @GetMapping
    public List<Estado> listar() {
        return estados.findAll();
    }

}
