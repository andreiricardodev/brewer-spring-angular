import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService, DataTable, LazyLoadEvent} from "primeng/primeng";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {ClienteService} from "../cliente.service";
import {ClienteFilter} from "../../shared/filter";
import {Cidade, Cliente} from "../../shared/model";

@Component({
    selector: 'app-pesquisa-clientes',
    templateUrl: './pesquisa-clientes.component.html',
    styleUrls: ['./pesquisa-clientes.component.css']
})
export class PesquisaClientesComponent implements OnInit {

    clientes: Cliente[] = [];
    totalRegistros = 0;
    clienteFilter = new ClienteFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private clienteService: ClienteService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Clientes');

        this.clienteFilter.itensPorPagina = 3;
    }

    pesquisar(pagina: number = 0) {
        this.clienteFilter.pagina = pagina;

        this.clienteService.pesquisar(this.clienteFilter)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.clientes = resultado.clientes;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.clienteFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    getDescricaoTipoPessoa(tipoPessoa: any): string {
        const tiposPessoa: any[] = this.clienteService.listarTiposPessoa();
        let retorno = '';

        tiposPessoa.forEach(tp => {
            if (tp.value === tipoPessoa) {
                retorno = tp.label;
            }
        });

        return retorno;
    }

    getNomeCidadeSiglaEstado(cidade: Cidade): string {
        if (cidade) {
            return cidade.nome + '/' + cidade.estado.sigla;
        }

        return '';
    }

    removerCliente(cliente: Cliente, tabela: DataTable) {
        this.confirmationService.confirm({
            message: `Excluir "${cliente.nome}"? Você não poderá recuperar depois.`,
            accept: () => {
                this.clienteService.remover(cliente.codigo)
                    .then(() => {
                        tabela.reset();
                        this.messageService.add({severity: 'success', detail: `Cliente "${cliente.nome}" excluído com sucesso!`});
                    })
                    .catch(erro => this.errorHandler.handle(erro));
            }
        });
    }

}
