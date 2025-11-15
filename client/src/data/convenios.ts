export type ConvenioTipo = "municipal" | "estadual" | "inss";
export type MarginType = "emprestimo" | "cartao" | "beneficio" | "outra";

export interface Convenio {
  id: string;
  name: string;
  tipo: ConvenioTipo;
  janela: {
    inicio: string;
    fim: string;
    vencimento: string;
  };
  taxas?: {
    normal?: number;
    flex1?: number;
    flex2?: number;
  };
  produtosDisponiveis?: MarginType[];
}

export const convenios: Convenio[] = [
  {
    id: "gov-pr",
    name: "Governo do Paraná",
    tipo: "estadual",
    janela: {
      inicio: "01/11/25",
      fim: "30/11/25",
      vencimento: "10/02/26"
    },
    taxas: {
      normal: 4.8,
      flex1: 4.3,
      flex2: 3.5
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-curitiba-pr",
    name: "Prefeitura de Curitiba",
    tipo: "municipal",
    janela: {
      inicio: "01/11/25",
      fim: "30/11/25",
      vencimento: "10/01/26"
    },
    taxas: {
      normal: 4.5,
      flex1: 4.2,
      flex2: 3.9
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-pirai-do-sul-pr",
    name: "Prefeitura de Piraí do Sul",
    tipo: "municipal",
    janela: {
      inicio: "15/10/25",
      fim: "14/11/25",
      vencimento: "15/12/25"
    },
    taxas: {
      normal: 5.5,
      flex1: 4.9,
      flex2: 4.4
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-guaratuba-pr",
    name: "Prefeitura de Guaratuba",
    tipo: "municipal",
    janela: {
      inicio: "10/11/25",
      fim: "09/12/25",
      vencimento: "15/01/26"
    },
    taxas: {
      normal: 5.5,
      flex1: 4.9,
      flex2: 4.4
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-maringa-pr",
    name: "Prefeitura de Maringá",
    tipo: "municipal",
    janela: {
      inicio: "05/11/25",
      fim: "04/12/25",
      vencimento: "10/01/26"
    },
    taxas: {
      normal: 4.3
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-ponta-grossa-pr",
    name: "Prefeitura de Ponta Grossa",
    tipo: "municipal",
    janela: {
      inicio: "01/11/25",
      fim: "30/11/25",
      vencimento: "10/01/26"
    },
    taxas: {
      normal: 5.5,
      flex1: 4.9,
      flex2: 4.4
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "guaraprev",
    name: "Guaraprev",
    tipo: "municipal",
    janela: {
      inicio: "15/10/25",
      fim: "14/11/25",
      vencimento: "15/12/25"
    },
    taxas: {
      normal: 5.5,
      flex1: 4.9,
      flex2: 4.4
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-cambara-pr",
    name: "Prefeitura de Cambará",
    tipo: "municipal",
    janela: {
      inicio: "15/10/25",
      fim: "14/11/25",
      vencimento: "05/12/25"
    },
    taxas: {
      normal: 5.5
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "gov-goias",
    name: "Governo de Goiás",
    tipo: "estadual",
    janela: {
      inicio: "01/11/25",
      fim: "30/11/25",
      vencimento: "15/01/26"
    },
    taxas: {
      normal: 6.5,
      flex1: 5.9,
      flex2: 5.3
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-medianeira-pr",
    name: "Prefeitura de Medianeira",
    tipo: "municipal",
    janela: {
      inicio: "10/11/25",
      fim: "09/12/25",
      vencimento: "15/01/26"
    },
    taxas: {
      normal: 5.5,
      flex1: 5.0
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-arapongas-pr",
    name: "Prefeitura de Arapongas",
    tipo: "municipal",
    janela: {
      inicio: "10/11/25",
      fim: "09/12/25",
      vencimento: "10/01/26"
    },
    taxas: {
      normal: 5.9,
      flex1: 5.5
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "prefeitura-londrina-pr",
    name: "Prefeitura de Londrina",
    tipo: "municipal",
    janela: {
      inicio: "15/10/25",
      fim: "14/11/25",
      vencimento: "15/12/25"
    },
    taxas: {
      normal: 4.5
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "tribunal-contas-pr",
    name: "Tribunal de Contas do Estado do Paraná",
    tipo: "estadual",
    janela: {
      inicio: "10/11/25",
      fim: "09/12/25",
      vencimento: "15/01/26"
    },
    taxas: {
      normal: 4.8
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  },
  {
    id: "inss-geral",
    name: "INSS (aposentados/pensionistas)",
    tipo: "inss",
    janela: {
      inicio: "01/01/24",
      fim: "31/12/25",
      vencimento: "10/02/26"
    },
    produtosDisponiveis: ["emprestimo", "cartao", "beneficio"]
  }
];

export const getConvenioById = (id?: string) =>
  convenios.find((convenio) => convenio.id === id);

export const getConveniosByTipo = (tipo: ConvenioTipo) =>
  convenios.filter((convenio) => convenio.tipo === tipo);
