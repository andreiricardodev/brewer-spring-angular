import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

import {AuthService} from "../auth.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private errorHandler: ErrorHandlerService,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Brewer');
    }

    login(usuario: string, senha: string) {
        this.auth.login(usuario, senha)
            .then(() => {
                this.router.navigate(['/']);
            })
            .catch(erro => {
                this.errorHandler.handle(erro);
            });
    }

}
