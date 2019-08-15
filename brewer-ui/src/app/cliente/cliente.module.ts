import {NgModule} from '@angular/core';

import {DialogModule, InputMaskModule, RadioButtonModule} from "primeng/primeng";

import {CadastroClienteComponent} from './cadastro-cliente/cadastro-cliente.component';
import {PesquisaClientesComponent} from './pesquisa-clientes/pesquisa-clientes.component';
import {SharedModule} from "../shared/shared.module";
import {ClienteRoutingModule} from "./cliente-routing.module";
import {PesquisaRapidaClienteComponent} from './pesquisa-rapida-cliente/pesquisa-rapida-cliente.component';

@NgModule({
    imports: [
        SharedModule,

        RadioButtonModule,
        InputMaskModule,
        DialogModule,

        ClienteRoutingModule
    ],
    declarations: [
        CadastroClienteComponent,
        PesquisaClientesComponent,
        PesquisaRapidaClienteComponent
    ],
    exports: [
        PesquisaRapidaClienteComponent
    ]
})
export class ClienteModule {
}
