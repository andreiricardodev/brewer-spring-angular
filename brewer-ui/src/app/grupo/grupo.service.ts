import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {Grupo} from "../shared/model";

@Injectable()
export class GrupoService {

    grupoUrl: string;

    constructor(private http: AuthHttp) {
        this.grupoUrl = `${environment.apiUrl}/grupos`;
    }

    listar(): Promise<any> {
        return this.http.get(this.grupoUrl)
            .toPromise()
            .then(response => response.json() as Grupo[]);
    }

}
