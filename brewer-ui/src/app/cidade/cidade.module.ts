import {NgModule} from '@angular/core';

import {CadastroCidadeComponent} from './cadastro-cidade/cadastro-cidade.component';
import {PesquisaCidadesComponent} from './pesquisa-cidades/pesquisa-cidades.component';
import {SharedModule} from "../shared/shared.module";
import {CidadeRoutingModule} from "./cidade-routing.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SharedModule,

        CidadeRoutingModule
    ],
    declarations: [
        CadastroCidadeComponent,
        PesquisaCidadesComponent
    ]
})
export class CidadeModule {
}
