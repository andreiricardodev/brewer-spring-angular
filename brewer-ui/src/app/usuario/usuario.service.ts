import {URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import {AuthHttp} from "angular2-jwt";

import {environment} from "../../environments/environment";
import {UsuarioFilter} from "../shared/filter";
import {Usuario} from "../shared/model";

@Injectable()
export class UsuarioService {

    usuarioUrl: string;

    constructor(private http: AuthHttp) {
        this.usuarioUrl = `${environment.apiUrl}/usuarios`;
    }

    salvar(usuario: Usuario): Promise<Usuario> {
        return this.http.post(this.usuarioUrl, JSON.stringify(usuario))
            .toPromise()
            .then(response => response.json() as Usuario);
    }

    atualizar(usuario: Usuario): Promise<Usuario> {
        return this.http.put(`${this.usuarioUrl}/${usuario.codigo}`,
            JSON.stringify(usuario))
            .toPromise()
            .then(response => response.json() as Usuario);
    }

    remover(codigo: number): Promise<void> {
        return this.http.delete(`${this.usuarioUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    buscarPeloCodigo(codigo: number): Promise<Usuario> {
        return this.http.get(`${this.usuarioUrl}/${codigo}`)
            .toPromise()
            .then(response => response.json() as Usuario);
    }

    pesquisar(filtro: UsuarioFilter): Promise<any> {
        const params = new URLSearchParams();

        params.set('page', filtro.pagina.toString());
        params.set('size', filtro.itensPorPagina.toString());
        params.set('sort', filtro.ordenacao);

        this.adicionarFiltro(filtro, params);

        return this.http.get(`${this.usuarioUrl}`,
            {search: params})
            .toPromise()
            .then(response => {
                const responseJson = response.json();
                const usuarios = responseJson.content as Usuario[];

                const resultado = {
                    usuarios,
                    total: responseJson.totalElements
                };

                return resultado;
            });
    }

    private adicionarFiltro(filtro: UsuarioFilter, params: URLSearchParams) {
        if (filtro.nome) {
            params.set('nome', filtro.nome);
        }
        if (filtro.email) {
            params.set('email', filtro.email);
        }
        if (filtro.grupos) {
            filtro.grupos.forEach(grupo => {
                params.set('grupos', grupo.codigo.toString());
                params.set('_grupos', 'on');
            });
        }
    }
}
