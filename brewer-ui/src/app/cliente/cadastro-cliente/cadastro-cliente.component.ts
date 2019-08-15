import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {FormBuilder, FormControl} from "@angular/forms";

import {MessageService} from "primeng/components/common/messageservice";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {EstadoService} from "../../estado/estado.service";
import {CidadeService} from "../../cidade/cidade.service";
import {ClienteService} from "../cliente.service";
import {Cliente, Estado} from "../../shared/model";

@Component({
    selector: 'app-cadastro-cliente',
    templateUrl: './cadastro-cliente.component.html',
    styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent implements OnInit {

    tiposPessoa: any[];

    documentoCpfOuCnpj: string;
    mascaraCpfOuCnpj: string;

    estados: any[];
    cidades: any[];
    cliente = new Cliente();

    tituloPagina: string;

    constructor(
        private title: Title,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private estadoService: EstadoService,
        private cidadeService: CidadeService,
        private clienteService: ClienteService
    ) {
        this.limpar();
    }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Cliente');
        this.atualizarTituloPagina();

        this.carregarEstados();
        this.carregarTiposPessoa();

        if (codigo) {
            this.buscarCliente(codigo);
        }
    }

    limpar() {
        this.documentoCpfOuCnpj = 'CPF/CNPJ';
        this.mascaraCpfOuCnpj = '';
    }

    salvar(form: FormControl) {
        if (!this.editando()) {
            this.salvarCliente(form);
        } else {
            this.atualizarCliente(form);
        }
    }

    onTipoPessoaAlterado(documento: string, mascara: string) {
        this.documentoCpfOuCnpj = documento;
        this.mascaraCpfOuCnpj = mascara;
    }

    onEstadoAlterado(estado: Estado) {
        if (estado) {
            this.cidadeService.pesquisarPorEstado(estado.codigo)
                .then(cidades => {
                    this.cidades = cidades
                        .map(cidade => ({label: cidade.nome, value: cidade}));
                }).catch(erro => this.errorHandler.handle(erro));
        }
    }

    private editando(): boolean {
        return Boolean(this.cliente.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Cliente';
        } else {
            this.tituloPagina = `Edição do Cliente - ${this.cliente.nome}`;
        }
    }

    private buscarCliente(codigo: number) {
        this.clienteService.buscarPeloCodigo(codigo)
            .then(cliente => {
                this.cliente = cliente;
                this.cliente.endereco.estado = cliente.endereco.cidade.estado;
                this.onEstadoAlterado(cliente.endereco.cidade.estado);
                this.atualizarTituloPagina();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private salvarCliente(form: FormControl) {
        this.clienteService.salvar(this.cliente)
            .then(clienteAdicionado => {
                form.reset();
                this.limpar();
                this.messageService.add({severity: 'success', detail: 'Cliente salvo com sucesso!'});
                this.router.navigate(['/clientes/novo']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private atualizarCliente(form: FormControl) {
        this.clienteService.atualizar(this.cliente)
            .then(cliente => {
                this.cliente = cliente;
                this.atualizarTituloPagina();
                this.messageService.add({severity: 'success', detail: 'Cliente atualizado com sucesso!'});
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

    private carregarTiposPessoa() {
        this.tiposPessoa = this.clienteService.listarTiposPessoa();
    }
}
