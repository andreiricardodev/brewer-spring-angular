import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {DashboardService} from "./dashboard.service";
import {DashboardDTO} from "../shared/dto";
import {ErrorHandlerService} from "../shared/error-handler.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    dadosPorMes: any;
    dadosPorOrigem: any;

    dashboardDTO = new DashboardDTO;

    constructor(
        private title: Title,
        private dashboardoService: DashboardService,
        private errorHandler: ErrorHandlerService
    ) { }

    ngOnInit() {
        this.title.setTitle('Dashboard');

        this.carregarDashboard();
    }

    carregarDashboard() {
        this.dashboardoService.dashboard()
            .then(dashboardDTO => {
                this.dashboardDTO = dashboardDTO;
                this.inicializaGraficoVendasMes();
                this.inicializaGraficoVendaOrigem();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private inicializaGraficoVendasMes() {
        const meses: string[] = [];
        const totais: number[] = [];

        this.dashboardDTO.totalPorMes.forEach(vendaMes => {
            meses.push(vendaMes.mes);
            totais.push(vendaMes.total);
        });

        this.dadosPorMes  = {
            labels: meses,
            datasets: [
                {
                    label: 'Vendas por Mês',
                    data: totais,
                    fill: true,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff'
                }
            ]
        };
    }

    private inicializaGraficoVendaOrigem() {
        const meses: string[] = [];
        const totaisNacional: number[] = [];
        const totaisInternacional: number[] = [];

        this.dashboardDTO.totalPorOrigem.forEach(vendaOrigem => {
            meses.push(vendaOrigem.mes);
            totaisNacional.push(vendaOrigem.totalNacional);
            totaisInternacional.push(vendaOrigem.totalInternacional);
        });

        this.dadosPorOrigem  = {
            labels: meses,
            datasets: [
                {
                    label: 'Nacional',
                    data: totaisNacional,
                    backgroundColor: 'rgba(220,220,220,0.5)'
                },
                {
                    label: 'Internacional',
                    data: totaisInternacional,
                    backgroundColor: 'rgba(26,179,148,0.5)'
                }
            ]
        };
    }
}
