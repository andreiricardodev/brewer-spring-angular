import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {Estado} from "../shared/model";

@Injectable()
export class EstadoService {

    estadoUrl: string;

    constructor(private http: AuthHttp) {
        this.estadoUrl = `${environment.apiUrl}/estados`;
    }

    listar(): Promise<any> {
        return this.http.get(this.estadoUrl)
            .toPromise()
            .then(response => response.json() as Estado[]);
    }

}
