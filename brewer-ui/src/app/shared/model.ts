export class Estilo {
    codigo: number;
    nome: string;
}

export class Cerveja {
    codigo: number;
    sku: string;
    nome: string;
    descricao: string;
    valor: number;
    teorAlcoolico: number;
    comissao: number;
    quantidadeEstoque: number;
    origem: string;
    sabor: string;
    estilo: Estilo;
    foto: string;
    contentType: string;
    urlFoto: string;
    urlThumbnailFoto: string;
}

export class Estado {
    codigo: number;
    nome: string;
    sigla: string;
}

export class Cidade {
    codigo: number;
    nome: string;
    estado: Estado;
}

export class Endereco {
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    cidade: Cidade;
    estado: Estado;
}

export class Cliente {
    codigo: number;
    nome: string;
    tipoPessoa: string;
    cpfOuCnpj: string;
    telefone: string;
    email: string;
    endereco = new Endereco();
}

export class Permissao {
    codigo: number;
    nome: string;
}

export class Grupo {
    codigo: number;
    nome: string;
    permissoes: Permissao[];
}

export class Usuario {
    codigo: number;
    nome: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
    ativo: boolean;
    grupos: Grupo[] = [];
    dataNascimento: Date;
}

export class ItemVenda {
    codigo: number;
    quantidade: number;
    valorUnitario: number;
    cerveja: Cerveja;
    valorTotal: number;
}

export class Venda {
    codigo: number;
    dataCriacao: Date;
    valorFrete: number;
    valorDesconto: number;
    valorTotal = 0;
    observacao: string;
    dataHoraEntrega: Date;
    status = 'ORCAMENTO';
    itens: ItemVenda[] = [];
    cliente: Cliente;
    usuario: Usuario;
    dataEntrega: Date;
    horarioEntrega: Date;
}
