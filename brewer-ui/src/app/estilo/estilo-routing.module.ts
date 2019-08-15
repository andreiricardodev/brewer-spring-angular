import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroEstiloComponent} from "./cadastro-estilo/cadastro-estilo.component";
import {PesquisaEstilosComponent} from "./pesquisa-estilos/pesquisa-estilos.component";

const routes: Routes = [
    {
        path: 'estilos',
        component: PesquisaEstilosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'estilos/novo',
        component: CadastroEstiloComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'estilos/:codigo',
        component: CadastroEstiloComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class EstiloRoutingModule {
}
