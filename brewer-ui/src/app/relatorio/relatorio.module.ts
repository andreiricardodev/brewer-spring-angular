import {NgModule} from '@angular/core';

import {CalendarModule} from "primeng/primeng";

import {RelatorioVendasEmitidasComponent} from './relatorio-vendas-emitidas/relatorio-vendas-emitidas.component';
import {RelatorioRoutingModule} from "./relatorio-routing.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        SharedModule,

        CalendarModule,

        RelatorioRoutingModule
    ],
    declarations: [RelatorioVendasEmitidasComponent]
})
export class RelatorioModule {
}
