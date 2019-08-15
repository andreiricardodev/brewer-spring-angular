import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroClienteComponent} from "./cadastro-cliente/cadastro-cliente.component";
import {PesquisaClientesComponent} from "./pesquisa-clientes/pesquisa-clientes.component";

const routes: Routes = [
    {
        path: 'clientes',
        component: PesquisaClientesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'clientes/novo',
        component: CadastroClienteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'clientes/:codigo',
        component: CadastroClienteComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ClienteRoutingModule {
}
