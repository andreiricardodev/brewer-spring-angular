import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";

import {MenuItem} from "primeng/primeng";
import {MessageService} from "primeng/components/common/messageservice";

import {CervejaService} from "../../cerveja/cerveja.service";
import {ErrorHandlerService} from "../../shared/error-handler.service";
import {VendaService} from "../venda.service";
import {Cerveja, Cliente, ItemVenda, Usuario, Venda} from "../../shared/model";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {AuthService} from "../../seguranca/auth.service";

@Component({
    selector: 'app-cadastro-venda',
    templateUrl: './cadastro-venda.component.html',
    styleUrls: ['./cadastro-venda.component.css']
})
export class CadastroVendaComponent implements OnInit {

    itensBotaoSalvar: MenuItem[];

    idiomaCalendario: any;
    cervejaSelecionada: Cerveja;
    cervejasFiltradas: Cerveja[];
    itensVenda: ItemVenda[] = [];

    venda = new Venda();
    showDialog = false;

    tituloPagina: string;

    @ViewChild('form')
    form: FormControl;

    constructor(
        private title: Title,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private cervejaService: CervejaService,
        private vendaService: VendaService,
        public auth: AuthService
    ) {
        this.limpar();
    }

    ngOnInit() {
        const codigo = this.route.snapshot.params['codigo'];

        this.title.setTitle('Cadastro de Venda');
        this.atualizarTituloPagina();

        this.inicializarIdiomaCalendario();
        this.inicializarBotaoSalvar();

        if (codigo) {
            this.buscarVenda(codigo);
        }
    }

    salvar() {
        if (this.validarVenda()) {
            this.venda.usuario.codigo = Number.parseInt(localStorage.getItem('codigoUsuario'));
            this.adicionarItensVenda();
            this.calculaTotalVenda();
            const vendaNova = !this.editando();
            this.vendaService.salvar(this.venda)
                .then(vendaSalva => {
                    this.form.reset();
                    this.limpar();
                    this.messageService.add({severity: 'success', detail: 'Venda salva com sucesso!'});
                    if (vendaNova) {
                        this.router.navigate(['/vendas/nova']);
                    } else {
                        this.buscarVenda(vendaSalva.codigo);
                    }
                })
                .catch(erro => this.errorHandler.handle(erro));
        }
    }

    emitir() {
        if (this.validarVenda()) {
            this.venda.usuario.codigo = Number.parseInt(localStorage.getItem('codigoUsuario'));
            this.adicionarItensVenda();
            this.calculaTotalVenda();
            const vendaNova = !this.editando();
            this.vendaService.emitir(this.venda)
                .then(vendaEmitida => {
                    this.form.reset();
                    this.limpar();
                    this.messageService.add({severity: 'success', detail: 'Venda emitida com sucesso!'});
                    if (vendaNova) {
                        this.router.navigate(['/vendas/nova']);
                    } else {
                        this.buscarVenda(vendaEmitida.codigo);
                    }
                })
                .catch(erro => this.errorHandler.handle(erro));
        }
    }

    enviarEmail() {
        if (this.validarVenda()) {
            this.venda.usuario.codigo = Number.parseInt(localStorage.getItem('codigoUsuario'));
            this.adicionarItensVenda();
            this.calculaTotalVenda();
            const vendaNova = !this.editando();
            this.vendaService.enviarEmail(this.venda)
                .then(vendaSalva => {
                    this.form.reset();
                    this.limpar();
                    this.messageService.add({severity: 'success', detail: `Venda nº ${vendaSalva.codigo} salva com sucesso e e-mail enviado!`});
                    if (vendaNova) {
                        this.router.navigate(['/vendas/nova']);
                    } else {
                        this.buscarVenda(vendaSalva.codigo);
                    }
                })
                .catch(erro => this.errorHandler.handle(erro));
        }
    }

    cancelar() {
        this.vendaService.cancelar(this.venda)
            .then(vendaCancelada => {
                this.form.reset();
                this.limpar();
                this.messageService.add({severity: 'success', detail: `Venda nº ${vendaCancelada.codigo} cancelada com sucesso!`});
                this.buscarVenda(vendaCancelada.codigo);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    filtrarCervejas(event) {
        this.cervejaService.listar(event.query)
            .then(cervejas => {
                this.cervejasFiltradas = cervejas;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    adicionarItem() {
        const itemVenda = new ItemVenda();
        itemVenda.cerveja = this.cervejaSelecionada;
        itemVenda.quantidade = 1;
        itemVenda.valorUnitario = this.cervejaSelecionada.valor;

        this.itensVenda.push(itemVenda);
        this.calculaTotalVenda();
        this.cervejaSelecionada = null;
    }

    calculaTotalVenda() {
        let totalItens = 0.00;

        this.itensVenda.forEach(itemVenda => {
            itemVenda.valorTotal = itemVenda.quantidade * itemVenda.valorUnitario;
            totalItens += itemVenda.valorTotal;
        });

        const valorFrete = (this.venda.valorFrete ? this.venda.valorFrete : 0.00);
        const valorDesconto = (this.venda.valorDesconto ? this.venda.valorDesconto : 0.00);
        this.venda.valorTotal = totalItens + valorFrete - valorDesconto;
    }

    getDescricaoOrigemCerveja(origem: string): string {
        let retorno = '';
        const origens = this.cervejaService.listarOrigens();

        origens.forEach(o => {
            if (o.value === origem) {
                retorno = o.label;
            }
        });

        return retorno;
    }

    getDescricaoStatus(): string {
        let retorno = '';
        const todosStatus = this.vendaService.listarStatus();

        todosStatus.forEach(status => {
            if (status.value === this.venda.status) {
                retorno = status.label;
            }
        });

        return retorno;
    }

    getDiasCriacao() {
        const inicio = this.venda.dataCriacao ? Date.parse(this.venda.dataCriacao.toString()) : Date.now();
        const quantidadeDias =  Math.floor((Date.now() - inicio) / 1000 / 3600 / 24);

        let descQtdDias = '';
        if (quantidadeDias === 0) {
            descQtdDias = 'Hoje';
        } else if (quantidadeDias === 1) {
            descQtdDias = 'Há 1 dia';
        } else if (quantidadeDias > 1) {
            descQtdDias = `Há ${quantidadeDias} dias`;
        }

        return descQtdDias;
    }

    onShowDialog() {
        this.showDialog = true;
    }

    onClienteSelecionado(event) {
        this.showDialog = false;
        this.venda.cliente = event.cliente;
    }

    salvarPermitido() {
        return this.venda.status !== 'CANCELADA';
    }

    salvarProibido() {
        return this.venda.status === 'CANCELADA';
    }

    private editando(): boolean {
        return Boolean(this.venda.codigo).valueOf();
    }

    private atualizarTituloPagina() {
        if (!this.editando()) {
            this.tituloPagina = 'Cadastro de Venda';
        } else {
            this.tituloPagina = `Edição da Venda nº ${this.venda.codigo}`;
        }
    }

    private limpar() {
        this.venda = new Venda();
        this.itensVenda = [];
        this.venda.cliente = new Cliente();
        this.venda.usuario = new Usuario();
        this.venda.valorTotal = 0.00;
        this.venda.status = 'ORCAMENTO';
    }

    private buscarVenda(codigo: number) {
        this.vendaService.buscarPeloCodigo(codigo)
            .then(venda => {
                this.venda = venda;
                this.itensVenda = venda.itens;
                this.venda.itens = [];
                this.atualizarTituloPagina();
                this.calculaTotalVenda();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private adicionarItensVenda() {
        this.itensVenda.forEach(itemVenda => {
            this.venda.itens.push(itemVenda);
        });
    }

    private validarVenda(): boolean {
        if (!this.venda.cliente.codigo) {
            this.messageService.add({severity: 'error', detail: 'Selecione um cliente na pesquisa rápida.'});
            return false;
        }
        if (this.itensVenda.length === 0) {
            this.messageService.add({severity: 'error', detail: 'Adicione pelo menos uma cerveja na venda.'});
            return false;
        }
        if (this.venda.horarioEntrega && !this.venda.dataEntrega) {
            this.messageService.add({severity: 'error', detail: 'Informe uma data da entrega para um horário.'});
            return false;
        }
        if (this.venda.valorTotal < 0) {
            this.messageService.add({severity: 'error', detail: 'Valor Total não pode ser negativo.'});
            return false;
        }

        return true;
    }

    private inicializarBotaoSalvar() {
        this.itensBotaoSalvar = [
            {label: 'Salvar e Emitir', command: () => {
                this.emitir();
            }},
            {label: 'Salvar e Enviar por E-mail', command: () => {
                this.enviarEmail();
            }}
        ];
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
}
