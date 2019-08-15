import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {MessageService} from "primeng/components/common/messageservice";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {ClienteService} from "../cliente.service";
import {ClienteFilter} from "../../shared/filter";
import {Cliente} from "../../shared/model";

@Component({
    selector: 'app-pesquisa-rapida-cliente',
    templateUrl: './pesquisa-rapida-cliente.component.html',
    styleUrls: ['./pesquisa-rapida-cliente.component.css']
})
export class PesquisaRapidaClienteComponent implements OnInit {

    @Input() showDialog = false;
    @Output() clienteSelecionado = new EventEmitter();

    clientesFiltrados: Cliente[];
    clienteFilter = new ClienteFilter();

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private clienteService: ClienteService
    ) { }

    ngOnInit() {
    }

    pesquisar() {
        this.clienteService.pesquisarPorNome(this.clienteFilter.nome)
            .then(resultado => {
                this.clientesFiltrados = resultado;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    onClienteSelecionado(form: FormControl, cliente: Cliente) {
        form.reset();
        this.clientesFiltrados = [];
        this.clienteSelecionado.emit({cliente: cliente});
    }
}
