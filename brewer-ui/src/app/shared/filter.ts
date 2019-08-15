import {Estado, Estilo, Grupo} from "./model";

class ComumFilter {
    pagina: number;
    itensPorPagina: number;
    ordenacao: string;
}

export class CervejaFilter extends ComumFilter {
    sku: string;
    nome: string;
    origem: string;
    sabor: string;
    estilo: Estilo;
    valorDe: number;
    valorAte: number;
}

export class CidadeFilter extends ComumFilter {
    estado: Estado;
    nome: string;
}

export class ClienteFilter extends ComumFilter {
    nome: string;
    cpfOuCnpj: string;
}

export class EstiloFilter extends ComumFilter {
    nome: string;
}

export class UsuarioFilter extends ComumFilter {
    nome: string;
    email: string;
    grupos: Grupo[];
}

export class VendaFilter extends ComumFilter {
    codigo: number;
    status: string;
    dataInicial: Date;
    dataFinal: Date;
    valorInicial: number;
    valorFinal: number;
    nomeCliente: string;
    cpfOuCnpjCliente: string;
}
