# Simulador Público – Visão do PO e Visão Técnica

A proposta é entregar uma jornada simples para o servidor público (ou aposentado/pensionista) sem expor a complexidade do coeficiente. Internamente, o motor baseado no **coeficiente diário** continua sendo o coração do cálculo — ele é invocado para cada prazo desejado, mas o servidor vê apenas etapas claras, textos humanizados e um resultado bonito que já pode ser levado para o WhatsApp.

## 1. Visão geral do fluxo

| Etapa | Experiência | Referência técnica |
| --- | --- | --- |
| 1. Tipo de vínculo | Cartões grandes com “Você é servidor de qual tipo?” (municipal / estadual / federal / aposentado). | Front chama `GET /public/convenios?tipoServidor=<TIPO>`; só traz convênios ativos, com janela vigente e produtos configurados; o front exibe somente o nome do convênio para manter simplicidade, enquanto a janela/taxa permanece no payload para uso no cálculo. |
| 2. Seleção do convênio | Combo/search com convênios filtrados; feedback visual e dica do prazo da janela. | Reaproveita o mesmo endpoint do Passo 1, com cache leve do catálogo para evitar latência. |
| 3. Tipo de margem | Mostra os produtos disponíveis (normal, cartão consignado, cartão benefício); escolhe apenas o produto que responde pelo saque desejado. Cards com margem sem dados ficam apagados/tooltip e o card disponível é empurrado para o topo, tudo para que o front só exiba o nome legítimo enquanto a janela/taxa roda nos bastidores. | Produto (`CARTAO_BENEFICIO`, `CARTAO_CONSIGNADO`, `CONSIGNADO_TRADICIONAL`) + modalidade `NORMAL` são enviados para `simularPublico`. |
| 4. Valor da margem | Input numérico com validações (50 a 5.000), placeholder em R$ e dica “Se estiver no contracheque, coloque aproximado”. | Esse valor vira `margem` no payload e alimenta diretamente a fórmula de coeficiente diário. |
| 5. Dados pessoais + CTA | Nome, WhatsApp (máscara) e CTA com copy focado em saque (“Ver quanto posso sacar agora”). | Nome e WhatsApp viram `lead` no payload para salvar com origem `SIMULADOR_PUBLICO`. CTA só habilita após preenchimento completo. |

### Resultado (Etapa 6 na experiência)

- Depois que o botão é acionado, o front abre cards de prazos com valores liberados e animações (`stepper`, contador, preview do WhatsApp). O usuário escolhe um prazo e os dados já ficam armazenados para abrir o WhatsApp ou o fluxo de atendimento.
 - Pontos de conversão ligados ao passo: salvar o prazo escolhido, o valor e o convênio, além de direcionar para WhatsApp ou atendimento guiado.

## 2. Visão técnica dos serviços (coeficiente diário em ação)

### 2.1 Endpoint público de simulação

O front envia:

```json
{
  "convenioId": "c1",
  "tipoServidor": "MUNICIPAL",
  "produto": "CARTAO_BENEFICIO",
  "modalidade": "NORMAL",
  "margem": 350.0,
  "prazosDesejados": [12, 24, 36, 48, 60, 72, 84],
  "dataSimulacao": "2025-11-15",
  "lead": {
    "nome": "João da Silva",
    "whatsapp": "44999999999",
    "origem": "SIMULADOR_PUBLICO"
  }
}
```

### 2.2 Wrapper `simularPublico`

- Carrega a configuração (`loadConfig`) usando um dos prazos para validar convênio, janela e taxa.
- Executa `calcularSimulacao` para cada prazo da lista, reaproveitando a mesma lógica do motor de coeficiente diário.
- Retorna `SimulacaoPublicaOutput` com `resultados` contendo `coeficiente`, `valorBrutoLiberado`, `tac` e `valorLiquidoCliente`.
- Nunca expõe coeficiente para o usuário final: o front só mostra prazo e valor liberado. O coeficiente permanece disponível para logs e métricas internas.

### 2.3 Tratamento de erros e logs (Etapa 8)

- Caso não exista taxa/janela: resposta genérica com CTA “Fale com o especialista no WhatsApp”. Registrar o evento de erro com a combinação `convenio + produto + data`, para detectar convênios mal configurados.
- Sempre logar qualquer tentativa de simulação (sucesso ou erro). Logs devem registrar pra números: margem, prazos enviados, resultado (valor liberado) e status do lead.
- Se a simulação falhar, ainda assim gravar o lead com a informação do erro para permitir correção posterior e contato manual.

## 3. Janelas e taxas ativas (Etapas 2 e 8)

- A cada acesso, o front valida se o convênio escolhido segue dentro da janela ativa (Etapa 2), enquanto o back garante que uma taxa esteja configurada antes de acionar o coeficiente. Em caso de ausência de janela ou taxa, a resposta genérica informa “No momento não conseguimos simular esse convênio automaticamente. Fale com o especialista no WhatsApp” e a combinação é registrada para análise posterior (Etapa 8).

### 3.1 Janelas correntes por convênio

| Convênio | 1° dia | Último dia | 1° vencimento | Observação de etapa |
| --- | --- | --- | --- | --- |
| GOV.PR | 01/11/25 | 30/11/25 | 10/02/26 | Etapa 2 (query pública filtrada) |
| PREF. CURITIBAPR | 01/11/25 | 30/11/25 | 10/01/26 | Etapa 2 e monitoramento de janela |
| PREF. PIRAI DO SUL | 15/10/25 | 14/11/25 | 15/12/25 | Etapa 2 (janela curta) |
| PREF. GUARATUBA PR | 10/11/25 | 09/12/25 | 15/01/26 | Etapa 2 |
| PREF. MARINGÁ | 05/11/25 | 04/12/25 | 10/01/26 | Etapa 2 |
| PREF. PONTA GROSSA | 01/11/25 | 30/11/25 | 10/01/26 | Etapa 2 |
| GUARAPREV | 15/10/25 | 14/11/25 | 15/12/25 | Etapa 2 |
| PREF. CAMBARÁ | 15/10/25 | 14/11/25 | 05/12/25 | Etapa 2 |
| GOV. GOIAS | 01/11/25 | 30/11/25 | 15/01/26 | Etapa 2 |
| PREF. MEDIANEIRA | 10/11/25 | 09/12/25 | 15/01/26 | Etapa 2 |
| PREF. ARAPONGAS | 10/11/25 | 09/12/25 | 10/01/26 | Etapa 2 |
| PREF. DE LONDRINA | 15/10/25 | 14/11/25 | 15/12/25 | Etapa 2 |
| TRIBUNAL DE CONTAS DO ESTADO DO PARANA | 10/11/25 | 09/12/25 | 15/01/26 | Etapa 2 |

### 3.2 Taxas efetivas (Cartão Benefício – Normal/Flex)

| Convênio | Normal (%) | Flex1 (%) | Flex2 (%) |
| --- | --- | --- | --- |
| Governo do Paraná | 4,80 | 4,30 | 3,50 |
| Ponta Grossa | 5,50 | 4,90 | 4,40 |
| Prefeitura de Piraí do Sul | 5,50 | 4,90 | 4,40 |
| Prefeitura de Curitiba | 4,50 | 4,20 | 3,90 |
| Prefeitura de Guaratuba | 5,50 | 4,90 | 4,40 |
| Guaraprev | 5,50 | 4,90 | 4,40 |
| Prefeitura de Goiânia | 5,50 | 4,90 | 4,40 |
| Governo de Goiás | 6,50 | 5,90 | 5,30 |
| Prefeitura de Maringá | 4,30 | 0,00 | 0,00 |
| Prefeitura de Medianeira | 5,50 | 5,00 | - |
| Prefeitura de Cambará | 5,50 | - | - |
| Prefeitura de Arapongas | 5,90 | 5,50 | - |
| Prefeitura de Londrina | 4,50 | - | - |
| Tribunal de Contas do Estado do Paraná | 4,80 | - | - |

- Esses valores devem ser carregados pelo mesmo `loadConfig` que alimenta o coeficiente diário. Taxas faltantes (marcadas como `-` ou `0,00`) geram alertas internos e são logadas como parte do fluxo de erro (Etapa 8), mantendo a visão do PO de que “o coeficiente roda em silêncio”.

## 4. Registro de leads e métricas (Etapa 7)

- O payload salva:
  - Dados pessoais (nome, WhatsApp, IP, origem).
  - Dados da simulação (convênio, produto, modalidade, margem enviada, lista completa de prazos e valores, prazo selecionado se houver).
- Esse registro alimenta o LeadEngine, alimenta campanhas de remarketing e serve como base para conversões Meta offline.
- Metadata adicional a registrar: `coeficiente` por prazo, timestamp da simulação, origem da jornada (ex.: `SIMULADOR_PUBLICO_ETAPA_3`), e se houve clique para WhatsApp.

## 5. Comunicação e próximos passos

### Checklist PO para ajustes (ligado aos passos acima)

1. **Revisar cópias e CTAs (Etapas 1 a 5)** – Priorizar textos de saque no CTA e garantir mensagens de apoio para cada pergunta (ex.: “Onde encontro essa margem?”).
2. **Garantir validação e UX (Etapas 2, 3 e 4)** – Input com máscara, validação de valores, tooltips e estados de erro inline antes de habilitar o CTA.
3. **Aprimorar o resultado e o CTA final (Etapa 6)** – Mostrar cards com prazos e preview do WhatsApp, ênfase no “sem compromisso”.
4. **Log e monitoramento (Etapa 8 e 7)** – Validar que qualquer simulação gera log e lead, mesmo se o coeficiente/calculo falhar, e que o lead é enviado ao LeadEngine.
5. **Mensurar impacto (Etapa 9)** – Usar métricas do LeadEngine para avaliar conversões por prazo e origem. Garantir que o motor de coeficiente diário seja medido por prazo para comparar performance.

### Próximas ações técnicas

1. Documentar o contrato do endpoint público (`GET /public/convenios`, `POST /public/simular`) no repositório para alinhamento com o time de produto.
2. Criar testes de contrato que garantam que `simularPublico` não retorna coeficiente no payload público, mas registra em logs internos.
3. Monitorar eventos de erro de janela/taxa e criar dashboards simples para identificar convênios sem janela vigente.

## 6. Plano de engenharia

Com base nas etapas e nas regras acima, o time de engenharia pode seguir este roteiro para manter SRP, modularização e eficiência assíncrona enquanto garante baixa redundância:

1. **Componentização do simulador (Etapas 1–4)** – `Simulator.tsx` concentra múltiplas responsabilidades (estado, validação, formatação, renderização). Extraia os blocos de “Tipo de vínculo”, “Convênio + margem” e “Dados pessoais” em componentes dedicados (`StepTipoVinculo`, `StepMargem`, `StepLead`) com interfaces primitivas (`props: { data, onChange, onValidate }`). Isso estabeleceria contratos claros e permitiria testes unitários isolados por etapa.
2. **Hooks de estado único e validação (Etapas 2 e 4)** – Crie um hook `useSimuladorFlow` dentro de `client/src/hooks` que encapsule o estado compartilhado, validações (datas, margem) e transições, evitando a duplicação de `useState` e `handleNext`/`handleBack`. Esse hook também pode agrupar lógica assíncrona futura (cache de convênios, submissão de lead), reduzindo promessas espalhadas.
3. **Cache e batching de dados externos (Etapas 2 e 3)** – Introduza um utilitário em `client/src/lib/api.ts` (ou similar) que abstraia `GET /public/convenios` com cache leve e reuso de resultado entre navegadores de etapas. Sempre que for preciso buscar novas taxas/configurações, use `Promise.all` controlada para evitar múltiplas chamadas seriais e mantenha timeouts/backoff que evitem promessas penduradas.
4. **Desacoplamento do resultado da simulação (Etapa 6)** – `SimulationResult.tsx` deve receber apenas os resultados já calculados e uma lista de prazos. Extraia a lógica de animação/preview/whatsapp para componentes filhos (ex.: `PrazoCard`, `WhatsAppPreview`). Assim, `simularPublico` continua tratando o coeficiente diário em silêncio, enquanto o front apenas consome objetos (`resultados`) tipados via `SimulacaoPrazo`.
5. **Observabilidade e logs (Etapas 7 e 8)** – Amplie a camada de `LeadEngine`/`logger` para registrar o payload completo (margem, prazos, taxa/janela), mesmo em caso de erro. Isso pode ser um middleware adicional antes de chamar `simularPublico` no backend, mas também deve refletir no front (ex.: `client/src/lib/api.ts` sinaliza status e dispara eventos de telemetria).
6. **CI/Qualidade e testes automatizados (Etapas 1–9)** – Garanta lint/format verificando `client` e `server` (via `pnpm lint`/`tsc`). Crie testes unitários para os componentes de Step (usando `@testing-library/react`) e, no backend, contract tests que confirmem o payload `SimulacaoPublicaOutput` não expõe coeficiente, conforme descrito. Adicione testes de integração para o hook `useSimuladorFlow` e para a camada que registra leads.

Essas ações mantêm o simulador alinhado à arquitetura limpa, reduzem acoplamento entre módulos e evitam promessas desnecessárias. Caso o simulador cresça, novos passos (ex.: módulo de “Comparador por prazo” ou “Histórico de conversões”) podem montar sobre esses mesmos hooks/componentes.

## 7. Conclusão

Do ponto de vista do PO, o servidor atravessa 4 perguntas simples e um CTA poderoso. Tecnicamente, o coeficiente diário continua rodando em silêncio pelo `simularPublico`, que compõe múltiplos prazos com base na mesma fórmula. O próximo ciclo deve reforçar validações, registros de lead e monitoração para manter a confiança e permitir melhoria contínua.
