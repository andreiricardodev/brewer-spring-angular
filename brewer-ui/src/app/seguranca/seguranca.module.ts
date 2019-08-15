import {Http, RequestOptions} from "@angular/http";
import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {ButtonModule, InputTextModule, MessagesModule} from "primeng/primeng";

import {AuthConfig, AuthHttp} from "angular2-jwt";

import {AuthGuard} from "./auth.guard";
import {LogoutService} from "./logout.service";
import {AuthService} from "./auth.service";
import {BrewerHttp} from "./brewer-http";
import {SegurancaRoutingModule} from "./seguranca-routing.module";
import {LoginFormComponent} from './login-form/login-form.component';

export function authHttpServiceFactory(auth: AuthService, http: Http, options: RequestOptions) {
    const config = new AuthConfig({
        globalHeaders: [
            { 'Content-Type': 'application/json' }
        ]
    });

    return new BrewerHttp(auth, config, http, options);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        InputTextModule,
        ButtonModule,
        MessagesModule,

        SegurancaRoutingModule
    ],
    declarations: [
        LoginFormComponent
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [AuthService, Http, RequestOptions]
        },
        AuthGuard,
        LogoutService
    ]
})
export class SegurancaModule {
}
