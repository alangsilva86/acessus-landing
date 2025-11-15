# Acessus Landing Page - TODO

## Estrutura e Design
- [x] Configurar paleta de cores da marca (verde #14A70F, #92DF17, #EBFFEF, #0F2B0F)
- [x] Adicionar logos da Acessus ao projeto
- [x] Configurar tipografia e estilos globais
- [x] Implementar design mobile-first responsivo

## Componentes Base
- [x] Barra superior com trust indicators (CNPJ, cadeado de segurança)
- [x] Hero section com CTA principal
- [x] Bloco de confiança com ícones e benefícios
- [x] Seção de prova social (depoimentos)
- [x] FAQ em formato acordeão
- [x] Rodapé com informações da empresa

## Simulador de Crédito
- [x] Wizard de 3 passos (Quem é você / Dados básicos / Resultado)
- [x] Passo 1: Seleção de tipo de servidor (municipal/estadual/INSS)
- [x] Passo 2: Formulário com dados básicos (nascimento, margem disponível)
- [x] Passo 3: Tela de resultado com valores simulados
- [x] Opções de prazo (24, 36, 48, 60, 72, 84, 96 meses)
- [x] Validação de campos e feedback visual
- [x] Máscaras para campos de data

## Integração WhatsApp
- [x] Botão de finalização via WhatsApp
- [x] Mensagem pré-preenchida com dados da simulação
- [x] Link direto para WhatsApp com parâmetros

## UX e Acessibilidade
- [x] Contraste adequado (WCAG 4.5:1)
- [x] Campos grandes e espaçados para mobile
- [x] Micro-feedback em cada passo do simulador
- [x] Loading states e animações sutis
- [x] Textos em linguagem simples e direta

## Otimização e Tracking
- [x] Meta tags para SEO
- [x] Open Graph tags para compartilhamento
- [x] Preparar estrutura para eventos de tracking (ViewContent, Lead, Contact)

## Melhorias UX/UI - Fintechs Mundiais

### Jornada e Navegação
- [x] Indicador de progresso mais visual no simulador
- [x] Botão "Voltar" sempre visível em todas as etapas
- [x] Scroll automático suave entre seções
- [x] Breadcrumb visual da jornada

### Feedback e Validação
- [x] Validação em tempo real dos campos
- [x] Mensagens de erro amigáveis e contextuais
- [x] Loading states com mensagens tranquilizadoras
- [x] Confirmação visual ao completar cada passo
- [x] Animações sutis de transição

### Acessibilidade e Simplicidade
- [x] Aumentar tamanho de fonte base (18px+)
- [x] Aumentar área de toque dos botões (min 44px)
- [x] Melhorar contraste de cores
- [x] Adicionar ícones explicativos em todos os campos
- [x] Tooltips com explicações simples
- [x] Remover jargões técnicos

### Confiança e Segurança
- [x] Badge de segurança mais proeminente
- [x] Indicador de "dados não salvos" antes da finalização
- [x] Preview da mensagem do WhatsApp antes de enviar
- [x] Selo de "100% gratuito" mais visível
- [x] Contador de pessoas simulando (social proof dinâmico)

### Mobile-First
- [x] Teclado numérico para campos de valor
- [x] Máscaras de input mais intuitivas
- [ ] Botões fixos no bottom da tela mobile (não implementado - requer JS adicional)
- [x] Reduzir quantidade de informação por tela
- [ ] Gestos de swipe entre passos (não implementado - requer biblioteca adicional)

## Bugs Críticos - QA Testing

### Problemas Identificados
- [x] Logo da Acessus muito pequena (impossível identificar) - Aumentada de h-8/h-10 para h-12/h-16
- [x] Radio buttons só funcionam ao clicar na bolinha (área clicável muito pequena) - Toda a área do card agora é clicável com label
- [x] Select de convênio desalinhado e pequeno - Aumentado para h-16 com texto lg
- [x] Select não segue padrão de fintechs (Nubank) - Itens com py-4 e text-lg
- [x] Resultado da simulação não aparece após preencher dados - Fluxo corrigido no Home.tsx
- [x] Opções de prazo são exibidas no SimulationResult
- [x] Botão de continuar/contratar (WhatsApp) aparece no resultado

## Bugs Adicionais - Teste QA Completo

### Resultado da Simulação
- [x] Verificar se resultado aparece após preencher todos os campos - CORRIGIDO: handleNext chamava setStep(3) mas nunca onComplete
- [x] Testar com valores diferentes (R$ 50,00, R$ 500,00, R$ 1.000,00) - Testado com R$ 1.000,00
- [x] Validar cálculo do valor máximo de empréstimo - R$ 1.000,00 x 61,2 = R$ 61.200,00 correto
- [x] Confirmar que opções de prazo são exibidas - 7 opções (24x, 36x, 48x, 60x, 72x, 84x, 96x)
- [x] Testar botão do WhatsApp com preview da mensagem - Modal com preview completo funcionando

## Nova Feature - Botão Flutuante WhatsApp

### Requisito
- [x] Botão flutuante fixo do WhatsApp na tela de resultado
- [x] Sempre visível no canto inferior direito
- [x] Animação de pulse para chamar atenção
- [x] Funciona em mobile e desktop
- [x] Abre o mesmo modal de preview do WhatsApp
