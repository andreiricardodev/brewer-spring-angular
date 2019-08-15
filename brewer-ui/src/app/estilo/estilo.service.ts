import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {EstiloFilter} from "../shared/filter";
import {Estilo} from "../shared/model";

@Injectable()
export class EstiloService {

    estiloUrl: string;

    constructor(private http: AuthHttp) {
        this.estiloUrl = `${environment.apiUrl}/estilos`;
    }

    salvar(estilo: Estilo): Promise<Estilo> {
        return this.http.post(this.estiloUrl, JSON.stringify(estilo))
            .toPromise()
            .then(response => response.json() as Estilo);
    }

    atualizar(estilo: Estilo): Promise<Estilo> {
        return this.http.put(`${this.estiloUrl}/${estilo.codigo}`,
            JSON.stringify(estilo))
            .toPromise()
            .then(response => response.json() as Estilo);
    }

    remover(codigo: number): Promise<void> {
        return this.http.delete(`${this.estiloUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    buscarPeloCodigo(codigo: number): Promise<Estilo> {
        return this.http.get(`${this.estiloUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response.json() as Estilo;
            });
    }

    listar(): Promise<any> {
        return this.http.get(this.estiloUrl + '/listar')
            .toPromise()
            .then(response => response.json() as Estilo[]);
    }

    pesquisar(filtro: EstiloFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.estiloUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const estilos = responseJson.content as Estilo[];

                const resultado = {
                    estilos,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    private adicionarFiltro(filtro: EstiloFilter, params: URLSearchParams) {
        if (filtro.nome) {
            params.set('nome', filtro.nome);
        }
    }
}
