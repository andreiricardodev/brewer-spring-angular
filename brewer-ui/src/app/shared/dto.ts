export class PeriodoRelatorio {
    dataInicio: Date;
    dataFim: Date;
}

export class ValorItensEstoque {
    valor: number;
    quantidade: number;
}

export class VendaMes {
    mes: string;
    total: number;
}

export class VendaOrigem {
    mes: string;
    totalNacional: number;
    totalInternacional: number;
}

export class DashboardDTO {
    vendasNoAno: number;
    vendasNoMes: number;
    ticketMedio: number;
    valorItensEstoque = new ValorItensEstoque();
    totalClientes: number;
    totalPorMes: VendaMes[] = [];
    totalPorOrigem: VendaOrigem[] = [];
}
