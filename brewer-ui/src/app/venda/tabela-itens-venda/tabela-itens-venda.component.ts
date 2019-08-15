import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {CervejaService} from "../../cerveja/cerveja.service";
import {Cerveja, ItemVenda} from "../../shared/model";

@Component({
    selector: 'app-tabela-itens-venda',
    templateUrl: './tabela-itens-venda.component.html',
    styleUrls: ['./tabela-itens-venda.component.css']
})
export class TabelaItensVendaComponent implements OnInit {

    @Input() itens: ItemVenda[] = [];
    @Output() atualizouQuantidade = new EventEmitter();

    constructor(
        private cervejaService: CervejaService
    ) {
    }

    ngOnInit() {
    }

    getDescricaoOrigem(origem: string): string {
        let retorno = '';
        const origens = this.cervejaService.listarOrigens();

        origens.forEach(o => {
            if (o.value === origem) {
                retorno = o.label;
            }
        });

        return retorno;
    }

    atualizaValorTotal(cerveja: Cerveja, quantidade: number) {
        this.itens.forEach(item => {
            if (item.cerveja === cerveja) {
                item.quantidade = quantidade;
                item.valorTotal = cerveja.valor * quantidade;
            }
        });
        this.atualizouQuantidade.emit(true);
    }

}
