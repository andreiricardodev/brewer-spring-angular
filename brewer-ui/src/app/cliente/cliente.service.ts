import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {ClienteFilter} from "../shared/filter";
import {Cliente} from "../shared/model";

@Injectable()
export class ClienteService {

    clienteUrl: string;

    constructor(private http: AuthHttp) {
        this.clienteUrl = `${environment.apiUrl}/clientes`;
    }


    salvar(cliente: Cliente): Promise<Cliente> {
        return this.http.post(this.clienteUrl, JSON.stringify(cliente))
            .toPromise()
            .then(response => response.json() as Cliente);
    }

    atualizar(cliente: Cliente): Promise<Cliente> {
        return this.http.put(`${this.clienteUrl}/${cliente.codigo}`,
            JSON.stringify(cliente))
            .toPromise()
            .then(response => response.json() as Cliente);
    }

    remover(codigo: number): Promise<void> {
        return this.http.delete(`${this.clienteUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    buscarPeloCodigo(codigo: number): Promise<Cliente> {
        return this.http.get(`${this.clienteUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response.json() as Cliente;
            });
    }

    pesquisarPorNome(nome: string): Promise<any> {
        const params = new URLSearchParams();
        params.set('nome', nome);

        return this.http.get(`${this.clienteUrl}/porNome`, {search: params})
            .toPromise()
            .then(response => response.json() as Cliente[]);
    }

    pesquisar(filtro: ClienteFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.clienteUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const clientes = responseJson.content as Cliente[];

                const resultado = {
                    clientes,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    listarTiposPessoa(): any[] {
        return [
            {label: 'Física',   value: 'FISICA', documento: 'CPF', mascara: '999.999.999-99'},
            {label: 'Jurídica', value: 'JURIDICA', documento: 'CNPJ', mascara: '99.999.999/9999-99'}
        ];
    }

    private adicionarFiltro(filtro: ClienteFilter, params: URLSearchParams) {
        if (filtro.nome) {
            params.set('nome', filtro.nome);
        }
        if (filtro.cpfOuCnpj) {
            params.set('cpfOuCnpj', filtro.cpfOuCnpj);
        }
    }
}
