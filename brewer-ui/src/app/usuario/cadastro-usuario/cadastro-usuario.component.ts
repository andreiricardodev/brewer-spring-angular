import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Title} from "@angular/platform-browser";

import {MessageService} from "primeng/components/common/messageservice";

import {ErrorHandlerService} from "../../shared/error-handler.service";
import {GrupoService} from "../../grupo/grupo.service";
import {UsuarioService} from "../usuario.service";
import {Grupo, Usuario} from "../../shared/model";

@Component({
    selector: 'app-cadastro-usuario',
    templateUrl: './cadastro-usuario.component.html',
    styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

    idiomaCalendario: any;
    grupos: Grupo[];
    gruposSelecionados: number[] = [];
    usuario = new Usuario();

    tituloPagina: string;

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private grupoService: GrupoService,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Usuário');
        this.atualizarTituloPagina();

        this.inicializarIdiomaCalendario();
        this.carregarGrupos();

        if (codigo) {
            this.buscarUsuario(codigo);
        }
    }

    salvar(form: FormControl) {
        if (this.validarUsuario()) {
            this.gruposSelecionados.forEach(codigoGrupo => {
                const grupo = new Grupo();
                grupo.codigo = codigoGrupo;
                this.usuario.grupos.push(grupo);
            });

            if (!this.editando()) {
                this.salvarUsuario(form);
            } else {
                this.atualizarUsuario(form);
            }
        }
    }

    private editando(): boolean {
        return Boolean(this.usuario.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Usuário';
        } else {
            this.tituloPagina = `Edição do Usuário - ${this.usuario.nome}`;
        }
    }

    private buscarUsuario(codigo: number) {
        this.usuarioService.buscarPeloCodigo(codigo)
            .then(usuario => {
                this.usuario = usuario;
                this.gruposSelecionados = [];
                usuario.grupos.forEach(grupo => {
                    this.gruposSelecionados.push(grupo.codigo);
                });
                this.usuario.senha = null;
                this.usuario.confirmacaoSenha = null;
                this.usuario.grupos = [];
                this.atualizarTituloPagina();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private salvarUsuario(form: FormControl) {
        this.usuarioService.salvar(this.usuario)
            .then(usuarioAdicionado => {
                form.reset();
                this.messageService.add({severity: 'success', detail: 'Usuário salvo com sucesso!'});
                this.router.navigate(['/usuarios/novo']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private atualizarUsuario(form: FormControl) {
        this.usuarioService.atualizar(this.usuario)
            .then(usuario => {
                this.usuario = usuario;
                this.gruposSelecionados = [];
                usuario.grupos.forEach(grupo => {
                    this.gruposSelecionados.push(grupo.codigo);
                });
                this.usuario.senha = null;
                this.usuario.confirmacaoSenha = null;
                this.usuario.grupos = [];
                this.atualizarTituloPagina();
                this.messageService.add({severity: 'success', detail: 'Usuário atualizado com sucesso!'});
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private carregarGrupos() {
        this.grupoService.listar()
            .then(grupos => {
                this.grupos = grupos;
            }).catch(erro => this.errorHandler.handle(erro));
    }

    private inicializarIdiomaCalendario() {
        this.idiomaCalendario = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Limpar'
        };
    }

    private validarUsuario(): boolean {
        if (this.gruposSelecionados.length === 0) {
            this.messageService.add({severity: 'error', detail: 'Selecione pelo menos 1 grupo.'});
            return false;
        }

        return true;
    }
}
