import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroCervejaComponent} from "./cadastro-cerveja/cadastro-cerveja.component";
import {PesquisaCervejasComponent} from "./pesquisa-cervejas/pesquisa-cervejas.component";

const routes: Routes = [
    {
        path: 'cervejas',
        component: PesquisaCervejasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cervejas/nova',
        component: CadastroCervejaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cervejas/:codigo',
        component: CadastroCervejaComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CervejaRoutingModule {
}
