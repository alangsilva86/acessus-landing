# Convenios Metadata (cliente)

Este arquivo documenta como os convênios são representados no simulador “public-side” (sem backend). Ele serve como guia para adicionar/editar/impor novos convênios, taxas e janelas de liberação.

## Estrutura

Todos os convênios vivem em `client/src/data/convenios.ts`. Cada entrada segue o formato:

```ts
{
  id: string; // único e estável. Ex.: "prefeitura-curitiba-pr"
  name: string; // nome exibido no select
  tipo: "municipal" | "estadual" | "inss"
  janela: {
    inicio: "DD/MM/AA",
    fim: "DD/MM/AA",
    vencimento: "DD/MM/AA"
  }
  taxas?: {
    normal?: number;
    flex1?: number;
    flex2?: number;
  }
  produtosDisponiveis: MarginType[];
}
```

- `produtosDisponiveis` determina quais `MarginType` ficam habilitados no passo 2. Ele também é usado pela engine (`simulateWithMargin`) para decidir se há coeficiente diário para um dado tipo de margem.
- `taxas` alimenta o motor do coeficiente (Tabela Price). Se a propriedade estiver faltando, a combinação é considerada incompleta.

## Como adicionar um convênio

1. Abra `client/src/data/convenios.ts`.
2. Copie um objeto existente e ajuste:
   - `id`: nunca mude após publicar porque ele aparece no payload público.
   - `janela`: defina as datas válidas; o motor gera coeficientes apenas dentro delas.
   - `taxas`: informe `normal`, `flex1`, `flex2` conforme a política do convênio.
   - `produtosDisponiveis`: liste os `MarginType` que podem ser usados (ex.: `["beneficio"]` se só houver saque).
3. Salve, garanta que o lint/format aceita e rode `pnpm dev`/`pnpm build` para regenerar a tabela.

## Fluxo de dependência

1. `Simulator` consome `produtosDisponiveis` para ativar/desativar cards e ordená-los (items disponíveis primeiro).
2. `coefficientEngine` percorre `convenios` e cria splines entre `janela.inicio` e `janela.fim`.
3. Quando o usuário envia margem/prazo, `simulateWithMargin` usa o coeficiente do dia atual e retorna `valorLiberado`, `tac` e `coeficiente`.
4. `SimulationResult` usa o resultado para mostrar o valor final e habilitar o WhatsApp apenas em combinações válidas.

## Diagnóstico

- Se a UI mostrar “Sem dados”, abra este arquivo e confirme:
  * O convênio está listado?
  * `produtosDisponiveis` inclui o tipo de margem selecionado?
  * Há taxa na propriedade apropriada (`normal`, `flex1`, etc.)?
  * A janela cobre a data atual (com base no relógio do navegador)?

Caso afirmativo, a engine está gerando coeficiente; caso contrário, a combinação não tem dados.

## Dica rápida

Mantenha `conveniosData` organizado em ordem alfabética ou por prioridade de bugs (ex.: convênios com janelas mais críticas ficam no topo) para facilitar buscas via editor.
