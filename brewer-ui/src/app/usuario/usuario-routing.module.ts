import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../seguranca/auth.guard";
import {CadastroUsuarioComponent} from "./cadastro-usuario/cadastro-usuario.component";
import {PesquisaUsuariosComponent} from "./pesquisa-usuarios/pesquisa-usuarios.component";

const routes: Routes = [
    {
        path: 'usuarios',
        component: PesquisaUsuariosComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
    },
    {
        path: 'usuarios/novo',
        component: CadastroUsuarioComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
    },
    {
        path: 'usuarios/:codigo',
        component: CadastroUsuarioComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UsuarioRoutingModule {
}
