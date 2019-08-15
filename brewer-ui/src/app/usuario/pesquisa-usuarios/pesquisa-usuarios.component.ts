import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService, DataTable, LazyLoadEvent} from "primeng/primeng";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {GrupoService} from "../../grupo/grupo.service";
import {UsuarioService} from "../usuario.service";
import {UsuarioFilter} from "../../shared/filter";
import {Grupo, Usuario} from "../../shared/model";

@Component({
    selector: 'app-pesquisa-usuarios',
    templateUrl: './pesquisa-usuarios.component.html',
    styleUrls: ['./pesquisa-usuarios.component.css']
})
export class PesquisaUsuariosComponent implements OnInit {

    grupos: Grupo[] = [];
    gruposSelecionados: Grupo[] = [];
    usuarios: Usuario[] = [];
    totalRegistros  = 0;
    usuarioFilter = new UsuarioFilter();

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private grupoService: GrupoService,
        private usuarioService: UsuarioService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de Usuários');

        this.carregarGrupos();

        this.usuarioFilter.itensPorPagina = 3;
    }

    pesquisar(pagina: number = 0) {
        this.usuarioFilter.pagina = pagina;
        this.usuarioFilter.grupos = [];

        this.gruposSelecionados.forEach(grupo => {
            this.usuarioFilter.grupos.push(grupo);
        });

        this.usuarioService.pesquisar(this.usuarioFilter)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.usuarios = resultado.usuarios;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
    }

    aoOrdenar(event) {
        this.usuarioFilter.ordenacao = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');

        this.pesquisar();
    }

    getStatusUsuario(ativo: boolean): string {
        return ativo ? 'Ativo' : 'Inativo';
    }

    removerUsuario(usuario: Usuario, tabela: DataTable) {
        this.confirmationService.confirm({
            message: `Excluir "${usuario.nome}"? Você não poderá recuperar depois.`,
            accept: () => {
                this.usuarioService.remover(usuario.codigo)
                    .then(() => {
                        tabela.reset();
                        this.messageService.add({severity: 'success', detail: `Usuário "${usuario.nome}" excluído com sucesso!`});
                    })
                    .catch(erro => this.errorHandler.handle(erro));
            }
        });
    }

    private carregarGrupos() {
        this.grupoService.listar()
            .then(grupos => {
                this.grupos = grupos;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
