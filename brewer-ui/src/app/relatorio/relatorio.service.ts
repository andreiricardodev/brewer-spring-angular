import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment";
import {PeriodoRelatorio} from "../shared/dto";
import {ResponseContentType} from "@angular/http";

@Injectable()
export class RelatorioService {

    relatorioUrl: string;

    constructor(private http: AuthHttp) {
        this.relatorioUrl = `${environment.apiUrl}/relatorios`;
    }

    emitir(periodoRelatorio: PeriodoRelatorio): Promise<Blob> {
        return this.http.post(`${this.relatorioUrl}/vendasEmitidas`, JSON.stringify(periodoRelatorio), {responseType: ResponseContentType.Blob})
            .toPromise()
            .then(response => {
                return new Blob([response.blob()], {type: 'application/pdf'});
            });
    }

    recuperar(): Promise<any> {
        return this.http.get(`${this.relatorioUrl}/vendasEmitidas`, {responseType: ResponseContentType.Blob})
            .toPromise()
            .then(response => {
                return new Blob([response.blob()], {type: 'application/pdf'});
            });
    }
}
