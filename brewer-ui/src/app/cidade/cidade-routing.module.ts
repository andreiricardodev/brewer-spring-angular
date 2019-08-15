import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroCidadeComponent} from "./cadastro-cidade/cadastro-cidade.component";
import {PesquisaCidadesComponent} from "./pesquisa-cidades/pesquisa-cidades.component";

const routes: Routes = [
    {
        path: 'cidades',
        component: PesquisaCidadesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cidades/nova',
        component: CadastroCidadeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_CIDADE'] }
    },
    {
        path: 'cidades/:codigo',
        component: CadastroCidadeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_CIDADE'] }
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CidadeRoutingModule {
}
