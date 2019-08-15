import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService, DataTable, LazyLoadEvent} from "primeng/primeng";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {EstiloService} from "../estilo.service";
import {Estilo} from "../../shared/model";
import {EstiloFilter} from "../../shared/filter";

@Component({
    selector: 'app-pesquisa-estilos',
    templateUrl: './pesquisa-estilos.component.html',
    styleUrls: ['./pesquisa-estilos.component.css']
})
export class PesquisaEstilosComponent implements OnInit {

    estilos: Estilo[] = [];
    totalRegistros = 0;
    estiloFilter = new EstiloFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estiloService: EstiloService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Estilos');

        this.estiloFilter.itensPorPagina = 2;
    }

    pesquisar(pagina: number = 0) {
        this.estiloFilter.pagina = pagina;

        this.estiloService.pesquisar(this.estiloFilter)
            .then(resultado => {
                 this.totalRegistros = resultado.total;
                 this.estilos = resultado.estilos;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.estiloFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    removerEstilo(estilo: Estilo, tabela: DataTable) {
        this.confirmationService.confirm({
            message: `Excluir "${estilo.nome}"? Você não poderá recuperar depois.`,
            accept: () => {
                this.estiloService.remover(estilo.codigo)
                    .then(() => {
                        tabela.reset();
                        this.messageService.add({severity: 'success', detail: `Estilo "${estilo.nome}" excluído com sucesso!`});
                    })
                    .catch(erro => this.errorHandler.handle(erro));
            }
        });
    }
}
