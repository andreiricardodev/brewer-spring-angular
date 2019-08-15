import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {Cerveja} from "../shared/model";
import {CervejaFilter} from "../shared/filter";

@Injectable()
export class CervejaService {

    cervejaUrl: string;

    constructor(private http: AuthHttp) {
        this.cervejaUrl = `${environment.apiUrl}/cervejas`;
    }

    salvar(cerveja: Cerveja): Promise<Cerveja> {
        return this.http.post(this.cervejaUrl, JSON.stringify(cerveja))
            .toPromise()
            .then(response => response.json() as Cerveja);
    }

    atualizar(cerveja: Cerveja): Promise<Cerveja> {
        return this.http.put(`${this.cervejaUrl}/${cerveja.codigo}`,
            JSON.stringify(cerveja))
            .toPromise()
            .then(response => response.json() as Cerveja);
    }

    remover(codigo: number): Promise<void> {
        return this.http.delete(`${this.cervejaUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    buscarPeloCodigo(codigo: number): Promise<Cerveja> {
        return this.http.get(`${this.cervejaUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response.json() as Cerveja;
            });
    }

    listar(skuOuNome: string): Promise<any> {
        const params = new URLSearchParams();
        params.set('skuOuNome', skuOuNome);

        return this.http.get(`${this.cervejaUrl}/listar`, {search: params})
            .toPromise()
            .then(response => response.json() as Cerveja[]);
    }

    pesquisar(filtro: CervejaFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.cervejaUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const cervejas = responseJson.content as Cerveja[];

                const resultado = {
                    cervejas,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    listarSabores(): any[] {
        return [
            {label: 'Adocicada', value: 'ADOCICADA'},
            {label: 'Amarga',    value: 'AMARGA'},
            {label: 'Forte',     value: 'FORTE'},
            {label: 'Frutada',   value: 'FRUTADA'},
            {label: 'Suave',     value: 'SUAVE'}
        ];
    }

    listarOrigens(): any[] {
        return [
            {label: 'Nacional', value: 'NACIONAL'},
            {label: 'Internacional', value: 'INTERNACIONAL'}
        ];
    }

    private adicionarFiltro(filtro: any, params: URLSearchParams) {
        if (filtro.sku) {
            params.set('sku', filtro.sku);
        }
        if (filtro.nome) {
            params.set('nome', filtro.nome);
        }
        if (filtro.estilo) {
            params.set('estilo', filtro.estilo);
        }
        if (filtro.sabor) {
            params.set('sabor', filtro.sabor);
        }
        if (filtro.origem) {
            params.set('origem', filtro.origem);
        }
        if (filtro.valorDe) {
            params.set('valorDe', filtro.valorDe);
        }
        if (filtro.valorAte) {
            params.set('valorAte', filtro.valorAte);
        }
    }

}
