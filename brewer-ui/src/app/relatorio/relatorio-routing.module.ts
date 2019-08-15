import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {RelatorioVendasEmitidasComponent} from "./relatorio-vendas-emitidas/relatorio-vendas-emitidas.component";

const routes: Routes = [
    {
        path: 'relatorios/vendasEmitidas',
        component: RelatorioVendasEmitidasComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RelatorioRoutingModule {
}
