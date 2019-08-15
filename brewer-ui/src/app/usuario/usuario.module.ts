import {NgModule} from '@angular/core';

import {CalendarModule, CheckboxModule, InputSwitchModule, MessageModule} from "primeng/primeng";

import {CadastroUsuarioComponent} from './cadastro-usuario/cadastro-usuario.component';
import {PesquisaUsuariosComponent} from './pesquisa-usuarios/pesquisa-usuarios.component';
import {SharedModule} from "../shared/shared.module";
import {UsuarioRoutingModule} from "./usuario-routing.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SharedModule,

        CalendarModule,
        InputSwitchModule,
        CheckboxModule,

        MessageModule,

        UsuarioRoutingModule
    ],
    declarations: [
        CadastroUsuarioComponent,
        PesquisaUsuariosComponent
    ]
})
export class UsuarioModule {
}
