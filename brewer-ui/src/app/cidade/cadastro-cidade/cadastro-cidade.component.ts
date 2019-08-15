import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {FormControl, Validators} from "@angular/forms";

import {MessageService} from "primeng/components/common/messageservice";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {CidadeService} from "../cidade.service";
import {EstadoService} from "../../estado/estado.service";
import {Cidade} from "../../shared/model";

@Component({
    selector: 'app-cadastro-cidade',
    templateUrl: './cadastro-cidade.component.html',
    styleUrls: ['./cadastro-cidade.component.css']
})
export class CadastroCidadeComponent implements OnInit {

    cidade = new Cidade();
    estados: any[];

    tituloPagina: string;

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private cidadeService: CidadeService,
        private estadoService: EstadoService
    ) { }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Cidade');
        this.atualizarTituloPagina();

        this.carregarEstados();

        if (codigo) {
            this.buscarCidade(codigo);
        }
    }

    salvar(form: FormControl) {
        if (!this.editando()) {
            this.salvarCidade(form);
        } else {
            this.atualizarCidade(form);
        }
    }

    private editando(): boolean {
        return Boolean(this.cidade.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Cidade';
        } else {
            this.tituloPagina = `Edição da Cidade - ${this.cidade.nome}`;
        }
    }

    private buscarCidade(codigo: number) {
        this.cidadeService.buscarPeloCodigo(codigo)
            .then(cidade => {
                this.cidade = cidade;
                this.atualizarTituloPagina();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private salvarCidade(form: FormControl) {
        this.cidadeService.salvar(this.cidade)
            .then(cidadeAdicionada => {
                form.reset();
                this.messageService.add({severity: 'success', detail: 'Cidade salva com sucesso!'});
                this.router.navigate(['/cidades/nova']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private atualizarCidade(form: FormControl) {
        this.cidadeService.atualizar(this.cidade)
            .then(cidade => {
                this.cidade = cidade;
                this.atualizarTituloPagina();
                this.messageService.add({severity: 'success', detail: 'Cidade atualizada com sucesso!'});
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private carregarEstados() {
        this.estadoService.listar()
            .then(estados => {
                this.estados = estados
                    .map(estado => ({label: estado.nome, value: estado}));
            }).catch(erro => this.errorHandler.handle(erro));
    }
}
