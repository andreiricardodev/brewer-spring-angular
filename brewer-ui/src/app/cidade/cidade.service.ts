import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {Cidade} from "../shared/model";
import {CidadeFilter} from "../shared/filter";

@Injectable()
export class CidadeService {

    cidadeUrl: string;

    constructor(private http: AuthHttp) {
        this.cidadeUrl = `${environment.apiUrl}/cidades`;
    }

    salvar(cidade: Cidade): Promise<Cidade> {
        return this.http.post(this.cidadeUrl, JSON.stringify(cidade))
            .toPromise()
            .then(response => response.json() as Cidade);
    }

    atualizar(cidade: Cidade): Promise<Cidade> {
        return this.http.put(`${this.cidadeUrl}/${cidade.codigo}`,
            JSON.stringify(cidade))
            .toPromise()
            .then(response => response.json() as Cidade);
    }

    remover(codigo: number): Promise<void> {
        return this.http.delete(`${this.cidadeUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    buscarPeloCodigo(codigo: number): Promise<Cidade> {
        return this.http.get(`${this.cidadeUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response.json() as Cidade;
            });
    }

    pesquisarPorEstado(codigoEstado: number): Promise<any> {
        return this.http.get(`${this.cidadeUrl}/porEstado/${codigoEstado}`)
            .toPromise()
            .then(response => response.json() as Cidade[]);
    }

    pesquisar(filtro: CidadeFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.cidadeUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const cidades = responseJson.content as Cidade[];

                const resultado = {
                    cidades,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    private adicionarFiltro(filtro: CidadeFilter, params: URLSearchParams) {
        if (filtro.estado) {
            params.set('estado', filtro.estado.codigo.toString());
        }
        if (filtro.nome) {
            params.set('nome', filtro.nome);
        }
    }
}
