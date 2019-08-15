import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {FormControl, Validators} from "@angular/forms";

import {MessageService} from "primeng/components/common/messageservice";

import {EstiloService} from "../estilo.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";
import {Estilo} from "../../shared/model";

@Component({
    selector: 'app-cadastro-estilo',
    templateUrl: './cadastro-estilo.component.html',
    styleUrls: ['./cadastro-estilo.component.css']
})
export class CadastroEstiloComponent implements OnInit {

    estilo = new Estilo();

    tituloPagina: string;

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estiloService: EstiloService
    ) { }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Estilo');
        this.atualizarTituloPagina();

        if (codigo) {
            this.buscarEstilo(codigo);
        }
    }

    salvar(form: FormControl) {
        if (!this.editando()) {
            this.salvarEstilo(form);
        } else {
            this.atualizarEstilo(form);
        }
    }

    private editando(): boolean {
        return Boolean(this.estilo.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Estilo';
        } else {
            this.tituloPagina = `Edição do Estilo - ${this.estilo.nome}`;
        }
    }

    private buscarEstilo(codigo: number) {
        this.estiloService.buscarPeloCodigo(codigo)
            .then(estilo => {
                this.estilo = estilo;
                this.atualizarTituloPagina();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private salvarEstilo(form: FormControl) {
        this.estiloService.salvar(this.estilo)
            .then(estilo => {
                form.reset();
                this.messageService.add({severity: 'success', detail: 'Estilo salvo com sucesso!'});
                this.router.navigate(['/estilos/novo']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private atualizarEstilo(form: FormControl) {
        this.estiloService.atualizar(this.estilo)
            .then(estilo => {
                this.estilo = estilo;
                this.atualizarTituloPagina();
                this.messageService.add({severity: 'success', detail: 'Estilo atualizado com sucesso!'});
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
