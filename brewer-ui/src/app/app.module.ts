import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {ConfirmDialogModule} from "primeng/primeng";

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {LayoutModule} from "./layout/layout.module";
import {CervejaModule} from "./cerveja/cerveja.module";
import {CidadeModule} from "./cidade/cidade.module";
import {ClienteModule} from "./cliente/cliente.module";
import {EstiloModule} from "./estilo/estilo.module";
import {SegurancaModule} from "./seguranca/seguranca.module";
import {UsuarioModule} from "./usuario/usuario.module";
import {VendaModule} from "./venda/venda.module";
import {PaginaNaoEncontradaComponent} from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import {NaoAutorizadoComponent} from './nao-autorizado/nao-autorizado.component';
import {RelatorioModule} from "./relatorio/relatorio.module";

@NgModule({
    declarations: [
        AppComponent,
        PaginaNaoEncontradaComponent,
        NaoAutorizadoComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        ConfirmDialogModule,

        CervejaModule,
        CidadeModule,
        ClienteModule,
        DashboardModule,
        EstiloModule,
        LayoutModule,
        RelatorioModule,
        SegurancaModule,
        UsuarioModule,
        VendaModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
