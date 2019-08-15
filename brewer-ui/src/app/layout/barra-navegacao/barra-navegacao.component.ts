import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../seguranca/auth.service";
import {LogoutService} from "../../seguranca/logout.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";

@Component({
    selector: 'app-barra-navegacao',
    templateUrl: './barra-navegacao.component.html',
    styleUrls: ['./barra-navegacao.component.css']
})
export class BarraNavegacaoComponent implements OnInit {

    constructor(
        public auth: AuthService,
        private logoutService: LogoutService,
        private errorHandler: ErrorHandlerService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    esconderMenu() {
        document.getElementsByClassName('js-sidebar').item(0).classList.toggle('is-toggled');
        document.getElementsByClassName('js-content').item(0).classList.toggle('is-toggled');
        document.getElementsByClassName('js-footer').item(0).classList.toggle('is-toggled');
    }

    logout() {
        this.logoutService.logout()
            .then(() => {
                this.router.navigate(['/login']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

}
