import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroVendaComponent} from "./cadastro-venda/cadastro-venda.component";
import {PesquisaVendasComponent} from "./pesquisa-vendas/pesquisa-vendas.component";

const routes: Routes = [
    {
        path: 'vendas',
        component: PesquisaVendasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vendas/nova',
        component: CadastroVendaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vendas/:codigo',
        component: CadastroVendaComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class VendaRoutingModule {
}
