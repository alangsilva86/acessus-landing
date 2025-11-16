/**
 * Convenios metadata lives here with explicit fields for easier future updates.
 * Add new entries by following the pattern (id/name/tipo/janela/taxas/produtosDisponiveis).
 */
export type ConvenioTipo = "municipal" | "estadual" | "inss";
export type MarginType = "emprestimo" | "cartao" | "beneficio" | "outra";

export interface TaxProfile {
  normal?: number;
  flex1?: number;
  flex2?: number;
}

export type MarginTaxTable = Partial<Record<MarginType, TaxProfile>>;

export interface Convenio {
  id: string;
  name: string;
  tipo: ConvenioTipo;
  janela: {
    inicio: string;
    fim: string;
    vencimento: string;
  };
  taxas?: MarginTaxTable;
  produtosDisponiveis: MarginType[];
}

const conveniosData: Convenio[] = [
  {
    id: "gov-pr",
    name: "Governo do Paraná",
    tipo: "estadual",
    janela: {
      inicio: "01/11/25",
      fim: "30/11/25",
      vencimento: "10/02/26"
    },
    taxas: { beneficio: { normal: 4.8, flex1: 4.3, flex2: 3.5 } },
    produtosDisponiveis: ["beneficio"]
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
    taxas: { beneficio: { normal: 4.5, flex1: 4.2, flex2: 3.9 } },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5,
        flex1: 4.9,
        flex2: 4.4
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5,
        flex1: 4.9,
        flex2: 4.4
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 4.3
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5,
        flex1: 4.9,
        flex2: 4.4
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5,
        flex1: 4.9,
        flex2: 4.4
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 6.5,
        flex1: 5.9,
        flex2: 5.3
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.5,
        flex1: 5.0
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 5.9,
        flex1: 5.5
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 4.5
      }
    },
    produtosDisponiveis: ["beneficio"]
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
      beneficio: {
        normal: 4.8
      }
    },
    produtosDisponiveis: ["beneficio"]
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
    produtosDisponiveis: ["beneficio"]
  }
];

const conveniosMap = new Map(conveniosData.map((convenio) => [convenio.id, convenio]));

export const convenios = conveniosData;

export const getConvenioById = (id?: string) => {
  if (!id) return undefined;
  return conveniosMap.get(id);
};

export const getConveniosByTipo = (tipo: ConvenioTipo) =>
  conveniosData.filter((convenio) => convenio.tipo === tipo);

export const getAllConvenios = () => [...conveniosData];

export const getTaxaForMargin = (convenioId: string, margin: MarginType) => {
  const convenio = getConvenioById(convenioId);
  if (!convenio) return null;
  const marginTable = convenio.taxas?.[margin];
  if (!marginTable) return null;
  return marginTable.normal ?? marginTable.flex1 ?? marginTable.flex2 ?? null;
};
