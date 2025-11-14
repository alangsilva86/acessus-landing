# Análise UX/UI - Acessus Landing Page

## 🎯 Objetivo
Otimizar a jornada para usuários com baixa fluência digital (servidores públicos 45+) aplicando práticas de Nubank, Revolut, Stripe e Wise.

## 📊 Jornada Atual vs Melhorias

### ETAPA 1: Landing (Hero)
**Atual:**
- Título claro e direto ✅
- CTA único ✅
- Passo a passo visual ✅

**Fricções Identificadas:**
- ❌ Falta indicador de "quanto tempo leva"
- ❌ Sem preview do que vem depois
- ❌ CTA pode ser mais proeminente

**Melhorias (Baseado em Nubank/Revolut):**
- ✅ Adicionar "Leva apenas 2 minutos"
- ✅ Badge "Sem cadastro necessário"
- ✅ Animação sutil no CTA (pulse)
- ✅ Ícone de relógio + tempo estimado

---

### ETAPA 2: Simulador - Passo 1 (Quem é você)
**Atual:**
- Radio buttons grandes ✅
- Labels claros ✅

**Fricções Identificadas:**
- ❌ Sem explicação do que é "servidor municipal vs estadual"
- ❌ Falta feedback visual ao selecionar
- ❌ Usuário não sabe se pode voltar
- ❌ Barra de progresso pouco visível

**Melhorias (Baseado em Stripe/Wise):**
- ✅ Tooltips explicativos em cada opção
- ✅ Animação de "check" ao selecionar
- ✅ Barra de progresso mais proeminente com números
- ✅ Botão "Voltar" sempre visível
- ✅ Auto-scroll ao mudar de passo

---

### ETAPA 3: Simulador - Passo 2 (Dados)
**Atual:**
- Máscaras de input ✅
- Labels descritivos ✅

**Fricções Identificadas:**
- ❌ Campo de data pode confundir (formato DD/MM/AAAA)
- ❌ "Margem disponível" é jargão técnico
- ❌ Sem validação em tempo real
- ❌ Teclado não abre como numérico no mobile
- ❌ Sem explicação de onde encontrar a margem

**Melhorias (Baseado em Nubank/Revolut):**
- ✅ Placeholder animado mostrando exemplo
- ✅ Trocar "Margem disponível" por "Quanto você pode descontar por mês"
- ✅ Link "Onde encontro isso?" com modal explicativo
- ✅ Validação inline com ícones (✓ ou ✗)
- ✅ Input type="tel" para teclado numérico
- ✅ Mensagem "Seus dados não são salvos" visível

---

### ETAPA 4: Resultado
**Atual:**
- Valor destacado ✅
- Opções de prazo ✅
- CTA WhatsApp ✅

**Fricções Identificadas:**
- ❌ Usuário pode não entender que é "estimativa"
- ❌ Sem preview da mensagem do WhatsApp
- ❌ Pode ter medo de "se comprometer"
- ❌ Falta comparação (quanto economiza vs outros bancos)

**Melhorias (Baseado em Wise/Revolut):**
- ✅ Animação de "contagem" do valor (efeito contador)
- ✅ Badge "Simulação - Sem compromisso" fixo no topo
- ✅ Modal de preview antes de abrir WhatsApp
- ✅ Comparação visual: "Você economiza R$ X vs banco tradicional"
- ✅ Botão "Salvar resultado por email" (captura de lead)
- ✅ Indicador de "próximo passo" após WhatsApp

---

## 🎨 Melhorias Visuais Globais

### Tipografia (Baseado em Nubank)
- Aumentar base de 16px → 18px
- Títulos com mais peso (700 → 800)
- Line-height maior para leitura (1.5 → 1.7)

### Cores e Contraste
- Aumentar contraste texto/fundo (4.5:1 → 7:1)
- Verde primário mais saturado para CTAs
- Cinza de texto mais escuro (#666 → #333)

### Espaçamento (Baseado em Stripe)
- Aumentar padding de botões (12px → 16px)
- Mais espaço entre seções (64px → 96px)
- Cards com mais breathing room

### Micro-interações (Baseado em Revolut)
- Hover states mais evidentes
- Transições suaves (200ms ease-out)
- Feedback tátil (vibração em mobile)
- Loading skeletons ao invés de spinners

---

## 📱 Mobile-First Específico

### Melhorias Críticas:
1. **Botões fixos no bottom** (como Nubank)
   - CTA principal sempre visível
   - Não precisa scroll para continuar

2. **Teclado contextual**
   - Numérico para valores
   - Data picker nativo para nascimento

3. **Gestos naturais**
   - Swipe para voltar/avançar
   - Pull-to-refresh para refazer

4. **Redução cognitiva**
   - Um campo por vez (progressive disclosure)
   - Menos texto, mais ícones

---

## 🔒 Confiança e Segurança

### Elementos de Trust (Baseado em Stripe/Wise):
1. Badge SSL mais proeminente
2. Contador em tempo real: "X pessoas simularam hoje"
3. Logos de bancos parceiros (se aplicável)
4. Selo "Correspondente Banco Central"
5. Avaliação 5 estrelas com link para depoimentos

---

## 📈 Métricas de Sucesso

**Antes das melhorias:**
- Taxa de conclusão do simulador: ~40% (estimado)
- Tempo médio: ~3-4 minutos
- Abandono no Passo 2: ~30%

**Meta pós-melhorias:**
- Taxa de conclusão: >65%
- Tempo médio: <2 minutos
- Abandono no Passo 2: <15%

---

## 🚀 Priorização de Implementação

### P0 (Crítico - Implementar agora):
1. Validação inline com feedback visual
2. Tooltips explicativos
3. Barra de progresso melhorada
4. Teclado numérico mobile
5. Preview mensagem WhatsApp

### P1 (Alta prioridade):
6. Animações de transição
7. Loading states melhores
8. Botão fixo mobile
9. Trocar jargões técnicos
10. Badge "Sem compromisso" persistente

### P2 (Desejável):
11. Gestos de swipe
12. Contador de usuários
13. Comparação com bancos
14. Salvar resultado por email
