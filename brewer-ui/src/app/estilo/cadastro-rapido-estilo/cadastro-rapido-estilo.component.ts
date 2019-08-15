import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {MessageService} from 'primeng/components/common/messageservice';

import {ErrorHandlerService} from '../../shared/error-handler.service';
import {EstiloService} from '../estilo.service';
import {Estilo} from "../../shared/model";

@Component({
    selector: 'app-cadastro-rapido-estilo',
    templateUrl: './cadastro-rapido-estilo.component.html',
    styleUrls: ['./cadastro-rapido-estilo.component.css']
})
export class CadastroRapidoEstiloComponent implements OnInit {

    @Input() showDialog = false;
    @Output() estiloSalvo = new EventEmitter();

    estilo = new Estilo();

    constructor(
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private estiloService: EstiloService
    ) { }

    ngOnInit() {
    }

    salvar(form: FormControl) {
        this.estiloService.salvar(this.estilo)
            .then(estiloAdicionado => {
                form.reset();
                this.estiloSalvo.emit({estilo: estiloAdicionado});
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
