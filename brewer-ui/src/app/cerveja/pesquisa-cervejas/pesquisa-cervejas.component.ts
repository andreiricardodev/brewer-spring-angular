import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService, DataTable, LazyLoadEvent} from "primeng/primeng";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {EstiloService} from "../../estilo/estilo.service";
import {FotoService} from "../../foto/foto.service";
import {CervejaService} from "../cerveja.service";
import {Cerveja} from "../../shared/model";
import {CervejaFilter} from "../../shared/filter";

@Component({
    selector: 'app-pesquisa-cervejas',
    templateUrl: './pesquisa-cervejas.component.html',
    styleUrls: ['./pesquisa-cervejas.component.css']
})
export class PesquisaCervejasComponent implements OnInit {

    sabores: any[] = [];
    origens: any[] = [];
    estilos: any[] = [];
    cervejas: Cerveja[] = [];
    totalRegistros = 0;
    cervejaFilter = new CervejaFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estiloService: EstiloService,
        private fotoService: FotoService,
        private cervejaService: CervejaService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Cervejas');

        this.carregarSabores();
        this.carregarOrigens();
        this.carregarEstilos();

        this.cervejaFilter.itensPorPagina = 2;
    }

    carregarSabores() {
        this.sabores.push({label: 'Todos os Sabores', value: null});
        this.cervejaService.listarSabores().forEach(sabor => {
            this.sabores.push(sabor);
        });
    }

    carregarOrigens() {
        this.cervejaService.listarOrigens().forEach(origem => {
            this.origens.push(origem);
        });
        this.origens.push({label: 'Todas', value: null});
    }

    carregarEstilos() {
        this.estiloService.listar()
            .then(estilos => {
                this.estilos.push({label: 'Todos os Estilos', value: null});
                estilos.forEach(estilo => {
                    this.estilos.push({label: estilo.nome, value: estilo});
                });
            }).catch(erro => this.errorHandler.handle(erro));
    }

    pesquisar(pagina: number = 0) {
        this.cervejaFilter.pagina = pagina;

        this.cervejaService.pesquisar(this.cervejaFilter)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.cervejas = resultado.cervejas;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.cervejaFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    getDescricaoOrigem(origem: any): string {
        let retorno = '';

        this.origens.forEach(o => {
            if (o.value === origem) {
                retorno = o.label;
            }
        });

        return retorno;
    }

    removerCerveja(cerveja: Cerveja, tabela: DataTable) {
        this.confirmationService.confirm({
            message: `Excluir "${cerveja.nome}"? Você não poderá recuperar depois.`,
            accept: () => {
                this.cervejaService.remover(cerveja.codigo)
                    .then(() => {
                        tabela.reset();
                        this.messageService.add({severity: 'success', detail: `Cerveja "${cerveja.nome}" excluída com sucesso!`});
                    })
                    .catch(erro => this.errorHandler.handle(erro));
            }
        });
    }
}
