import {Injectable} from '@angular/core';
import {Headers, Http, ResponseContentType} from "@angular/http";

import {environment} from "../../environments/environment";
import {analyzeAndValidateNgModules} from "@angular/compiler";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class FotoService {

    fotoUrl: string;

    constructor(
        private http: Http,
        private sanitizer: DomSanitizer
    ) {
        this.fotoUrl = `${environment.apiUrl}/fotos`;
    }

    uploadFoto(foto: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', foto);

        return this.http.post(this.fotoUrl, formData, {headers: this.inicializarHeaders()})
            .toPromise()
            .then(response => response.json());
    }

    removerFoto(foto: string): Promise<any> {
        return this.http.delete(`${this.fotoUrl}?foto=${foto}`, {headers: this.inicializarHeaders()})
            .toPromise()
            .then(response => response);
    }

    private inicializarHeaders() {
        const headers: Headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
        headers.set('Accept', 'application/json');
        return headers;
    }

}
