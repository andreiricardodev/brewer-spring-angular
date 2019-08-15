import {NgModule} from '@angular/core';

import {FileUploadModule, InputTextareaModule, RadioButtonModule} from "primeng/primeng";

import {CadastroCervejaComponent} from './cadastro-cerveja/cadastro-cerveja.component';
import {SharedModule} from "../shared/shared.module";
import {CervejaRoutingModule} from "./cerveja-routing.module";
import {PesquisaCervejasComponent} from './pesquisa-cervejas/pesquisa-cervejas.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {EstiloModule} from "../estilo/estilo.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SharedModule,

        InputTextareaModule,
        RadioButtonModule,
        CurrencyMaskModule,
        FileUploadModule,

        EstiloModule,
        CervejaRoutingModule
    ],
    declarations: [
        CadastroCervejaComponent,
        PesquisaCervejasComponent
    ]
})
export class CervejaModule {
}
