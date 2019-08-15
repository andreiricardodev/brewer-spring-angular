import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {PeriodoRelatorio} from "../../shared/dto";
import {RelatorioService} from "../relatorio.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";

@Component({
    selector: 'app-relatorio-vendas-emitidas',
    templateUrl: './relatorio-vendas-emitidas.component.html',
    styleUrls: ['./relatorio-vendas-emitidas.component.css']
})
export class RelatorioVendasEmitidasComponent implements OnInit {

    idiomaCalendario: any;
    periodoRelatorio = new PeriodoRelatorio();

    constructor(
        private title: Title,
        private relatorioService: RelatorioService,
        private errorHandler: ErrorHandlerService
    ) { }

    ngOnInit() {
        this.title.setTitle('Relatório - Vendas Emitidas');

        this.inicializarIdiomaCalendario();
    }

    emitir() {
        this.relatorioService.emitir(this.periodoRelatorio)
            .then(relatorio => {
                location.href = URL.createObjectURL(relatorio);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    recuperar() {
        this.relatorioService.recuperar()
            .then(relatorio => {
                const relatorioURL = URL.createObjectURL(relatorio);
                location.href = relatorioURL;
            })
            .catch(erro => this.errorHandler.handle(erro));
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
