import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";

import {Venda} from "../../shared/model";
import {VendaFilter} from "../../shared/filter";
import {ErrorHandlerService} from "../../shared/error-handler.service";
import {VendaService} from "../venda.service";
import {LazyLoadEvent} from "primeng/primeng";
import {errorHandler} from "@angular/platform-browser/src/browser";

@Component({
    selector: 'app-pesquisa-vendas',
    templateUrl: './pesquisa-vendas.component.html',
    styleUrls: ['./pesquisa-vendas.component.css']
})
export class PesquisaVendasComponent implements OnInit {

    idiomaCalendario: any;
    todosEstatus: any[] = [];
    vendas: Venda[] = [];
    totalRegistros = 0;
    vendaFilter = new VendaFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private vendaService: VendaService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Vendas');

        this.carregarTodosStatus();
        this.inicializarIdiomaCalendario();

        this.vendaFilter.itensPorPagina = 10;
    }

    pesquisar(pagina: number = 0) {
        this.vendaFilter.pagina = pagina;

        this.vendaService.pesquisar(this.vendaFilter)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.vendas = resultado.vendas;
            })
            .catch(erro => this.errorHandler.handle(erro));

    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.vendaFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    getDescricaoStatus(status: string): string {
        let retorno = '';

        this.todosEstatus.forEach(s => {
            if (s.value === status) {
                retorno = s.label;
            }
        });

        return retorno;
    }

    private carregarTodosStatus() {
        this.todosEstatus.push({label: 'Todos os Status', value: null});
        this.vendaService.listarStatus().forEach(status => {
            this.todosEstatus.push(status);
        });
    }

    private inicializarIdiomaCalendario() {
        this.idiomaCalendario = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Limpar'
        };
    }
}
