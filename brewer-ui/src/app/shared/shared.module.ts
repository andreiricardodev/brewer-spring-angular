import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from "@angular/http";

import {
    ButtonModule, ConfirmationService, ConfirmDialogModule,
    DataTableModule,
    DropdownModule,
    InputTextModule,
    MessagesModule,
    TooltipModule
} from "primeng/primeng";
import {MessageService} from "primeng/components/common/messageservice";

import {PageHeaderComponent} from './page-header/page-header.component';
import {BoxComponent} from './box/box.component';
import {ErrorHandlerService} from "./error-handler.service";
import {AuthService} from "../seguranca/auth.service";
import {JwtHelper} from "angular2-jwt";
import {Title} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {EstiloService} from "../estilo/estilo.service";
import {MessageComponent} from './message/message.component';
import {CervejaService} from "../cerveja/cerveja.service";
import {CidadeService} from "../cidade/cidade.service";
import {ClienteService} from "../cliente/cliente.service";
import {UsuarioService} from "../usuario/usuario.service";
import {VendaService} from "../venda/venda.service";
import {FormsModule} from "@angular/forms";
import {EstadoService} from "../estado/estado.service";
import {TelefoneMaskDirective} from './telefone-mask.directive';
import {GrupoService} from "../grupo/grupo.service";
import {FotoService} from "../foto/foto.service";
import {RelatorioService} from "../relatorio/relatorio.service";
import {DashboardService} from "../dashboard/dashboard.service";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,

        InputTextModule,
        DropdownModule,
        ButtonModule,
        MessagesModule,
        DataTableModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    exports: [
        CommonModule,
        FormsModule,

        InputTextModule,
        DropdownModule,
        ButtonModule,
        MessagesModule,
        DataTableModule,
        TooltipModule,
        ConfirmDialogModule,

        PageHeaderComponent,
        BoxComponent,
        MessageComponent,
        TelefoneMaskDirective
    ],
    declarations: [
        PageHeaderComponent,
        BoxComponent,
        MessageComponent,
        TelefoneMaskDirective
    ],
    providers: [
        ErrorHandlerService,
        AuthService,

        CervejaService,
        CidadeService,
        ClienteService,
        DashboardService,
        EstadoService,
        EstiloService,
        FotoService,
        GrupoService,
        RelatorioService,
        UsuarioService,
        VendaService,

        MessageService,
        ConfirmationService,
        JwtHelper,
        Title,
        {provide: LOCALE_ID, useValue: 'pt-BR'}
    ]
})
export class SharedModule {
}
