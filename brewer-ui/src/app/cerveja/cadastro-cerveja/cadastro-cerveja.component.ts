import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {FormControl} from "@angular/forms";

import {MessageService} from "primeng/components/common/messageservice";

import {EstiloService} from "../../estilo/estilo.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";
import {CervejaService} from "../cerveja.service";
import {FotoService} from "../../foto/foto.service";
import {Cerveja} from "../../shared/model";

@Component({
    selector: 'app-cadastro-cerveja',
    templateUrl: './cadastro-cerveja.component.html',
    styleUrls: ['./cadastro-cerveja.component.css']
})
export class CadastroCervejaComponent implements OnInit {

    sabores: any[];
    origens: any[];
    estilos: any[];
    cerveja = new Cerveja();
    showDialog = false;

    tituloPagina: string;

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estiloService: EstiloService,
        private fotoService: FotoService,
        private cervejaService: CervejaService
    ) { }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Cerveja');
        this.atualizarTituloPagina();

        this.carregarSabores();
        this.carregarOrigens();
        this.carregarEstilos();

        if (codigo) {
            this.buscarCerveja(codigo);
        }
    }

    carregarSabores() {
        this.sabores = this.cervejaService.listarSabores();
    }

    carregarOrigens() {
        this.origens = this.cervejaService.listarOrigens();
    }

    carregarEstilos() {
        this.estiloService.listar()
             .then(estilos => {
                 this.estilos = estilos
                     .map(estilo => ({label: estilo.nome, value: estilo}));
          }).catch(erro => this.errorHandler.handle(erro));
    }

    salvar(form: FormControl) {
        if (!this.editando()) {
            this.salvarCerveja(form);
        } else {
            this.atualizarCerveja(form);
        }
    }

    uploadFoto(event) {
        this.fotoService.uploadFoto(event.files[0])
            .then(fotoEnviada => {
                this.cerveja.foto = fotoEnviada.nome;
                this.cerveja.contentType = fotoEnviada.contentType;
                this.cerveja.urlFoto = fotoEnviada.url;
          }).catch(erro => this.errorHandler.handle(erro));
    }

    removerFoto() {
        this.fotoService.removerFoto(this.cerveja.foto)
            .then(fotoRemovida => {
                this.cerveja.foto = null;
                this.cerveja.contentType = null;
                this.cerveja.urlFoto = null;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    onShowDialog() {
        this.showDialog = true;
    }

    onEstiloCadastrado(event) {
        this.showDialog = false;
        this.carregarEstilos();
        this.cerveja.estilo = event.estilo;
    }

    private editando(): boolean {
        return Boolean(this.cerveja.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Cerveja';
        } else {
            this.tituloPagina = `Edição da Cerveja - ${this.cerveja.nome}`;
        }
    }

    private buscarCerveja(codigo: number) {
        this.cervejaService.buscarPeloCodigo(codigo)
            .then(cerveja => {
                this.cerveja = cerveja;
                this.atualizarTituloPagina();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private salvarCerveja(form: FormControl) {
        this.cervejaService.salvar(this.cerveja)
            .then(cervejaAdicionada => {
                form.reset();
                this.messageService.add({severity: 'success', detail: 'Cerveja salva com sucesso!'});
                this.router.navigate(['/cervejas/nova']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private atualizarCerveja(form: FormControl) {
        this.cervejaService.atualizar(this.cerveja)
            .then(cerveja => {
                this.cerveja = cerveja;
                this.atualizarTituloPagina();
                this.messageService.add({severity: 'success', detail: 'Cerveja atualizada com sucesso!'});
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
