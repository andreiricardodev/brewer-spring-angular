import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService, DataTable, LazyLoadEvent} from "primeng/primeng";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {EstadoService} from "../../estado/estado.service";
import {CidadeService} from "../cidade.service";
import {CidadeFilter} from "../../shared/filter";
import {Cidade} from "../../shared/model";
import {AuthService} from "../../seguranca/auth.service";

@Component({
    selector: 'app-pesquisa-cidades',
    templateUrl: './pesquisa-cidades.component.html',
    styleUrls: ['./pesquisa-cidades.component.css']
})
export class PesquisaCidadesComponent implements OnInit {

    estados: any[] = [];
    cidades: Cidade[] = [];
    totalRegistros = 0;
    cidadeFilter = new CidadeFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estadoService: EstadoService,
        private cidadeService: CidadeService,
        private confirmationService: ConfirmationService,
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Cidades');

        this.carregarEstados();

        this.cidadeFilter.itensPorPagina = 5;
    }

    pesquisar(pagina: number = 0) {
        this.cidadeFilter.pagina = pagina;

        this.cidadeService.pesquisar(this.cidadeFilter)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.cidades = resultado.cidades;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.cidadeFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    removerCidade(cidade: Cidade, tabela: DataTable) {
        this.confirmationService.confirm({
            message: `Excluir "${cidade.nome}"? Você não poderá recuperar depois.`,
            accept: () => {
                this.cidadeService.remover(cidade.codigo)
                    .then(() => {
                        tabela.reset();
                        this.messageService.add({severity: 'success', detail: `Cidade "${cidade.nome}" excluída com sucesso!`});
                    })
                    .catch(erro => this.errorHandler.handle(erro));
            }
        });
    }

    private carregarEstados() {
        this.estadoService.listar()
            .then(estados => {
                this.estados.push({label: 'Todos os Estados', value: null});
                estados.forEach(estado => {
                    this.estados.push({label: estado.nome, value: estado});
                });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
