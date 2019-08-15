import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {BarraNavegacaoComponent} from './barra-navegacao/barra-navegacao.component';
import {MenuLateralComponent} from './menu-lateral/menu-lateral.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        BarraNavegacaoComponent,
        MenuLateralComponent
    ],
    exports: [
        BarraNavegacaoComponent,
        MenuLateralComponent
    ]
})
export class LayoutModule {
}
