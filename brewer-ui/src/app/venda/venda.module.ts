import {NgModule} from '@angular/core';

import {
    AutoCompleteModule,
    CalendarModule,
    InputTextareaModule,
    MessageModule,
    SplitButtonModule,
    TabViewModule
} from "primeng/primeng";
import {VendaRoutingModule} from "./venda-routing.module";
import {CurrencyMaskModule} from "ng2-currency-mask";

import {CadastroVendaComponent} from './cadastro-venda/cadastro-venda.component';
import {PesquisaVendasComponent} from './pesquisa-vendas/pesquisa-vendas.component';
import {SharedModule} from "../shared/shared.module";
import {TabelaItensVendaComponent} from './tabela-itens-venda/tabela-itens-venda.component';
import {ClienteModule} from "../cliente/cliente.module";

@NgModule({
    imports: [
        SharedModule,

        InputTextareaModule,
        CurrencyMaskModule,
        TabViewModule,
        SplitButtonModule,
        AutoCompleteModule,
        CalendarModule,
        MessageModule,

        ClienteModule,
        VendaRoutingModule
    ],
    declarations: [
        CadastroVendaComponent,
        PesquisaVendasComponent,
        TabelaItensVendaComponent
    ]
})
export class VendaModule {
}
