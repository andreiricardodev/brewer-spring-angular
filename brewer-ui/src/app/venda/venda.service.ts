import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {Venda} from "../shared/model";
import {VendaFilter} from "../shared/filter";

@Injectable()
export class VendaService {

    vendaUrl: string;

    constructor(private http: AuthHttp) {
        this.vendaUrl = `${environment.apiUrl}/vendas`;
    }

    salvar(venda: Venda): Promise<Venda> {
        return this.http.post(`${this.vendaUrl}/salvar`, JSON.stringify(venda))
            .toPromise()
            .then(response => response.json() as Venda);
    }

    emitir(venda: Venda): Promise<Venda> {
        return this.http.post(`${this.vendaUrl}/emitir`, JSON.stringify(venda))
            .toPromise()
            .then(response => response.json() as Venda);
    }

    enviarEmail(venda: Venda): Promise<Venda> {
        return this.http.post(`${this.vendaUrl}/enviarEmail`, JSON.stringify(venda))
            .toPromise()
            .then(response => response.json() as Venda);
    }

    cancelar(venda: Venda): Promise<Venda> {
        return this.http.post(`${this.vendaUrl}/cancelar`, JSON.stringify(venda))
            .toPromise()
            .then(response => response.json() as Venda);
    }

    buscarPeloCodigo(codigo: number): Promise<Venda> {
        return this.http.get(`${this.vendaUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response.json() as Venda;
            });
    }

    pesquisar(filtro: VendaFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.vendaUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const vendas = responseJson.content as Venda[];

                const resultado = {
                    vendas,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    listarStatus(): any[] {
        return [
            {label: 'Orçamento', value: 'ORCAMENTO'},
            {label: 'Emitida', value: 'EMITIDA'},
            {label: 'Cancelada', value: 'CANCELADA'}
        ];
    }

    private adicionarFiltro(filtro: VendaFilter, params: URLSearchParams) {
        if (filtro.codigo) {
            params.set('codigo', filtro.codigo.toString());
        }
        if (filtro.status) {
            params.set('status', filtro.status);
        }
        if (filtro.dataInicial) {
            params.set('dataInicial', filtro.dataInicial.toString());
        }
        if (filtro.dataFinal) {
            params.set('dataFinal', filtro.dataFinal.toString());
        }
        if (filtro.valorInicial) {
            params.set('valorInicial', filtro.valorInicial.toString());
        }
        if (filtro.valorFinal) {
            params.set('valorFinal', filtro.valorFinal.toString());
        }
        if (filtro.nomeCliente) {
            params.set('nomeCliente', filtro.nomeCliente);
        }
        if (filtro.cpfOuCnpjCliente) {
            params.set('cpfOuCnpjCliente', filtro.cpfOuCnpjCliente);
        }
    }
}
