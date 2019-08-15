import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    esconderMenu: boolean;

    constructor(
        private router: Router
    ) { }

    onEsconderMenu(evento) {
        this.esconderMenu = evento.esconderMenu;
    }

    exibeBarraNavegacaoEMenuLateral() {
        return !(this.router.url === '/login' || this.router.url === '/nao-autorizado' ||
            this.router.url === '/pagina-nao-encontrada');
    }

    loadClassLayoutPage() {
        return {
            'layout-page': this.exibeBarraNavegacaoEMenuLateral()
        };
    }

    loadClassLayoutContent() {
        return {
            'layout-content js-content': this.exibeBarraNavegacaoEMenuLateral()
        };
    }

}
