import {NgModule} from '@angular/core';

import {DialogModule} from "primeng/primeng";

import {CadastroEstiloComponent} from './cadastro-estilo/cadastro-estilo.component';
import {EstiloRoutingModule} from "./estilo-routing.module";
import {SharedModule} from "../shared/shared.module";
import {PesquisaEstilosComponent} from './pesquisa-estilos/pesquisa-estilos.component';
import {CadastroRapidoEstiloComponent} from './cadastro-rapido-estilo/cadastro-rapido-estilo.component';

@NgModule({
    imports: [
        SharedModule,

        DialogModule,

        EstiloRoutingModule
    ],
    declarations: [
        CadastroEstiloComponent,
        PesquisaEstilosComponent,
        CadastroRapidoEstiloComponent
    ],
    exports: [
        CadastroRapidoEstiloComponent
    ]
})
export class EstiloModule {
}
