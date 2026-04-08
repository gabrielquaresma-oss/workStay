# PRD — StayScore: Inteligência Hoteleira para Viajantes Corporativos

**Produto:** StayScore  
**Empresa parceira:** Onfly (Hackathon)  
**Versão:** 1.0  
**Data:** 2026-04-08  
**Autor:** Product Team  
**Status:** Draft  

---

## Sumário

1. [Resumo Executivo](#1-resumo-executivo)
2. [Problema](#2-problema)
3. [Solução](#3-solução)
4. [Personas e Jobs-to-be-Done](#4-personas-e-jobs-to-be-done)
5. [User Stories](#5-user-stories)
6. [Requisitos Funcionais](#6-requisitos-funcionais)
7. [Requisitos Não-Funcionais](#7-requisitos-não-funcionais)
8. [Arquitetura Técnica](#8-arquitetura-técnica)
9. [Wireframes Descritivos](#9-wireframes-descritivos)
10. [Algoritmo do StayScore](#10-algoritmo-do-stayscore)
11. [Métricas de Sucesso (KPIs)](#11-métricas-de-sucesso-kpis)
12. [Roadmap](#12-roadmap)
13. [Riscos e Mitigações](#13-riscos-e-mitigações)
14. [Apêndice: Mapeamento de APIs](#14-apêndice-mapeamento-de-apis)

---

## 1. Resumo Executivo

**StayScore** é uma plataforma de inteligência hoteleira corporativa que resolve um problema ignorado pelas OBTs (Online Booking Tools) tradicionais: hotéis são avaliados para turistas, não para quem viaja a trabalho. Um hotel 4 estrelas com piscina incrível mas Wi-Fi de 5 Mbps é um pesadelo para um consultor que precisa apresentar via Zoom. O StayScore cria um score de produtividade de 0 a 100 que avalia hotéis exclusivamente pela ótica do viajante corporativo — Wi-Fi, mesa de trabalho, silêncio, proximidade de espaços de trabalho — usando análise de sentimento de reviews reais e micro-surveys pós-estadia.

Além do score, o StayScore ataca diretamente o bolso da empresa com um Comparador Inteligente de Datas que mostra ao viajante e ao travel manager que hospedar-se no mesmo hotel dois dias antes pode economizar R$180/noite sem perder produtividade. E com o módulo WorkNearby, resolve o tempo morto entre chegada na cidade e check-in, mapeando coworkings e cafés produtivos num raio de 1km do hotel — transformando 3 horas perdidas em 3 horas de trabalho efetivo.

Para travel managers e gestores financeiros, o Painel de Tendências entrega dados acionáveis: quais hotéis a empresa mais reserva, qual o StayScore médio por cidade, tendências de preço para negociação de tarifas corporativas, e um índice de ROI que correlaciona gasto com hospedagem e produtividade reportada. O StayScore se integra nativamente à API pública da Onfly, funcionando como um produto complementar que agrega valor real ao ecossistema sem depender da codebase interna.

---

## 2. Problema

### 2.1 O viajante corporativo está cego

Plataformas de reserva (incluindo OBTs corporativas) ranqueiam hotéis por preço, estrelas e nota geral. Nenhuma delas responde à pergunta que realmente importa para quem viaja a trabalho: **"Vou conseguir trabalhar bem neste hotel?"**

**Cenário real 1 — O Wi-Fi fantasma:**  
Marina, consultora de gestão da Deloitte, reserva o Mercure Belo Horizonte Lourdes (4 estrelas, nota 4.3 no Google) para 3 noites durante um projeto de due diligence. No check-in, descobre que o Wi-Fi do quarto oscila entre 2-8 Mbps. Sua call com o cliente às 9h do dia seguinte trava 4 vezes. Ela desce ao lobby — Wi-Fi melhor, mas sem privacidade para discutir dados confidenciais. Perde 2 horas tentando resolver com hotspot do celular. O hotel tem 4.3 estrelas porque turistas amam a localização e o café da manhã. Para Marina, foi um desastre.

**Cenário real 2 — O quarto sem mesa:**  
Rafael, gerente de vendas da TOTVS, reserva o Hotel Ibis Paulista para uma noite antes de uma reunião importante. Precisa revisar a proposta comercial de R$2.5M na noite anterior. O quarto tem uma "mesa" de 40cm × 30cm colada na parede, com uma única tomada atrás da TV. Ele trabalha 3 horas sentado na cama com o notebook no colo. Chega à reunião com dor nas costas e uma proposta revisada pela metade.

**Cenário real 3 — O tempo morto:**  
Carla, analista financeira, desembarca em Congonhas às 10h para uma reunião às 14h no Itaim. O check-in do hotel é às 15h. Ela tem 4 horas mortas: não pode ir ao hotel, não conhece nenhum lugar para trabalhar na região. Acaba sentada no Starbucks da Faria Lima com Wi-Fi instável, sem tomada, tentando terminar um relatório no Excel com a tela do notebook a 15% de bateria.

### 2.2 A empresa está desperdiçando dinheiro sem saber

**Cenário real 4 — A tarifa escondida:**  
A empresa de Rafael gasta R$45.000/mês com hospedagens em São Paulo. O travel manager, Pedro, não tem visibilidade de que o Novotel Jaraguá (StayScore 82, R$320/noite) supera consistentemente o Maksoud Plaza (StayScore 67, R$410/noite) em produtividade. São R$90/noite × 15 reservas/mês = R$1.350/mês desperdiçados em um único par de hotéis.

**Cenário real 5 — A inflexibilidade de datas:**  
A reunião de Carla é terça-feira. Ela reserva segunda à noite por R$480. Se reservasse domingo à noite (mesmo hotel, mesma qualidade), pagaria R$290. Ninguém mostrou essa opção a ela.

### 2.3 O travel manager não tem dados

Pedro gerencia 200 viajantes e 500+ reservas/mês. Ele sabe quanto gasta, mas não sabe:
- Quais hotéis realmente funcionam para trabalho
- Se o preço pago reflete a qualidade para o viajante corporativo
- Onde renegociar tarifas com dados concretos
- Se a produtividade dos viajantes é impactada pela hospedagem

Ele negocia tarifas corporativas "no feeling", sem dados comparativos de score de produtividade.

### 2.4 Resumo das dores

| # | Dor | Persona | Impacto |
|---|-----|---------|---------|
| D1 | Não consigo saber se o hotel tem boa estrutura para trabalho antes de reservar | Viajante | Horas perdidas, frustração, queda de produtividade |
| D2 | Chego na cidade e não tenho onde trabalhar antes do check-in | Viajante | 2-4 horas de tempo morto por viagem |
| D3 | Pago mais caro sem saber que datas alternativas seriam mais baratas | Viajante/Manager | Desperdício de R$50-200 por reserva |
| D4 | Não tenho dados de produtividade para negociar tarifas | Travel Manager | Negociações sem embasamento, tarifas acima do necessário |
| D5 | Não consigo correlacionar gasto com hospedagem e produtividade | Gestor Financeiro | ROI invisível, budget sem otimização |

---

## 3. Solução

### 3.1 Pilar 1 — StayScore (Score de Produtividade 0-100)

**Resolve:** D1 (estrutura para trabalho)

**Como funciona:**

1. **Busca de hotel:** O viajante busca "hotéis em Belo Horizonte" no StayScore
2. **Coleta de dados:** O sistema consulta Google Places API (Nearby Search + Place Details) para obter:
   - Reviews textuais (até 5 por hotel)
   - Amenidades listadas
   - Fotos
   - Nota geral do Google
3. **Análise de sentimento:** A Claude API processa cada review extraindo menções a:
   - Wi-Fi/internet (velocidade, estabilidade, qualidade)
   - Estrutura de trabalho (mesa, cadeira, tomada, iluminação)
   - Silêncio/barulho
   - Business center/espaço de trabalho
   - Localização para negócios
4. **Cálculo do score:** Algoritmo pondera os 6 critérios (detalhado na seção 10)
5. **Apresentação:** Cada hotel exibe um badge circular com score 0-100, com breakdown por critério

**Fluxo específico — Busca com StayScore:**
```
Viajante digita "São Paulo - Paulista" 
→ Google Places Text Search retorna 20 hotéis 
→ Para cada hotel: Place Details (reviews + amenities) 
→ Claude API analisa sentimento dos reviews 
→ Google Nearby Search busca coworkings em 1km de cada hotel
→ Algoritmo calcula StayScore 
→ Lista ordenada por StayScore (default) ou preço
→ Viajante vê: [Badge 87] Hotel Tivoli Mofarrej — R$420/noite
                [Badge 82] Novotel SP Jaraguá — R$310/noite  
                [Badge 71] Ibis Paulista — R$195/noite
```

**Micro-survey pós-estadia (alimenta o score ao longo do tempo):**
```
Após check-out (detectado via Onfly API), envia survey de 4 perguntas:
1. Wi-Fi: "Como foi o Wi-Fi para trabalho?" [1-5 estrelas]
2. Espaço: "Tinha espaço adequado para trabalhar no quarto?" [Sim / Parcial / Não]
3. Silêncio: "Conseguiu se concentrar sem ruído?" [1-5 estrelas]
4. Recomendação: "Recomendaria para outro viajante a trabalho?" [Sim / Talvez / Não]
```
Tempo estimado: 30 segundos. Enviado 24h após check-out. Sem survey, score depende 100% dos dados do Google.

### 3.2 Pilar 2 — Comparador Inteligente de Datas

**Resolve:** D3 (economia com datas flexíveis)

**Como funciona:**

1. **Viajante seleciona hotel e datas:** ex. Novotel Jaraguá, check-in 15/abr, check-out 16/abr (1 noite)
2. **Sistema busca variação de preço:** Consulta preço médio do hotel para ±3 dias úteis (11-21/abr, excluindo sábados/domingos quando aplicável)
3. **Heatmap visual:** Calendário com cores (verde = mais barato, vermelho = mais caro) mostrando:
   ```
   Seg 13: R$290 🟢   Ter 14: R$340 🟡   Qua 15: R$480 🔴   Qui 16: R$380 🟡   Sex 17: R$310 🟢
   ```
4. **Sugestão automática:** "Se você hospedar-se segunda 13/abr em vez de quarta 15/abr, economiza R$190 no mesmo hotel (StayScore 82)"
5. **Alternativas:** "O Hotel Mercure Savassi (StayScore 85) custa R$280 na quarta 15/abr — economia de R$200 com score superior"
6. **Economia projetada:** "Economia estimada: R$190/noite. Em 12 viagens/ano, isso representa R$2.280 de economia anual"

**Nota importante sobre dados de preço:**  
Na versão MVP (hackathon), os preços serão simulados com base em dados realistas (médias de mercado por categoria de hotel e cidade). A Onfly API pública não expõe endpoint de pesquisa de tarifas em tempo real. O comparador demonstra a UX e o algoritmo de sugestão. Em produção, a integração com parceiros de tarifas (Omnibees, HotelBeds) forneceria dados reais.

### 3.3 Pilar 3 — WorkNearby (Coworkings de Proximidade)

**Resolve:** D2 (tempo morto antes do check-in)

**Como funciona:**

1. **Busca automática:** Ao visualizar um hotel, o sistema automaticamente busca via Google Places Nearby Search:
   - Coworkings num raio de 1km (type: `coworking_space`)
   - Cafés com estrutura para trabalho num raio de 1km (type: `cafe`, filtrado por reviews mencionando "trabalho", "wifi", "tomada")
2. **Mapa integrado:** Mapa do Google Maps mostrando:
   - Pin roxo: hotel selecionado
   - Pins azuis: coworkings
   - Pins verdes: cafés produtivos
   - Círculo de raio de 1km
3. **Card de cada espaço:**
   - Nome, endereço, distância a pé (Google Maps)
   - Horário de funcionamento
   - Nota do Google
   - Indicadores: Wi-Fi | Tomadas | Silencioso (extraídos de reviews)
4. **Sugestão contextual pré-check-in:**
   - Se o viajante tem reserva via Onfly com check-in às 15h e chega na cidade às 10h (detectado por data da reserva):
   ```
   "Seu check-in é às 15h. O WeWork Savassi fica a 400m do hotel e abre às 8h. 
    Day pass: ~R$89. Nota: 4.6. Wi-Fi: excelente."
   ```

### 3.4 Painel de Tendências (Travel Manager Dashboard)

**Resolve:** D4 e D5 (dados para negociação e ROI)

**Componentes:**

1. **Hotéis mais usados:** Ranking dos 10 hotéis mais reservados pela empresa (dados da Onfly API), com StayScore médio de cada um
2. **Mapa de calor por cidade:** Mapa do Brasil com círculos proporcionais ao gasto, coloridos pelo StayScore médio (vermelho = alto gasto + baixo score, verde = bom equilíbrio)
3. **Tendências de preço:** Gráfico de linhas mostrando evolução de tarifa média dos top 10 hotéis nas últimas 12 semanas
4. **Insights automáticos:** Cards gerados por IA:
   - "Hotel Mercure Lourdes BH tem StayScore 85 e custa R$25/noite menos que o Ouro Minas (Score 72). 8 colaboradores reservaram Ouro Minas este mês."
   - "Tarifas em SP subiram 12% nas últimas 4 semanas. Considere negociar tarifa fixa com Novotel Jaraguá (15 reservas/mês)."
   - "3 viajantes reportaram Wi-Fi ruim no Ibis Budget Confins. StayScore caiu de 68 para 61."
5. **Índice de ROI:** Correlação entre StayScore médio das reservas e satisfação reportada via micro-survey. Exemplo: "Equipes que se hospedam em hotéis StayScore 80+ reportam 23% mais satisfação com produtividade."

---

## 4. Personas e Jobs-to-be-Done

### 4.1 Persona 1 — Viajante Corporativo

**Perfil:** Marina Oliveira, 32 anos, consultora de gestão  
**Empresa:** Consultoria Big4 em São Paulo  
**Padrão:** 8-12 viagens/mês, 2-3 noites cada, cidades: SP, BH, RJ, BSB  
**Dor principal:** Perda de produtividade por hospedagem inadequada  

**Jobs-to-be-Done:**

| # | JTBD |
|---|------|
| J1 | Quando estou escolhendo um hotel para uma viagem de trabalho, eu quero saber se o Wi-Fi é confiável para videochamadas, para que eu não passe vergonha em calls com o cliente |
| J2 | Quando chego na cidade 4 horas antes do check-in, eu quero encontrar um lugar próximo para trabalhar, para que eu não perca tempo produtivo |
| J3 | Quando tenho flexibilidade de 1-2 dias na data da viagem, eu quero saber qual dia é mais barato para o mesmo hotel, para que eu economize o budget da equipe |
| J4 | Quando termino uma estadia, eu quero reportar rapidamente a qualidade do hotel para trabalho, para que colegas futuros não sofram os mesmos problemas |
| J5 | Quando estou comparando hotéis, eu quero ver rapidamente qual tem melhor estrutura para trabalho, para que eu decida em menos de 2 minutos |

### 4.2 Persona 2 — Travel Manager

**Perfil:** Pedro Santos, 40 anos, Corporate Travel Manager  
**Empresa:** Empresa de tecnologia mid-market (500 funcionários, 200 viajantes ativos)  
**Padrão:** Gerencia 500+ reservas/mês, budget de R$250.000/mês em hospedagens  
**Dor principal:** Sem dados de qualidade produtiva para otimizar gastos  

**Jobs-to-be-Done:**

| # | JTBD |
|---|------|
| J6 | Quando estou negociando tarifas corporativas com redes hoteleiras, eu quero ter dados de produtividade por hotel, para que eu negocie com embasamento (ex: "seu hotel tem score 67, o concorrente tem 85 por preço menor") |
| J7 | Quando um viajante reclama de um hotel, eu quero verificar o StayScore e os surveys, para que eu tome decisão baseada em dados e não em uma reclamação isolada |
| J8 | Quando estou planejando o budget trimestral, eu quero ver tendências de preço por cidade e hotel, para que eu projete gastos com mais precisão |
| J9 | Quando preciso justificar gastos para a diretoria, eu quero mostrar a correlação entre qualidade da hospedagem e satisfação/produtividade dos viajantes, para que investimentos em hotéis melhores sejam vistos como ROI e não como custo |
| J10 | Quando quero criar uma política de hospedagem, eu quero definir um StayScore mínimo aceitável por faixa de preço, para que os viajantes tenham liberdade dentro de parâmetros claros |

### 4.3 Persona 3 — Gestor Financeiro

**Perfil:** Carla Mendes, 45 anos, CFO  
**Empresa:** Mesma empresa de Pedro  
**Padrão:** Revisa relatórios mensais, aprova budgets trimestrais  
**Dor principal:** Hospedagem é custo opaco sem visibilidade de retorno  

**Jobs-to-be-Done:**

| # | JTBD |
|---|------|
| J11 | Quando reviso o relatório mensal de T&E, eu quero ver quanto economizamos com sugestões do StayScore, para que eu quantifique o ROI da ferramenta |
| J12 | Quando comparo gastos entre trimestres, eu quero entender se o aumento de custo veio com aumento de produtividade, para que eu não corte budget que gera valor |
| J13 | Quando apresento ao board, eu quero um dashboard executivo com gasto × produtividade por cidade, para que a decisão de budget de viagens seja data-driven |

---

## 5. User Stories

### Pilar 1 — StayScore

| ID | Prioridade | User Story |
|----|-----------|------------|
| US-01 | P0 | Como viajante, eu quero buscar hotéis por cidade e ver o StayScore de cada um, para que eu escolha o mais produtivo para trabalho |
| US-02 | P0 | Como viajante, eu quero ver o breakdown do StayScore (Wi-Fi, mesa, silêncio, etc.), para que eu entenda os pontos fortes e fracos de cada hotel |
| US-03 | P0 | Como viajante, eu quero ver reviews filtrados por menções a trabalho/Wi-Fi/produtividade, para que eu leia apenas o que importa para mim |
| US-04 | P1 | Como viajante, eu quero responder um micro-survey de 30 segundos após o check-out, para que minha experiência ajude colegas futuros |
| US-05 | P1 | Como viajante, eu quero filtrar hotéis por StayScore mínimo (ex: apenas score > 75), para que eu veja só opções que atendem meu padrão |
| US-06 | P2 | Como viajante, eu quero receber uma notificação push com os 3 melhores hotéis StayScore para minha próxima viagem (baseado em reserva confirmada na Onfly), para que eu não precise buscar manualmente |

### Pilar 2 — Comparador Inteligente de Datas

| ID | Prioridade | User Story |
|----|-----------|------------|
| US-07 | P0 | Como viajante, eu quero ver um heatmap de preços para ±3 dias da minha data pretendida, para que eu identifique visualmente o dia mais barato |
| US-08 | P0 | Como viajante, eu quero receber uma sugestão automática de data mais barata com score igual ou superior, para que eu economize sem perder produtividade |
| US-09 | P1 | Como viajante, eu quero ver hotéis alternativos mais baratos com score igual ou melhor, para que eu tenha mais opções de economia |
| US-10 | P1 | Como travel manager, eu quero ver a economia projetada anual baseada nas sugestões aceitas, para que eu reporte o impacto financeiro |

### Pilar 3 — WorkNearby

| ID | Prioridade | User Story |
|----|-----------|------------|
| US-11 | P0 | Como viajante, eu quero ver coworkings e cafés produtivos num raio de 1km do hotel no mapa, para que eu saiba onde trabalhar fora do hotel |
| US-12 | P0 | Como viajante, eu quero ver informações de cada coworking (horário, nota, distância), para que eu decida onde ir sem pesquisar no Google |
| US-13 | P1 | Como viajante, eu quero receber uma sugestão contextual de coworking quando há gap entre minha chegada e o check-in, para que eu aproveite o tempo |
| US-14 | P2 | Como viajante, eu quero reservar um day pass de coworking diretamente pelo StayScore, para que eu resolva tudo em um lugar |

### Painel de Tendências

| ID | Prioridade | User Story |
|----|-----------|------------|
| US-15 | P1 | Como travel manager, eu quero ver os top 10 hotéis mais reservados pela empresa com StayScore médio, para que eu identifique quais manter e quais substituir |
| US-16 | P1 | Como travel manager, eu quero ver um mapa de calor de gasto × score por cidade, para que eu priorize cidades com pior relação custo-produtividade |
| US-17 | P1 | Como travel manager, eu quero ver insights automáticos (ex: "Hotel X é mais barato e tem score maior que o Y"), para que eu aja sem precisar analisar manualmente |
| US-18 | P2 | Como travel manager, eu quero ver tendências de preço das últimas 12 semanas por hotel, para que eu negocie tarifas no momento certo |
| US-19 | P2 | Como gestor financeiro, eu quero ver um índice de ROI (gasto com hospedagem × satisfação reportada), para que eu justifique o budget de viagens |
| US-20 | P2 | Como travel manager, eu quero exportar o relatório de tendências em PDF, para que eu apresente à diretoria |

---

## 6. Requisitos Funcionais

### 6.1 Módulo: Autenticação e Autorização

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-01 | Login via credenciais Onfly (OAuth ou token) | Usuário loga com email/senha da Onfly; sistema obtém access token da API pública; sessão dura 24h com refresh automático |
| RF-02 | Três perfis de acesso: viajante, travel manager, gestor financeiro | Viajante vê apenas seus dados e busca; Travel manager vê dados de todos os viajantes da empresa; Gestor vê dashboards financeiros |
| RF-03 | Mapeamento automático do perfil Onfly para perfil StayScore | Ao logar, sistema consulta `/users/me` da Onfly API e determina perfil baseado em `role` retornado |

### 6.2 Módulo: Busca de Hotéis e StayScore

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-04 | Busca por cidade/região | Input de texto com autocomplete; ao confirmar, retorna lista de hotéis com StayScore; tempo de resposta < 5s para 20 hotéis |
| RF-05 | Cálculo do StayScore por hotel | Score numérico 0-100 calculado conforme algoritmo da seção 10; exibido como badge circular; breakdown acessível em 1 clique |
| RF-06 | Exibição de breakdown do score | Ao clicar no badge, mostra os 6 critérios com nota individual (0-100) e barra de progresso visual; destaca critérios com nota < 50 em vermelho |
| RF-07 | Filtragem de reviews por produtividade | Reviews do Google são filtrados por menções a termos de trabalho (wifi, mesa, trabalho, escritório, silêncio, barulho, reunião); exibidos em seção separada "O que viajantes a trabalho dizem" |
| RF-08 | Ordenação da lista de hotéis | Opções: StayScore (maior→menor, default), Preço (menor→maior), Melhor custo-benefício (score/preço) |
| RF-09 | Filtro por StayScore mínimo | Slider ou input numérico de 0-100; filtra em tempo real; persiste na sessão |
| RF-10 | Filtro por faixa de preço | Slider duplo (min-max) em reais; filtra em tempo real |
| RF-11 | Cache de StayScore por hotel | Score calculado é armazenado no banco com TTL de 7 dias; após TTL, recalcula na próxima busca; micro-surveys são incorporados em tempo real |

### 6.3 Módulo: Detalhe do Hotel

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-12 | Página de detalhe do hotel | Exibe: nome, endereço, foto principal, StayScore (badge grande), breakdown dos 6 critérios, reviews filtrados, mapa, WorkNearby, comparador de datas |
| RF-13 | Galeria de fotos | Até 10 fotos do Google Places; se disponível, destaca fotos de quartos e espaço de trabalho |
| RF-14 | Informações de amenidades | Lista de amenidades do Google Places formatadas com ícones; destaque visual para amenidades relevantes: Wi-Fi, business center, sala de reunião |
| RF-15 | Link para reservar na Onfly | Botão "Reservar na Onfly" com deep link para a plataforma Onfly (ou link genérico se deep link não disponível) |

### 6.4 Módulo: Comparador Inteligente de Datas

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-16 | Seleção de datas pretendidas | Date picker para check-in e check-out; formato BR (dd/mm/aaaa) |
| RF-17 | Heatmap de preços | Exibe calendário de 7 dias (±3 dias úteis da data selecionada); cada dia colorido: verde (< 80% do preço selecionado), amarelo (80-100%), vermelho (> 100%); preço exibido dentro de cada célula |
| RF-18 | Sugestão automática de data mais barata | Card destacado: "Economize R$XX hospedando-se em [data alternativa]"; só sugere se economia > R$30 e StayScore da alternativa >= score original |
| RF-19 | Sugestão de hotéis alternativos | Lista de até 3 hotéis alternativos na mesma região com: preço menor E StayScore >= StayScore original; economia calculada por noite |
| RF-20 | Cálculo de economia projetada | Baseado no histórico de viagens do viajante (Onfly API): "Se você aplicasse essa economia em todas as 12 viagens do último ano, teria economizado R$X.XXX" |

### 6.5 Módulo: WorkNearby

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-21 | Busca automática de coworkings | Ao carregar detalhe do hotel, busca via Google Places Nearby Search: type `coworking_space` em raio de 1000m; exibe até 10 resultados |
| RF-22 | Busca de cafés produtivos | Google Places Nearby Search: type `cafe` em raio de 1000m; filtra por reviews com menções a trabalho/wifi/tomada via análise de sentimento; exibe até 5 resultados |
| RF-23 | Mapa integrado | Google Maps JavaScript API com pins diferenciados: roxo (hotel), azul (coworking), verde (café); zoom padrão que enquadre todos os pins; interativo (clique no pin abre card) |
| RF-24 | Card de espaço de trabalho | Cada resultado exibe: nome, distância a pé (metros), nota Google, horário de funcionamento, indicadores (Wi-Fi/Tomadas/Silencioso), foto thumbnail |
| RF-25 | Sugestão contextual pré-check-in | Se há reserva na Onfly com check-in posterior à data de chegada estimada: banner no topo "Chega antes do check-in? WorkNearby sugere: [coworking mais próximo com nota > 4.0]" |

### 6.6 Módulo: Micro-Survey Pós-Estadia

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-26 | Detecção de estadia concluída | Sistema consulta Onfly API periodicamente (cron 1x/dia) buscando reservas com check-out no dia anterior |
| RF-27 | Envio de survey | 24h após check-out detectado, exibe banner na tela principal do StayScore para o viajante; 4 perguntas conforme definido na seção 3.1 |
| RF-28 | Coleta e armazenamento | Respostas salvas no banco vinculadas a hotel + viajante + data; timestamp de resposta |
| RF-29 | Incorporação no StayScore | Respostas de surveys são incorporadas no cálculo do score (detalhado na seção 10); mínimo 1 survey para começar a influenciar o score; peso cresce com volume de respostas |

### 6.7 Módulo: Painel de Tendências

| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RF-30 | Top 10 hotéis da empresa | Lista ordenada por número de reservas (dados Onfly API); cada item mostra: nome, cidade, número de reservas, gasto total, StayScore médio |
| RF-31 | Mapa de calor por cidade | Mapa do Brasil (Google Maps) com overlay de círculos: tamanho proporcional ao gasto total na cidade; cor baseada no StayScore médio da cidade (vermelho <60, amarelo 60-79, verde 80+) |
| RF-32 | Tendências de preço | Gráfico de linhas (últimas 12 semanas) para os top 5 hotéis; eixo Y = preço médio/noite, eixo X = semana; tooltip com valor exato |
| RF-33 | Insights automáticos | Mínimo 3 insights gerados por IA (Claude API) analisando os dados do painel; formato de card com ícone + texto acionável; atualizados semanalmente |
| RF-34 | Índice de ROI | Cálculo: (média StayScore dos hotéis reservados × satisfação média dos surveys) / gasto médio por noite × 100; exibido como score com tendência (seta para cima/baixo vs. período anterior) |

---

## 7. Requisitos Não-Funcionais

### 7.1 Performance

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-01 | Tempo de carregamento da busca de hotéis (20 resultados com StayScore) | < 5 segundos no P95 |
| RNF-02 | Tempo de carregamento da página de detalhe do hotel | < 3 segundos no P95 |
| RNF-03 | Tempo de resposta do micro-survey (submit) | < 1 segundo |
| RNF-04 | Tempo de carregamento do painel de tendências | < 4 segundos no P95 |
| RNF-05 | Cache de StayScore | TTL de 7 dias; cache hit > 80% em operação normal |

### 7.2 Segurança

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-06 | Autenticação segura | Token JWT com httpOnly cookies; refresh token com rotação |
| RNF-07 | Proteção de API keys | Todas as chaves de API (Google, Claude, Onfly) armazenadas em variáveis de ambiente; nunca expostas ao frontend |
| RNF-08 | Rate limiting | Máximo 100 requests/minuto por usuário; 1000 requests/minuto por empresa |
| RNF-09 | Isolamento de dados entre empresas | Queries sempre filtradas por `company_id`; nenhum endpoint retorna dados de outra empresa |
| RNF-10 | HTTPS obrigatório | Todo tráfego via HTTPS; redirect automático de HTTP |
| RNF-11 | Sanitização de inputs | Todos os inputs do usuário sanitizados contra XSS e SQL injection; Prisma ORM previne SQL injection por padrão |

### 7.3 Escalabilidade

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-12 | Usuários simultâneos | Suportar 500 usuários simultâneos na fase 1 |
| RNF-13 | Volume de dados | Suportar 100.000 registros de StayScore e 50.000 surveys sem degradação |
| RNF-14 | API do Google Places | Otimizar chamadas com cache agressivo; batch requests quando possível; budget estimado: $200/mês |

### 7.4 Acessibilidade

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-15 | WCAG 2.1 nível AA | Contraste adequado, navegação por teclado, alt text em imagens |
| RNF-16 | Responsividade | Layout funcional em desktop (1280px+), tablet (768px+) e mobile (375px+) |
| RNF-17 | Idioma | Português brasileiro como idioma único na fase 1 |

---

## 8. Arquitetura Técnica

### 8.1 Estrutura de Pastas do Next.js

```
stayscore/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   ├── migrations/                # Migrações automáticas do Prisma
│   └── seed.ts                    # Seed com dados de demonstração
├── public/
│   ├── icons/                     # Ícones SVG customizados
│   └── images/                    # Imagens estáticas
├── src/
│   ├── app/                       # App Router (Next.js 14+)
│   │   ├── layout.tsx             # Layout raiz (fontes, providers, navbar)
│   │   ├── page.tsx               # Landing page / redirect para /search
│   │   ├── globals.css            # Estilos globais + Tailwind
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Página de login
│   │   │   └── callback/
│   │   │       └── page.tsx       # Callback OAuth Onfly
│   │   ├── (app)/                 # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx         # Layout com sidebar/navbar autenticado
│   │   │   ├── search/
│   │   │   │   └── page.tsx       # Busca de hotéis com StayScore
│   │   │   ├── hotel/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Detalhe do hotel (score, mapa, WorkNearby, comparador)
│   │   │   ├── survey/
│   │   │   │   └── [bookingId]/
│   │   │   │       └── page.tsx   # Micro-survey pós-estadia
│   │   │   └── dashboard/
│   │   │       └── page.tsx       # Painel de tendências (travel manager)
│   │   └── api/                   # API Routes (Route Handlers)
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts   # POST: autenticar com Onfly
│   │       │   ├── callback/
│   │       │   │   └── route.ts   # GET: callback OAuth
│   │       │   ├── me/
│   │       │   │   └── route.ts   # GET: dados do usuário logado
│   │       │   └── logout/
│   │       │       └── route.ts   # POST: logout
│   │       ├── hotels/
│   │       │   ├── search/
│   │       │   │   └── route.ts   # GET: busca hotéis + StayScore
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts       # GET: detalhe do hotel + score
│   │       │   │   ├── score/
│   │       │   │   │   └── route.ts   # GET: breakdown do score
│   │       │   │   ├── reviews/
│   │       │   │   │   └── route.ts   # GET: reviews filtrados
│   │       │   │   └── nearby/
│   │       │   │       └── route.ts   # GET: coworkings e cafés próximos
│   │       │   └── compare/
│   │       │       └── route.ts   # POST: comparar datas/hotéis
│   │       ├── surveys/
│   │       │   ├── route.ts       # POST: salvar survey / GET: listar pendentes
│   │       │   └── [id]/
│   │       │       └── route.ts   # GET: survey específico
│   │       ├── dashboard/
│   │       │   ├── top-hotels/
│   │       │   │   └── route.ts   # GET: top hotéis da empresa
│   │       │   ├── heatmap/
│   │       │   │   └── route.ts   # GET: dados do mapa de calor
│   │       │   ├── trends/
│   │       │   │   └── route.ts   # GET: tendências de preço
│   │       │   └── insights/
│   │       │       └── route.ts   # GET: insights automáticos
│   │       └── onfly/
│   │           ├── bookings/
│   │           │   └── route.ts   # GET: reservas do usuário/empresa
│   │           └── users/
│   │               └── route.ts   # GET: dados do usuário Onfly
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── skeleton.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx         # Barra de navegação superior
│   │   │   ├── sidebar.tsx        # Menu lateral (dashboard)
│   │   │   └── footer.tsx
│   │   ├── hotel/
│   │   │   ├── hotel-card.tsx     # Card de hotel na lista de busca
│   │   │   ├── hotel-list.tsx     # Lista de hotéis com filtros
│   │   │   ├── stayscore-badge.tsx    # Badge circular do score
│   │   │   ├── score-breakdown.tsx    # Breakdown dos 6 critérios
│   │   │   ├── review-list.tsx        # Lista de reviews filtrados
│   │   │   └── amenity-list.tsx       # Lista de amenidades
│   │   ├── compare/
│   │   │   ├── date-heatmap.tsx       # Heatmap de preços por data
│   │   │   ├── date-suggestion.tsx    # Card de sugestão de data
│   │   │   └── alternative-hotels.tsx # Lista de hotéis alternativos
│   │   ├── worknearby/
│   │   │   ├── nearby-map.tsx         # Mapa com hotel + coworkings
│   │   │   ├── workspace-card.tsx     # Card de coworking/café
│   │   │   └── workspace-list.tsx     # Lista de espaços de trabalho
│   │   ├── survey/
│   │   │   ├── survey-form.tsx        # Formulário do micro-survey
│   │   │   └── survey-banner.tsx      # Banner "Avalie sua estadia"
│   │   └── dashboard/
│   │       ├── top-hotels-table.tsx   # Tabela de top hotéis
│   │       ├── city-heatmap.tsx       # Mapa de calor por cidade
│   │       ├── price-trends-chart.tsx # Gráfico de tendências
│   │       ├── insight-card.tsx       # Card de insight automático
│   │       └── roi-index.tsx          # Widget do índice de ROI
│   ├── lib/
│   │   ├── prisma.ts              # Cliente Prisma singleton
│   │   ├── auth.ts                # Helpers de autenticação
│   │   ├── onfly-client.ts        # Client wrapper para Onfly API
│   │   ├── google-places.ts       # Client wrapper para Google Places API
│   │   ├── claude-client.ts       # Client wrapper para Claude API
│   │   ├── stayscore-calculator.ts    # Algoritmo do StayScore
│   │   ├── sentiment-analyzer.ts      # Análise de sentimento via Claude
│   │   ├── price-simulator.ts         # Simulador de preços (MVP)
│   │   └── utils.ts                   # Funções utilitárias
│   ├── hooks/
│   │   ├── use-auth.ts            # Hook de autenticação
│   │   ├── use-hotel-search.ts    # Hook de busca de hotéis
│   │   ├── use-stayscore.ts       # Hook de StayScore
│   │   └── use-nearby.ts          # Hook de WorkNearby
│   └── types/
│       ├── hotel.ts               # Tipos de hotel e score
│       ├── survey.ts              # Tipos de survey
│       ├── onfly.ts               # Tipos da Onfly API
│       ├── google-places.ts       # Tipos do Google Places
│       └── dashboard.ts           # Tipos do dashboard
├── .env.local                     # Variáveis de ambiente (não commitado)
├── .env.example                   # Template de variáveis
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 8.2 Schema do Banco de Dados (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USUÁRIOS ====================

model User {
  id            String    @id @default(cuid())
  onfly_id      String    @unique           // ID do usuário na Onfly
  email         String    @unique
  name          String
  role          UserRole  @default(TRAVELER)
  company_id    String
  company       Company   @relation(fields: [company_id], references: [id])
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  surveys       Survey[]
  searches      SearchLog[]

  @@index([company_id])
  @@index([onfly_id])
}

model Company {
  id            String    @id @default(cuid())
  onfly_id      String    @unique           // ID da empresa na Onfly
  name          String
  created_at    DateTime  @default(now())

  users         User[]
  bookings      Booking[]

  @@index([onfly_id])
}

enum UserRole {
  TRAVELER
  TRAVEL_MANAGER
  FINANCE_MANAGER
  ADMIN
}

// ==================== HOTÉIS E SCORES ====================

model Hotel {
  id                String    @id @default(cuid())
  google_place_id   String    @unique           // ID do Google Places
  name              String
  address           String
  city              String
  state             String
  latitude          Float
  longitude         Float
  google_rating     Float?                      // Nota geral do Google (1-5)
  google_total_reviews Int?                     // Total de reviews no Google
  photo_references  String[]                    // Array de photo references do Google
  amenities         Json?                       // JSON de amenidades do Google
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  scores            StayScore[]
  reviews           HotelReview[]
  surveys           Survey[]
  bookings          Booking[]
  nearby_workspaces NearbyWorkspace[]
  price_entries     PriceEntry[]

  @@index([city, state])
  @@index([google_place_id])
}

model StayScore {
  id                  String    @id @default(cuid())
  hotel_id            String
  hotel               Hotel     @relation(fields: [hotel_id], references: [id])
  
  // Score total (0-100)
  total_score         Float
  
  // Sub-scores (0-100 cada)
  wifi_score          Float     // Qualidade do Wi-Fi
  workspace_room_score Float    // Estrutura no quarto
  workspace_hotel_score Float   // Espaço de trabalho no hotel
  coworking_proximity_score Float // Proximidade de coworkings
  price_productivity_score Float  // Relação preço x produtividade
  traveler_rating_score Float     // Avaliação dos viajantes corp.
  
  // Metadata
  reviews_analyzed    Int       // Quantos reviews foram analisados
  surveys_count       Int       @default(0) // Quantos surveys incorporados
  data_sources        Json      // {"google_reviews": 5, "surveys": 3, "amenities": true}
  
  calculated_at       DateTime  @default(now())
  expires_at          DateTime                  // TTL de 7 dias
  
  @@unique([hotel_id, calculated_at])
  @@index([hotel_id])
  @@index([expires_at])
}

model HotelReview {
  id                String    @id @default(cuid())
  hotel_id          String
  hotel             Hotel     @relation(fields: [hotel_id], references: [id])
  
  google_review_id  String?   @unique         // ID único do review no Google
  author_name       String
  rating            Float                     // 1-5
  text              String                    // Texto completo do review
  publish_time      DateTime?
  language          String?                   // "pt", "en", etc.
  
  // Análise de sentimento (resultado da Claude API)
  sentiment_analysis Json?     // {"wifi": {"score": 0.8, "mentions": ["wifi rápido"]}, ...}
  is_work_relevant   Boolean   @default(false) // Se menciona trabalho/wifi/produtividade
  work_relevance_score Float?  // 0-1: quão relevante é para viajante corporativo
  
  analyzed_at       DateTime?
  created_at        DateTime  @default(now())

  @@index([hotel_id])
  @@index([is_work_relevant])
}

// ==================== SURVEYS ====================

model Survey {
  id            String    @id @default(cuid())
  hotel_id      String
  hotel         Hotel     @relation(fields: [hotel_id], references: [id])
  user_id       String
  user          User      @relation(fields: [user_id], references: [id])
  booking_id    String?
  booking       Booking?  @relation(fields: [booking_id], references: [id])
  
  // Respostas (4 perguntas)
  wifi_rating         Int       // 1-5
  workspace_adequate  WorkspaceAdequacy // SIM, PARCIAL, NAO
  silence_rating      Int       // 1-5
  would_recommend     Recommendation    // SIM, TALVEZ, NAO
  
  // Metadata
  responded_at  DateTime  @default(now())
  stay_date     DateTime                   // Data da estadia

  @@unique([hotel_id, user_id, stay_date])
  @@index([hotel_id])
  @@index([user_id])
}

enum WorkspaceAdequacy {
  SIM
  PARCIAL
  NAO
}

enum Recommendation {
  SIM
  TALVEZ
  NAO
}

// ==================== RESERVAS (Onfly) ====================

model Booking {
  id              String    @id @default(cuid())
  onfly_booking_id String   @unique           // ID da reserva na Onfly
  company_id      String
  company         Company   @relation(fields: [company_id], references: [id])
  hotel_id        String?
  hotel           Hotel?    @relation(fields: [hotel_id], references: [id])
  
  hotel_name      String                      // Nome original da Onfly
  city            String
  check_in        DateTime
  check_out       DateTime
  total_price     Float                       // Em reais
  price_per_night Float
  status          BookingStatus
  
  synced_at       DateTime  @default(now())
  
  surveys         Survey[]

  @@index([company_id])
  @@index([hotel_id])
  @@index([check_in])
  @@index([status])
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
}

// ==================== WORKNEARBY ====================

model NearbyWorkspace {
  id                String    @id @default(cuid())
  hotel_id          String
  hotel             Hotel     @relation(fields: [hotel_id], references: [id])
  
  google_place_id   String
  name              String
  type              WorkspaceType
  address           String
  latitude          Float
  longitude         Float
  distance_meters   Int                       // Distância do hotel em metros
  google_rating     Float?
  total_reviews     Int?
  
  // Horário de funcionamento
  opening_hours     Json?     // {"monday": "08:00-22:00", ...}
  
  // Indicadores de produtividade
  has_wifi          Boolean   @default(false)
  has_power_outlets Boolean   @default(false)
  is_quiet          Boolean   @default(false)
  
  photo_reference   String?
  
  cached_at         DateTime  @default(now())
  expires_at        DateTime                  // TTL de 14 dias

  @@unique([hotel_id, google_place_id])
  @@index([hotel_id])
  @@index([type])
}

enum WorkspaceType {
  COWORKING
  CAFE
}

// ==================== PREÇOS (Simulados no MVP) ====================

model PriceEntry {
  id            String    @id @default(cuid())
  hotel_id      String
  hotel         Hotel     @relation(fields: [hotel_id], references: [id])
  
  date          DateTime  @db.Date          // Data da diária
  price         Float                       // Preço em reais
  source        PriceSource @default(SIMULATED)
  
  created_at    DateTime  @default(now())

  @@unique([hotel_id, date, source])
  @@index([hotel_id, date])
}

enum PriceSource {
  SIMULATED
  ONFLY_HISTORICAL
  EXTERNAL
}

// ==================== LOGS E ANALYTICS ====================

model SearchLog {
  id            String    @id @default(cuid())
  user_id       String
  user          User      @relation(fields: [user_id], references: [id])
  
  query         String                        // Texto da busca
  city          String?
  filters       Json?                         // {"min_score": 75, "max_price": 400}
  results_count Int
  
  created_at    DateTime  @default(now())

  @@index([user_id])
  @@index([created_at])
}
```

### 8.3 Endpoints da API Interna

#### Autenticação

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| POST | `/api/auth/login` | `{ email: string, password: string }` | `{ token: string, user: { id, name, email, role } }` | Login com credenciais Onfly |
| GET | `/api/auth/me` | Header: `Authorization: Bearer <token>` | `{ id, name, email, role, company: { id, name } }` | Dados do usuário autenticado |
| POST | `/api/auth/logout` | Header: `Authorization: Bearer <token>` | `{ success: true }` | Logout (invalidar token) |

#### Hotéis e StayScore

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| GET | `/api/hotels/search?q={query}&min_score={0-100}&max_price={number}&sort={stayscore\|price\|value}` | Query params | `{ hotels: [{ id, name, address, city, latitude, longitude, google_rating, photo_url, stayscore: { total, wifi, workspace_room, workspace_hotel, coworking, price_productivity, traveler_rating }, price_per_night }], total: number }` | Buscar hotéis com StayScore |
| GET | `/api/hotels/{id}` | Path param: hotel ID | `{ hotel: { ...full details }, stayscore: { ...breakdown }, reviews: [...], nearby: [...] }` | Detalhe completo do hotel |
| GET | `/api/hotels/{id}/score` | Path param: hotel ID | `{ total: number, breakdown: { wifi: { score, weight, sources }, ... }, calculated_at, expires_at }` | Breakdown detalhado do score |
| GET | `/api/hotels/{id}/reviews?filter=work` | Path param + query | `{ reviews: [{ author, rating, text, sentiment, work_relevance_score, highlights: string[] }], total: number }` | Reviews filtrados por trabalho |
| GET | `/api/hotels/{id}/nearby?types=coworking,cafe&radius=1000` | Path + query params | `{ workspaces: [{ id, name, type, address, distance_meters, rating, opening_hours, indicators: { wifi, power, quiet }, photo_url }] }` | Espaços de trabalho próximos |

#### Comparador de Datas

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| POST | `/api/hotels/compare` | `{ hotel_id: string, check_in: "YYYY-MM-DD", check_out: "YYYY-MM-DD", nights: number }` | `{ original: { date, price }, alternatives: [{ date, price, savings }], heatmap: [{ date, price, color }], best_date: { date, price, savings, stayscore }, alternative_hotels: [{ id, name, price, stayscore, savings }], projected_annual_savings: number }` | Comparar datas e alternativas |

#### Surveys

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| GET | `/api/surveys?status=pending` | Query params | `{ surveys: [{ booking_id, hotel_name, stay_date }] }` | Surveys pendentes do usuário |
| POST | `/api/surveys` | `{ hotel_id: string, booking_id?: string, wifi_rating: 1-5, workspace_adequate: "SIM"\|"PARCIAL"\|"NAO", silence_rating: 1-5, would_recommend: "SIM"\|"TALVEZ"\|"NAO", stay_date: "YYYY-MM-DD" }` | `{ survey: { id }, message: "Obrigado!" }` | Salvar resposta do survey |

#### Dashboard

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| GET | `/api/dashboard/top-hotels?limit=10` | Query params | `{ hotels: [{ id, name, city, bookings_count, total_spent, avg_stayscore, trend: "up"\|"down"\|"stable" }] }` | Top hotéis da empresa |
| GET | `/api/dashboard/heatmap` | - | `{ cities: [{ city, state, latitude, longitude, total_spent, avg_stayscore, bookings_count }] }` | Dados do mapa de calor |
| GET | `/api/dashboard/trends?hotel_ids={ids}&weeks=12` | Query params | `{ trends: [{ hotel_id, hotel_name, data: [{ week: "YYYY-WW", avg_price }] }] }` | Tendências de preço |
| GET | `/api/dashboard/insights` | - | `{ insights: [{ id, type: "saving"\|"quality"\|"alert", title, description, action?, data? }] }` | Insights automáticos |

#### Onfly Proxy

| Método | Rota | Request | Response | Descrição |
|--------|------|---------|----------|-----------|
| GET | `/api/onfly/bookings?status=completed&from={date}&to={date}` | Query params | `{ bookings: [{ onfly_id, hotel_name, city, check_in, check_out, price, status }] }` | Reservas via Onfly API |

### 8.4 Integrações Externas

#### 8.4.1 Onfly API Pública

**Base URL:** `https://api.onfly.com.br`  
**Autenticação:** Bearer token (obtido via login do usuário)

| Feature | Endpoint Onfly | Dados consumidos | Transformação |
|---------|---------------|-----------------|---------------|
| Autenticação | POST `/auth/login` | access_token, user data | Armazena token; mapeia role para perfil StayScore |
| Dados do usuário | GET `/users/me` | id, name, email, role, company | Cria/atualiza User e Company no banco local |
| Reservas | GET `/bookings` (com filtros) | id, hotel, dates, price, status | Cria Booking local; vincula a Hotel via nome + cidade |
| Despesas | GET `/expenses` (com filtros) | category, amount, date | Filtra por hospedagem; alimenta dashboard de gastos |

#### 8.4.2 Google Places API (New)

**Base URL:** `https://places.googleapis.com/v1/places`  
**Autenticação:** API Key no header `X-Goog-Api-Key`

| Feature | Endpoint Google | Parâmetros | Transformação |
|---------|----------------|------------|---------------|
| Busca de hotéis por cidade | POST `/v1/places:searchText` | `{ textQuery: "hotéis em Belo Horizonte", includedType: "hotel", languageCode: "pt-BR", maxResultCount: 20 }` | Cria/atualiza Hotel no banco; extrai lat/lng, rating, amenities |
| Detalhes do hotel | GET `/v1/places/{place_id}` | Fields: `displayName, formattedAddress, location, rating, userRatingCount, reviews, photos, currentOpeningHours` | Atualiza Hotel; armazena reviews para análise |
| Reviews do hotel | (incluso em Place Details) | Field mask: `reviews` | Cada review → HotelReview no banco; envia para Claude API |
| Fotos do hotel | GET `/v1/places/{place_id}/photos/{photo_ref}/media` | `maxHeightPx=400, maxWidthPx=600` | URL da foto para exibição no frontend |
| Coworkings próximos | POST `/v1/places:searchNearby` | `{ includedTypes: ["coworking_space"], locationRestriction: { circle: { center: { lat, lng }, radius: 1000 } }, maxResultCount: 10 }` | Cria NearbyWorkspace no banco |
| Cafés próximos | POST `/v1/places:searchNearby` | `{ includedTypes: ["cafe"], locationRestriction: { circle: { center: { lat, lng }, radius: 1000 } }, maxResultCount: 10 }` | Filtra por reviews relevantes → NearbyWorkspace |

#### 8.4.3 Google Maps JavaScript API

**Uso:** Frontend only  
**Autenticação:** API Key no script tag (restringida por domínio)

| Feature | API/Método | Parâmetros |
|---------|-----------|------------|
| Mapa na página de detalhe | `google.maps.Map` | center: hotel lat/lng, zoom: 15 |
| Pins no mapa | `google.maps.marker.AdvancedMarkerElement` | Position, ícone customizado por tipo |
| Mapa de calor no dashboard | `google.maps.Map` + circles overlay | Center: lat/lng da cidade, radius proporcional ao gasto |

#### 8.4.4 Claude API (Anthropic)

**Base URL:** `https://api.anthropic.com/v1`  
**Autenticação:** API Key no header `x-api-key`

| Feature | Endpoint | Parâmetros | Transformação |
|---------|----------|------------|---------------|
| Análise de sentimento de reviews | POST `/v1/messages` | Model: `claude-haiku-4-5-20251001`, system prompt com critérios, reviews como input | JSON estruturado com scores por critério (0-1) e menções extraídas |
| Geração de insights | POST `/v1/messages` | Model: `claude-haiku-4-5-20251001`, dados do dashboard como contexto, prompt para gerar insights acionáveis | Array de insights com título, descrição, ação sugerida |
| Filtro de cafés produtivos | POST `/v1/messages` | Model: `claude-haiku-4-5-20251001`, reviews de cafés, prompt para identificar relevância para trabalho | Score 0-1 de relevância + indicadores (wifi, tomadas, silêncio) |

### 8.5 Fluxos de Dados End-to-End

#### Fluxo 1: Busca de Hotel com StayScore

```
1. Usuário digita "hotéis em Belo Horizonte" no campo de busca
2. Frontend → POST /api/hotels/search { query: "hotéis em Belo Horizonte" }
3. Backend verifica cache: SELECT * FROM hotels WHERE city = 'Belo Horizonte' AND stayscore.expires_at > NOW()
4. Cache HIT (≥1 hotel com score válido):
   → Retorna hotéis do banco com scores cacheados
   → Para hotéis sem score válido, enfileira recálculo assíncrono
5. Cache MISS (nenhum hotel com score válido):
   a. Google Places Text Search → 20 hotéis
   b. Para cada hotel (em paralelo, batch de 5):
      i.  Google Places Details → reviews + amenities
      ii. Claude API → análise de sentimento dos reviews
      iii. Google Nearby Search → coworkings próximos (para score de proximidade)
      iv. SELECT surveys FROM surveys WHERE hotel_id = X → surveys existentes
   c. StayScore Calculator → calcula score com todos os dados
   d. INSERT INTO hotels, stayScores, hotelReviews, nearbyWorkspaces
6. Backend retorna array de hotéis ordenados por StayScore
7. Frontend renderiza lista com HotelCard + StayScoreBadge
```

#### Fluxo 2: Micro-Survey Pós-Estadia

```
1. Cron job diário (00:00 UTC-3):
   a. GET /api/onfly/bookings?status=completed&checkout_date=yesterday
   b. Para cada reserva completada: verifica se já existe survey no banco
   c. Se não existe: marca como "survey pendente"
2. Usuário acessa o StayScore:
   a. Frontend checa GET /api/surveys?status=pending
   b. Se há survey pendente: exibe banner "Avalie sua estadia no [Hotel X]"
3. Usuário clica no banner → navega para /survey/{bookingId}
4. Preenche 4 perguntas → POST /api/surveys { ...respostas }
5. Backend:
   a. INSERT INTO surveys
   b. Recalcula StayScore do hotel incorporando novo survey
   c. UPDATE stayscore SET total_score = X, surveys_count = N+1
6. Resposta: "Obrigado! Sua avaliação ajuda viajantes como você."
```

#### Fluxo 3: Comparador de Datas

```
1. Usuário na página do hotel seleciona datas: check-in 15/abr, check-out 16/abr
2. Frontend → POST /api/hotels/compare { hotel_id, check_in, check_out }
3. Backend:
   a. Gera range de ±3 dias úteis: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 abr]
   b. Para cada dia: consulta PriceEntry no banco (dados simulados no MVP)
   c. Identifica dia mais barato com StayScore >= score original
   d. Busca até 3 hotéis alternativos: 
      - Mesma cidade
      - Preço < preço original  
      - StayScore >= score original
   e. Calcula economia projetada: savings × frequência de viagem do usuário (Onfly API)
4. Retorna: heatmap data, best_date, alternative_hotels, projected_savings
5. Frontend renderiza:
   - DateHeatmap com cores por preço
   - DateSuggestion card com economia
   - AlternativeHotels list
```

#### Fluxo 4: Dashboard de Tendências

```
1. Travel Manager acessa /dashboard
2. Frontend faz 4 requests em paralelo:
   a. GET /api/dashboard/top-hotels → ranking de hotéis
   b. GET /api/dashboard/heatmap → dados do mapa de calor
   c. GET /api/dashboard/trends → dados de tendências
   d. GET /api/dashboard/insights → insights gerados por IA
3. Backend para cada:
   a. top-hotels: 
      - SELECT bookings com JOIN em hotels e stayScores
      - GROUP BY hotel, COUNT, SUM(price), AVG(stayscore)
   b. heatmap:
      - SELECT bookings GROUP BY city
      - Para cada cidade: total_spent, avg_stayscore, lat/lng
   c. trends:
      - SELECT price_entries GROUP BY hotel, week
      - Últimas 12 semanas
   d. insights:
      - Coleta dados: top hotéis, preços, scores, surveys
      - Claude API: gera 3-5 insights acionáveis
      - Cache de 7 dias (insights não mudam frequentemente)
4. Frontend renderiza: TopHotelsTable, CityHeatmap, PriceTrendsChart, InsightCards
```

---

## 9. Wireframes Descritivos

### 9.1 Tela: Login (`/login`)

**Layout:** Centralizado verticalmente, fundo com gradiente suave roxo→branco.

- **Logo StayScore** no topo: ícone de hotel estilizado + "StayScore" em fonte bold, cor roxa (#7C3AED)
- **Subtítulo:** "Inteligência hoteleira para viajantes corporativos" em cinza (#6B7280), fonte 14px
- **Card branco** centralizado (max-width 400px, shadow-lg, border-radius 12px, padding 32px):
  - **Campo "Email":** input com placeholder "seu@email.com", ícone de envelope à esquerda, borda cinza claro, focus com borda roxa
  - **Campo "Senha":** input type password com ícone de cadeado, toggle de visibilidade (olho) à direita
  - **Botão "Entrar com Onfly":** largura total, fundo roxo (#7C3AED), texto branco bold, height 44px, border-radius 8px, hover com fundo mais escuro (#6D28D9)
  - **Texto abaixo:** "Conecte-se com suas credenciais Onfly" em cinza claro, 12px
- **Footer:** "Produto criado para o Hackathon Onfly 2026" em cinza, 11px

### 9.2 Tela: Busca de Hotéis (`/search`)

**Layout:** Navbar fixa no topo + conteúdo abaixo

**Navbar (height 64px, fundo branco, shadow-sm):**
- Logo StayScore à esquerda (versão compacta, 32px height)
- Campo de busca central: input largo (max-width 480px), ícone de busca à esquerda, placeholder "Busque por cidade, região ou hotel...", borda cinza, border-radius 8px, height 40px
- Avatar do usuário à direita: círculo 36px com iniciais, dropdown ao clicar (Perfil, Sair)
- Se Travel Manager: link "Dashboard" antes do avatar

**Área de filtros (abaixo da navbar, fundo cinza claro #F9FAFB, padding 16px):**
- **Filtro StayScore:** Label "Score mínimo", slider de 0 a 100, valor exibido à direita do slider como badge roxo
- **Filtro Preço:** Label "Preço por noite", dois inputs (R$ min — R$ max) inline
- **Ordenação:** Dropdown "Ordenar por": StayScore ↓ (default), Preço ↑, Melhor custo-benefício
- **Contador:** "23 hotéis encontrados" em cinza, font-weight 500

**Lista de hotéis (max-width 960px, centralizado):**

Cada **HotelCard** (fundo branco, border 1px cinza claro, border-radius 12px, shadow-sm, margin-bottom 16px, padding 0, overflow hidden):
- **Layout horizontal:** imagem à esquerda (width 200px, height 150px, object-fit cover) + conteúdo à direita (flex-grow, padding 16px)
- **Conteúdo:**
  - **Linha 1:** Nome do hotel em bold 18px preto (#111827) + StayScore Badge no canto superior direito
  - **StayScore Badge:** Círculo de 52px, borda de 3px (cor varia: verde se ≥80, amarelo se 60-79, vermelho se <60), número bold 20px no centro, label "Score" em 9px abaixo do número
  - **Linha 2:** Endereço em cinza (#6B7280) 13px, ícone de pin antes do texto
  - **Linha 3:** Mini-breakdown horizontal: 3 ícones com mini-score:
    - 📶 Wi-Fi: 85 (verde)
    - 🖥 Mesa: 72 (amarelo)
    - 🔇 Silêncio: 90 (verde)
  - **Linha 4:** Preço em bold 20px roxo "R$ 320/noite" à direita + nota Google "⭐ 4.3 (847)" em cinza à esquerda
  - **Linha 5:** Tag(s) de destaque: badges pequenos como "Wi-Fi Excelente" (verde), "Business Center" (azul), "Perto de coworking" (roxo)
- **Hover:** shadow-md, cursor pointer
- **Clique:** navega para `/hotel/{id}`

**Estado vazio:** Ilustração SVG de busca + "Busque uma cidade para encontrar os melhores hotéis para trabalho"

**Estado loading:** 4 skeleton cards com shimmer animation

### 9.3 Tela: Detalhe do Hotel (`/hotel/{id}`)

**Layout:** Scroll vertical, max-width 1120px centralizado

**Seção 1 — Header (padding-top 24px):**
- **Breadcrumb:** "Busca > Belo Horizonte > Mercure Belo Horizonte Lourdes" em cinza 13px
- **Nome do hotel:** H1, bold 28px, preto
- **Endereço:** ícone pin + texto em cinza 14px
- **Badge Google:** "⭐ 4.3 (1,247 avaliações)" em cinza
- **StayScore Badge grande:** Círculo de 80px no canto direito, borda de 4px, score em bold 32px, label "StayScore" em 11px

**Seção 2 — Galeria (margin-top 20px):**
- Grid de fotos: 1 foto principal (2/3 width, height 300px) + 2 fotos menores (1/3 width, stacked, 148px height cada) + botão "Ver todas (10)"
- Object-fit cover, border-radius 8px

**Seção 3 — Score Breakdown (margin-top 24px):**
- **Card branco** com padding 24px, border-radius 12px, shadow-sm
- **Título:** "Análise de Produtividade" em bold 18px
- **Grid 2×3** de critérios, cada um:
  - Ícone (24px) + Nome do critério em bold 14px
  - Barra de progresso horizontal (height 8px, border-radius 4px): preenchida com cor (verde ≥80, amarelo 60-79, vermelho <60)
  - Score numérico à direita da barra em bold 14px
  - Peso em cinza 11px abaixo: "Peso: 25%"
  
  Critérios na ordem:
  1. 📶 Wi-Fi — Score: 85 — Peso: 25%
  2. 🖥 Espaço no Quarto — Score: 72 — Peso: 20%
  3. 🏢 Espaço no Hotel — Score: 68 — Peso: 15%
  4. 📍 Coworkings Próximos — Score: 90 — Peso: 15%
  5. 💰 Custo-Benefício — Score: 78 — Peso: 15%
  6. ⭐ Avaliação Corp. — Score: 82 — Peso: 10%

**Seção 4 — Comparador de Datas (margin-top 24px):**
- **Card branco** com padding 24px
- **Título:** "Compare Datas e Economize" em bold 18px
- **Date pickers inline:** "Check-in: [15/04/2026]" "Check-out: [16/04/2026]" + Botão "Comparar" roxo
- **Heatmap:** Grid horizontal de 7 colunas (7 dias), cada célula:
  - Dia da semana em 11px cinza no topo ("Seg")
  - Data em 12px bold ("13/abr")
  - Preço em 14px bold (cor do fundo): "R$ 290"
  - Fundo: verde claro (#DCFCE7) para mais barato → vermelho claro (#FEE2E2) para mais caro
  - Célula da data selecionada: borda roxa 2px
  - Célula da melhor data: ícone de estrela no canto
- **Card de sugestão (abaixo do heatmap, fundo verde claro, border-left 4px verde):**
  - "💡 Economize R$190! Hospede-se segunda 13/abr em vez de quarta 15/abr. Mesmo hotel, StayScore 82."
  - Botão: "Ver esta opção" em verde bold
- **Hotéis alternativos (abaixo):**
  - Label: "Alternativas com score igual ou melhor:"
  - Mini-cards horizontais (3 em row): nome + score badge mini + preço + economia tag verde

**Seção 5 — WorkNearby (margin-top 24px):**
- **Card branco** com padding 24px
- **Título:** "Espaços de Trabalho Próximos" em bold 18px + badge "7 locais a 1km"
- **Layout:** Mapa à esquerda (60% width, height 400px) + lista à direita (40% width)
- **Mapa:**
  - Google Maps com zoom 16
  - Pin roxo grande: hotel (com nome no tooltip)
  - Pins azuis: coworkings (ícone de laptop)
  - Pins verdes: cafés (ícone de café)
  - Círculo tracejado roxo com raio de 1km
- **Lista de espaços** (scroll vertical se > 4 itens):
  - Cada **WorkspaceCard** (padding 12px, border-bottom 1px cinza):
    - **Linha 1:** Ícone azul/verde + Nome em bold 14px + Distância "400m" em cinza
    - **Linha 2:** Nota Google "⭐ 4.6" + Horário "8h-22h"
    - **Linha 3:** Badges de indicadores: "Wi-Fi ✓" (verde), "Tomadas ✓" (verde), "Silencioso ✓" (verde)
    - Hover: fundo cinza claro, mapa centraliza no pin correspondente

**Seção 6 — Reviews Filtrados (margin-top 24px):**
- **Card branco** com padding 24px
- **Título:** "O que viajantes a trabalho dizem" em bold 18px + contador "(12 reviews relevantes)"
- **Cada review:**
  - Avatar com inicial (círculo 36px cinza) + Nome em bold 14px + Data em cinza 12px
  - Estrelas do Google (amarelas) + Score de relevância "87% relevante para trabalho" em roxo 12px
  - Texto do review com **highlights em amarelo** para termos de trabalho (wifi, mesa, etc.)
  - Tags de sentimento: "Wi-Fi: Positivo 👍" (verde), "Mesa: Negativo 👎" (vermelho)

**Seção 7 — Botão de Ação (fixo no bottom, fundo branco, shadow-up):**
- Preço grande: "R$ 320/noite" em bold 24px
- Botão: "Reservar na Onfly →" roxo, height 48px, border-radius 8px

### 9.4 Tela: Micro-Survey (`/survey/{bookingId}`)

**Layout:** Centralizado, max-width 480px, fundo cinza claro

- **Header:** "Como foi sua estadia?" em bold 24px + Nome do hotel em cinza 16px + Data da estadia em cinza 14px
- **Progresso:** Barra de progresso em 4 steps (bolinhas conectadas por linha), step ativo em roxo
- **Pergunta 1 (Wi-Fi):**
  - "Como foi o Wi-Fi para trabalho?" em bold 16px
  - 5 estrelas clicáveis (48px cada), roxas quando selecionadas, cinza quando não
  - Label dinâmico abaixo: "Péssimo" (1), "Ruim" (2), "OK" (3), "Bom" (4), "Excelente" (5)
- **Pergunta 2 (Espaço):**
  - "Tinha espaço adequado para trabalhar no quarto?" em bold 16px
  - 3 botões horizontais: "Sim ✓" (verde se selecionado), "Parcial ⚠" (amarelo), "Não ✗" (vermelho)
- **Pergunta 3 (Silêncio):**
  - "Conseguiu se concentrar sem ruído?" em bold 16px
  - 5 estrelas (idêntico à pergunta 1)
- **Pergunta 4 (Recomendação):**
  - "Recomendaria para outro viajante a trabalho?" em bold 16px
  - 3 botões: "Sim 👍", "Talvez 🤔", "Não 👎"
- **Botão "Enviar":** roxo, largura total, height 48px. Desabilitado até todas as 4 perguntas respondidas
- **Após envio:** Tela de confirmação com ícone de check verde + "Obrigado! Sua avaliação ajuda viajantes como você." + "Voltar ao StayScore"

### 9.5 Tela: Dashboard de Tendências (`/dashboard`)

**Layout:** Sidebar à esquerda (width 240px) + conteúdo principal à direita

**Sidebar (fundo branco, border-right 1px cinza):**
- Logo StayScore no topo
- Menu:
  - 📊 Visão Geral (ativo: fundo roxo claro, texto roxo)
  - 🏨 Top Hotéis
  - 🗺 Mapa de Calor
  - 📈 Tendências
  - 💡 Insights
- Separador
- Filtros globais:
  - Período: dropdown "Últimos 30 dias" / "90 dias" / "12 meses"
  - Cidade: dropdown com cidades da empresa

**Conteúdo — Visão Geral:**

**Linha 1 — KPI Cards (4 cards em row, cada um: fundo branco, shadow-sm, padding 20px, border-radius 8px):**
1. "Total em Hospedagens" — "R$ 187.450" em bold 24px + "↑ 5% vs. mês anterior" em verde 12px
2. "StayScore Médio" — "76" em bold 24px roxo + "↑ 3 pontos" em verde 12px
3. "Reservas no Período" — "234" em bold 24px + "12 cidades"
4. "Economia Potencial" — "R$ 12.300" em bold 24px verde + "com sugestões StayScore"

**Linha 2 — Top Hotéis + Mapa de Calor (layout 50/50):**

**Top Hotéis (card branco, padding 20px):**
- Título: "Hotéis Mais Reservados" em bold 16px
- Tabela:
  | # | Hotel | Cidade | Reservas | Gasto | StayScore |
  |---|-------|--------|----------|-------|-----------|
  | 1 | Mercure Lourdes | BH | 23 | R$ 18.400 | 🟢 85 |
  | 2 | Novotel Jaraguá | SP | 19 | R$ 22.100 | 🟢 82 |
  | 3 | Ibis Paulista | SP | 15 | R$ 8.700 | 🟡 71 |
- StayScore como badge colorido na última coluna

**Mapa de Calor (card branco, padding 20px):**
- Título: "Gasto × Produtividade por Cidade"
- Google Maps do Brasil com:
  - Círculo sobre BH: grande (alto gasto), verde (score bom)
  - Círculo sobre SP: muito grande, amarelo
  - Círculo sobre RJ: médio, vermelho (alto gasto, baixo score)
  - Legenda: cores = StayScore médio, tamanho = volume de gasto

**Linha 3 — Tendências de Preço (largura total):**
- Card branco com gráfico de linhas (library: recharts ou chart.js)
- Título: "Evolução de Tarifas — Top 5 Hotéis"
- 5 linhas coloridas, uma por hotel
- Eixo X: últimas 12 semanas
- Eixo Y: R$/noite
- Tooltip ao hover com valores exatos
- Legenda abaixo com toggle por hotel

**Linha 4 — Insights Automáticos (largura total):**
- Título: "Insights para Ação" em bold 16px
- Grid de 3 InsightCards:
  - Card 1 (borda verde): "💰 Economia detectada — Hotel Mercure Lourdes BH tem StayScore 85 e custa R$25/noite menos que o Ouro Minas (Score 72). 8 colaboradores reservaram Ouro Minas este mês. Economia potencial: R$200/mês."
  - Card 2 (borda amarela): "📈 Tendência de preço — Tarifas em SP subiram 12% nas últimas 4 semanas. Considere negociar tarifa fixa com Novotel Jaraguá (15 reservas/mês)."
  - Card 3 (borda vermelha): "⚠️ Alerta de qualidade — 3 viajantes reportaram Wi-Fi ruim no Ibis Budget Confins. StayScore caiu de 68 para 61."
  - Cada card: ícone + título bold + texto descritivo + botão "Ver detalhes" discreto

---

## 10. Algoritmo do StayScore

### 10.1 Fórmula Geral

```
StayScore = (W_wifi × S_wifi) + (W_room × S_room) + (W_hotel × S_hotel) + 
            (W_cowork × S_cowork) + (W_price × S_price) + (W_rating × S_rating)
```

Onde:
- `W` = peso do critério (soma = 1.00)
- `S` = sub-score do critério (0-100)

| Critério | Variável | Peso (W) |
|----------|----------|----------|
| Qualidade do Wi-Fi | S_wifi | 0.25 |
| Estrutura no quarto | S_room | 0.20 |
| Espaço no hotel | S_hotel | 0.15 |
| Proximidade de coworkings | S_cowork | 0.15 |
| Relação preço × produtividade | S_price | 0.15 |
| Avaliação dos viajantes corporativos | S_rating | 0.10 |

### 10.2 Cálculo de Cada Sub-Score

#### S_wifi — Qualidade do Wi-Fi (0-100)

**Fontes de dados:**
1. **Reviews do Google** (peso 60% quando sem surveys): Análise de sentimento via Claude API
2. **Micro-surveys** (peso crescente com volume): Pergunta 1 (wifi_rating 1-5)
3. **Amenidades** (bônus): Presença de "free wifi" ou "wifi" nas amenidades

**Cálculo:**

```typescript
function calculateWifiScore(reviews: SentimentResult[], surveys: Survey[], amenities: string[]): number {
  // 1. Score de reviews (0-100)
  const wifiMentions = reviews.filter(r => r.sentiment_analysis.wifi);
  let reviewScore = 50; // default quando sem menções
  if (wifiMentions.length > 0) {
    // Claude retorna score 0-1 para cada menção (0 = muito negativo, 1 = muito positivo)
    const avgSentiment = wifiMentions.reduce((sum, r) => sum + r.sentiment_analysis.wifi.score, 0) / wifiMentions.length;
    reviewScore = avgSentiment * 100; // Converte para 0-100
  }

  // 2. Score de surveys (0-100)
  let surveyScore = 0;
  let surveyWeight = 0;
  if (surveys.length > 0) {
    surveyScore = (surveys.reduce((sum, s) => sum + s.wifi_rating, 0) / surveys.length) * 20; // 1-5 → 0-100
    // Peso do survey cresce com volume: min 20%, max 70%
    surveyWeight = Math.min(0.70, 0.20 + (surveys.length * 0.05));
  }

  // 3. Bônus de amenidades (0-10 pontos)
  const amenityBonus = amenities.some(a => 
    a.toLowerCase().includes('wifi') || a.toLowerCase().includes('wi-fi')
  ) ? 5 : 0;

  // Combinação ponderada
  const reviewWeight = 1 - surveyWeight;
  const baseScore = (reviewScore * reviewWeight) + (surveyScore * surveyWeight);
  
  return Math.min(100, Math.round(baseScore + amenityBonus));
}
```

#### S_room — Estrutura para Trabalho no Quarto (0-100)

**Fontes de dados:**
1. **Reviews do Google** (peso 60%): Menções a mesa, cadeira, tomada, iluminação, espaço
2. **Micro-surveys** (peso crescente): Pergunta 2 (workspace_adequate: SIM=100, PARCIAL=50, NAO=10)
3. **Categoria do hotel** (bônus): Hotéis 4-5 estrelas recebem bônus de +10

**Cálculo:**

```typescript
function calculateRoomWorkspaceScore(reviews: SentimentResult[], surveys: Survey[], hotelCategory?: number): number {
  // 1. Score de reviews
  const roomMentions = reviews.filter(r => r.sentiment_analysis.workspace_room);
  let reviewScore = 50;
  if (roomMentions.length > 0) {
    const avgSentiment = roomMentions.reduce((sum, r) => sum + r.sentiment_analysis.workspace_room.score, 0) / roomMentions.length;
    reviewScore = avgSentiment * 100;
  }

  // 2. Score de surveys
  let surveyScore = 0;
  let surveyWeight = 0;
  if (surveys.length > 0) {
    const adequacyMap = { SIM: 100, PARCIAL: 50, NAO: 10 };
    surveyScore = surveys.reduce((sum, s) => sum + adequacyMap[s.workspace_adequate], 0) / surveys.length;
    surveyWeight = Math.min(0.70, 0.20 + (surveys.length * 0.05));
  }

  // 3. Bônus de categoria
  const categoryBonus = (hotelCategory && hotelCategory >= 4) ? 10 : 0;

  const reviewWeight = 1 - surveyWeight;
  const baseScore = (reviewScore * reviewWeight) + (surveyScore * surveyWeight);
  
  return Math.min(100, Math.round(baseScore + categoryBonus));
}
```

#### S_hotel — Espaço de Trabalho no Hotel (0-100)

**Fontes de dados:**
1. **Reviews do Google** (peso 70%): Menções a business center, lobby, sala de reunião
2. **Amenidades** (peso 30%): Presença de "business center", "meeting room", "conference"

**Cálculo:**

```typescript
function calculateHotelWorkspaceScore(reviews: SentimentResult[], amenities: string[]): number {
  // 1. Score de reviews
  const hotelWorkMentions = reviews.filter(r => r.sentiment_analysis.workspace_hotel);
  let reviewScore = 40; // Default baixo (maioria dos hotéis não tem business center)
  if (hotelWorkMentions.length > 0) {
    const avgSentiment = hotelWorkMentions.reduce((sum, r) => sum + r.sentiment_analysis.workspace_hotel.score, 0) / hotelWorkMentions.length;
    reviewScore = avgSentiment * 100;
  }

  // 2. Score de amenidades
  const workAmenities = ['business center', 'meeting room', 'conference', 'sala de reunião', 'business'];
  const matchCount = amenities.filter(a => 
    workAmenities.some(wa => a.toLowerCase().includes(wa))
  ).length;
  const amenityScore = Math.min(100, matchCount * 35); // Cada amenidade vale 35 pts

  return Math.round(reviewScore * 0.70 + amenityScore * 0.30);
}
```

#### S_cowork — Proximidade de Coworkings (0-100)

**Fontes de dados:**
1. **Google Nearby Search**: Quantidade e qualidade de coworkings/cafés em 1km

**Cálculo:**

```typescript
function calculateCoworkingProximityScore(nearbyWorkspaces: NearbyWorkspace[]): number {
  if (nearbyWorkspaces.length === 0) return 15; // Score mínimo se não há coworkings

  const coworkings = nearbyWorkspaces.filter(w => w.type === 'COWORKING');
  const cafes = nearbyWorkspaces.filter(w => w.type === 'CAFE');

  // Pontuação por quantidade (max 40 pts)
  const quantityScore = Math.min(40, (coworkings.length * 10) + (cafes.length * 5));

  // Pontuação por proximidade (max 30 pts) - mais perto = mais pontos
  const closestDistance = Math.min(...nearbyWorkspaces.map(w => w.distance_meters));
  const proximityScore = closestDistance <= 200 ? 30 
                       : closestDistance <= 500 ? 20 
                       : closestDistance <= 800 ? 10 
                       : 5;

  // Pontuação por qualidade (max 30 pts) - baseado em rating médio
  const avgRating = nearbyWorkspaces.reduce((sum, w) => sum + (w.google_rating || 3), 0) / nearbyWorkspaces.length;
  const qualityScore = (avgRating / 5) * 30;

  return Math.round(quantityScore + proximityScore + qualityScore);
}
```

#### S_price — Relação Preço × Produtividade (0-100)

**Fontes de dados:**
1. **Preço médio do hotel** (da PriceEntry ou estimativa por categoria)
2. **Scores parciais de produtividade** (média dos outros sub-scores)

**Cálculo:**

```typescript
function calculatePriceProductivityScore(
  pricePerNight: number, 
  partialScores: { wifi: number, room: number, hotel: number, cowork: number }
): number {
  // Produtividade média (0-100)
  const avgProductivity = (partialScores.wifi + partialScores.room + partialScores.hotel + partialScores.cowork) / 4;

  // Faixas de preço por categoria (referência Brasil, cidades tier 1)
  // Budget: < R$200, Midscale: R$200-400, Upscale: R$400-700, Luxury: > R$700
  
  // Índice de eficiência: produtividade / preço normalizado
  // Normalização: preço em relação à mediana do mercado (R$300)
  const normalizedPrice = pricePerNight / 300;
  const efficiencyIndex = avgProductivity / (normalizedPrice * 100);

  // Converte para 0-100 (eficiência de 1.0 = score 70, escala linear)
  const score = Math.min(100, Math.max(0, efficiencyIndex * 70));
  
  return Math.round(score);
}
```

#### S_rating — Avaliação dos Viajantes Corporativos (0-100)

**Fontes de dados:**
1. **Nota do Google** (peso 40%): Convertida de 1-5 para 0-100
2. **Micro-surveys - recomendação** (peso 60% quando disponível): Pergunta 4

**Cálculo:**

```typescript
function calculateTravelerRatingScore(googleRating: number, surveys: Survey[]): number {
  // 1. Score do Google (1-5 → 0-100)
  const googleScore = ((googleRating - 1) / 4) * 100; // 1→0, 3→50, 5→100

  // 2. Score de surveys
  let surveyScore = 0;
  let surveyWeight = 0;
  if (surveys.length > 0) {
    const recommendMap = { SIM: 100, TALVEZ: 50, NAO: 10 };
    surveyScore = surveys.reduce((sum, s) => sum + recommendMap[s.would_recommend], 0) / surveys.length;
    surveyWeight = Math.min(0.60, 0.20 + (surveys.length * 0.04));
  }

  const googleWeight = 1 - surveyWeight;
  return Math.round(googleScore * googleWeight + surveyScore * surveyWeight);
}
```

### 10.3 Prompt de Análise de Sentimento (Claude API)

```
System: Você é um analisador de reviews de hotéis especializado em viajantes corporativos.
Analise cada review e extraia sentimento (0.0 a 1.0) para cada critério de produtividade.
Retorne APENAS um JSON válido, sem explicações.

Critérios:
- wifi: Qualidade do Wi-Fi/internet (velocidade, estabilidade, cobertura)
- workspace_room: Estrutura para trabalho no quarto (mesa, cadeira, tomadas, iluminação)
- workspace_hotel: Espaços de trabalho no hotel (business center, lobby funcional, salas)
- noise: Nível de silêncio/ruído (isolamento acústico, barulho)
- location_business: Localização para negócios (proximidade de escritórios, centros comerciais)

Escala: 0.0 = muito negativo, 0.5 = neutro/sem menção clara, 1.0 = muito positivo

Para cada critério mencionado, inclua "mentions" com trechos relevantes do review (max 3).
Se um critério NÃO é mencionado no review, omita-o do resultado.

User: Analise os seguintes reviews do hotel "{hotel_name}":

Review 1: "{review_text_1}"
Review 2: "{review_text_2}"
...

Formato de resposta esperado:
{
  "reviews": [
    {
      "review_index": 0,
      "criteria": {
        "wifi": { "score": 0.85, "mentions": ["wifi rápido e estável"] },
        "workspace_room": { "score": 0.3, "mentions": ["mesa minúscula", "sem tomada perto da mesa"] }
      },
      "overall_work_relevance": 0.72
    }
  ]
}
```

### 10.4 Evolução do Score com Surveys

O StayScore é dinâmico. Com 0 surveys, depende 100% de dados do Google. Com cada survey, o peso dos dados de primeira mão cresce:

| Surveys | Peso Reviews Google | Peso Surveys | Confiabilidade |
|---------|-------------------|--------------|----------------|
| 0 | 100% | 0% | Baixa (badge cinza) |
| 1-2 | 80% | 20% | Média (badge azul) |
| 3-5 | 60% | 40% | Alta (badge verde) |
| 6-10 | 40% | 60% | Muito Alta (badge verde+) |
| 11+ | 30% | 70% | Máxima (badge dourado) |

O badge de confiabilidade é exibido abaixo do StayScore: "Score baseado em 5 avaliações de viajantes corporativos Onfly"

---

## 11. Métricas de Sucesso (KPIs)

### 11.1 KPIs de Produto

| KPI | Meta 30 dias | Meta 60 dias | Meta 90 dias |
|-----|-------------|-------------|-------------|
| Usuários cadastrados | 50 | 200 | 500 |
| Buscas de hotel por semana | 100 | 500 | 1.500 |
| Hotéis com StayScore calculado | 200 | 1.000 | 5.000 |
| Micro-surveys completados | 20 | 150 | 500 |
| Taxa de resposta do survey (surveys / estadias concluídas) | 15% | 25% | 40% |
| Tempo médio de resposta do survey | < 45s | < 35s | < 30s |

### 11.2 KPIs de Engajamento

| KPI | Meta 30 dias | Meta 60 dias | Meta 90 dias |
|-----|-------------|-------------|-------------|
| DAU (Daily Active Users) | 10 | 50 | 150 |
| Sessões por usuário/semana | 2 | 3 | 4 |
| Páginas de detalhe de hotel visualizadas / sessão | 3 | 4 | 5 |
| Uso do comparador de datas (% das sessões) | 20% | 35% | 50% |
| Cliques em WorkNearby (% das visualizações de hotel) | 15% | 25% | 35% |
| Cliques em "Reservar na Onfly" (% das visualizações) | 5% | 10% | 15% |

### 11.3 KPIs de Negócio

| KPI | Meta 30 dias | Meta 60 dias | Meta 90 dias |
|-----|-------------|-------------|-------------|
| Economia sugerida total (R$) | R$ 5.000 | R$ 30.000 | R$ 100.000 |
| Economia aceita / sugerida (%) | 10% | 20% | 30% |
| Travel Managers ativos no dashboard | 5 | 15 | 40 |
| Insights do dashboard visualizados | 50 | 300 | 1.000 |
| NPS do StayScore | > 30 | > 40 | > 50 |

### 11.4 KPIs Técnicos

| KPI | Meta |
|-----|------|
| Uptime | > 99.5% |
| Tempo de carregamento (P95) | < 5s (busca), < 3s (detalhe) |
| Taxa de erro da API | < 1% |
| Custo com APIs externas / mês | < $300 |
| Cache hit rate (StayScore) | > 80% |

---

## 12. Roadmap

### Fase 0 — Hackathon MVP (5 dias)

**Objetivo:** Demonstração funcional apresentável com dados reais

| Feature | Status | Escopo MVP |
|---------|--------|------------|
| Login com credenciais Onfly | Must-have | Login simplificado (token hardcoded ou login real se API permitir) |
| Busca de hotéis por cidade | Must-have | Busca funcional com Google Places, mínimo 10 hotéis por busca |
| StayScore calculado | Must-have | Score funcional com reviews do Google + Claude API, todos os 6 critérios |
| Badge e breakdown visual | Must-have | Badge circular + breakdown em 6 critérios com barras de progresso |
| Detalhe do hotel | Must-have | Página com score, fotos, reviews filtrados, amenidades |
| Comparador de datas (heatmap) | Must-have | Heatmap visual com dados simulados, sugestão de data |
| WorkNearby (mapa + lista) | Must-have | Mapa com coworkings/cafés via Google Nearby Search |
| Micro-survey (formulário) | Nice-to-have | Formulário funcional com 4 perguntas |
| Dashboard (versão simplificada) | Nice-to-have | Top 5 hotéis + 2 insights estáticos |
| Deploy na Vercel | Must-have | URL pública funcionando |

**Critério de sucesso do hackathon:** Buscar "hotéis em Belo Horizonte", ver lista com StayScore, clicar em um hotel, ver breakdown + mapa WorkNearby + comparador de datas.

### Fase 1 — Pós-Hackathon (1 mês)

- Autenticação real com Onfly API (OAuth flow completo)
- Sincronização de reservas da Onfly (cron job)
- Micro-survey com detecção automática de check-out
- Dashboard completo com dados reais da empresa
- Filtros avançados (score mínimo, preço, cidade)
- Cache inteligente com TTL e invalidação
- Onboarding flow para novos usuários

### Fase 2 — Crescimento (3 meses)

- Comparador de datas com preços reais (integração com Omnibees ou similar)
- Notificações pré-check-in com sugestão WorkNearby
- Dashboard com mapa de calor interativo
- Tendências de preço (12 semanas) com dados reais
- Insights automáticos via IA (Claude) com atualização semanal
- Exportação de relatórios em PDF
- API pública do StayScore para integrações terceiras
- Multi-idioma (EN)

### Fase 3 — Escala (6 meses)

- App mobile (React Native) com notificações push
- Reserva de day pass de coworking in-app
- Programa de feedback gamificado (badges, ranking)
- Modelo de predição de preços com ML
- Integração com mais OBTs além da Onfly
- Extensão Chrome que mostra StayScore em Booking.com, Hotels.com
- White-label para empresas grandes
- StayScore como padrão de mercado (API aberta, certificação de hotéis)

---

## 13. Riscos e Mitigações

### 13.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Google Places API retorna poucos reviews (< 5 por hotel) | Alta | Médio | Score funciona com 1+ reviews; destaque o indicador de confiabilidade; incentive micro-surveys para compensar |
| Análise de sentimento da Claude retorna resultados inconsistentes | Média | Alto | Prompt refinado com exemplos; validação de output JSON; fallback para regex de keywords se API falhar |
| Onfly API pública não expõe endpoint necessário (ex: bookings) | Média | Alto | Verificar documentação antecipadamente; para MVP, simular dados; pivotar para input manual |
| Custo de APIs (Google + Claude) escala mais que o esperado | Média | Médio | Cache agressivo (7 dias StayScore, 14 dias nearby); rate limit por empresa; usar Claude Haiku (mais barato) |
| Latência alta na busca (múltiplas APIs sequenciais) | Alta | Médio | Paralelizar chamadas; mostrar skeleton UI; calcular scores progressivamente (mostrar hotel assim que disponível) |
| Dados do Google em inglês para hotéis brasileiros | Baixa | Baixo | Claude API lida bem com multilíngue; prompt aceita reviews em qualquer idioma |

### 13.2 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Onfly não vê valor no produto e não quer integrar | Baixa | Alto | Produto funciona standalone; valor é complementar, não competitivo; posicionar como lead gen para Onfly |
| Hotels reclamam do score negativo | Média | Médio | Score é objetivo e baseado em dados públicos; transparência total na metodologia; hotéis podem enviar dados de Wi-Fi speed test |
| Viajantes não respondem micro-surveys | Alta | Médio | Survey ultra-curto (30s, 4 perguntas); gamificação futura; mostrar impacto ("sua avaliação ajudou 12 colegas"); timing estratégico (24h pós check-out) |
| Travel managers já usam ferramentas internas e não adotam | Média | Médio | Foco no dado exclusivo (score de produtividade) que nenhuma outra ferramenta oferece; integração não-invasiva (complemento, não substituição) |

### 13.3 Riscos de Adoção

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Usuários não entendem o StayScore | Média | Alto | Onboarding com explicação visual; comparação com estrelas do Google ("4 estrelas ≠ bom para trabalho"); tooltips em todos os critérios |
| Dados insuficientes para gerar score confiável em cidades menores | Alta | Médio | Indicador de confiabilidade visível; foco inicial em BH, SP, RJ, BSB (cidades com mais viajantes corp.); expandir gradualmente |
| Concorrente copia a ideia | Baixa | Médio | First-mover advantage; base de surveys proprietária é moat; integração Onfly é diferencial |

---

## 14. Apêndice: Mapeamento de APIs

### 14.1 Onfly API Pública

| Feature | Endpoint | Método | Parâmetros | Retorno | Transformação para StayScore |
|---------|----------|--------|------------|---------|------------------------------|
| Login | `/auth/login` | POST | `{ email, password }` | `{ access_token, token_type, expires_in, user: { id, name, email, role, company_id } }` | Armazena token em httpOnly cookie; cria/atualiza User e Company |
| Dados do usuário | `/users/me` | GET | Header: Authorization Bearer | `{ id, name, email, role, company: { id, name }, department }` | Mapeia `role` → UserRole enum; sincroniza perfil |
| Listar reservas | `/bookings` | GET | `?status=confirmed&from=2026-01-01&to=2026-04-08&page=1&per_page=50` | `{ data: [{ id, hotel_name, city, state, check_in, check_out, total_value, daily_rate, status }], meta: { total, per_page, current_page } }` | Cria Booking local; tenta vincular a Hotel via match fuzzy nome + cidade; calcula price_per_night |
| Detalhe da reserva | `/bookings/{id}` | GET | Path param | `{ id, hotel_name, hotel_address, city, state, check_in, check_out, total_value, daily_rate, status, traveler: { id, name, email } }` | Extrai endereço para geocoding → vincular ao Google Place ID |
| Listar despesas | `/expenses` | GET | `?category=accommodation&from=2026-01-01&to=2026-04-08` | `{ data: [{ id, description, amount, category, date, status }] }` | Agrega por hotel para cálculo de gasto total no dashboard |
| Colaboradores | `/users` | GET | `?page=1&per_page=100` (apenas travel managers) | `{ data: [{ id, name, email, role, department }] }` | Sincroniza viajantes da empresa para mapeamento de surveys |

### 14.2 Google Places API (New)

| Feature | Endpoint | Método | Headers | Body/Params | Retorno (campos relevantes) | Transformação |
|---------|----------|--------|---------|-------------|----------------------------|---------------|
| Busca de hotéis | `places.googleapis.com/v1/places:searchText` | POST | `X-Goog-Api-Key: {KEY}`, `X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.types` | `{ textQuery: "hotéis em Belo Horizonte para negócios", includedType: "hotel", languageCode: "pt-BR", maxResultCount: 20, locationBias: { circle: { center: { latitude: -19.92, longitude: -43.94 }, radius: 15000 } } }` | `{ places: [{ id: "ChIJ...", displayName: { text: "Mercure BH Lourdes" }, formattedAddress: "Av. do Contorno, 7315", location: { latitude: -19.93, longitude: -43.94 }, rating: 4.3, userRatingCount: 1247, photos: [{ name: "places/.../photos/..." }] }] }` | Cada place → cria/atualiza Hotel (google_place_id = id); armazena photo_references |
| Detalhes + Reviews | `places.googleapis.com/v1/places/{placeId}` | GET | `X-Goog-Api-Key: {KEY}`, `X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.reviews,places.currentOpeningHours,places.photos,places.types,places.websiteUri` | - | `{ ..., reviews: [{ name: "places/.../reviews/...", relativePublishTimeDescription: "há 2 meses", rating: 4, text: { text: "Wi-fi excelente, mesa boa...", languageCode: "pt" }, authorAttribution: { displayName: "João S." } }] }` | Cada review → HotelReview (google_review_id = name); batch de reviews → Claude API para análise de sentimento |
| Foto do hotel | `places.googleapis.com/v1/{photoName}/media` | GET | `X-Goog-Api-Key: {KEY}` | `?maxHeightPx=400&maxWidthPx=600&skipHttpRedirect=true` | `{ photoUri: "https://..." }` | URL direto para `<img src>` |
| Coworkings próximos | `places.googleapis.com/v1/places:searchNearby` | POST | `X-Goog-Api-Key: {KEY}`, `X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.photos,places.reviews` | `{ includedTypes: ["coworking_space"], locationRestriction: { circle: { center: { latitude: -19.93, longitude: -43.94 }, radius: 1000 } }, maxResultCount: 10, languageCode: "pt-BR" }` | Cada result → NearbyWorkspace (type=COWORKING); calcula distance_meters = haversine(hotel.lat, hotel.lng, result.lat, result.lng); extrai opening_hours |
| Cafés próximos | `places.googleapis.com/v1/places:searchNearby` | POST | (mesmo header) | `{ includedTypes: ["cafe"], locationRestriction: { circle: { center: { latitude: -19.93, longitude: -43.94 }, radius: 1000 } }, maxResultCount: 10, languageCode: "pt-BR" }` | Cada café: envia reviews para Claude API para verificar se é "produtivo para trabalho"; se score > 0.5 → NearbyWorkspace (type=CAFE) com indicadores (has_wifi, has_power_outlets, is_quiet) |

### 14.3 Google Maps JavaScript API

| Feature | API | Parâmetros | Uso |
|---------|-----|------------|-----|
| Mapa do hotel + WorkNearby | `new google.maps.Map(element, options)` | `{ center: { lat: hotel.latitude, lng: hotel.longitude }, zoom: 15, mapId: "STAYSCORE_MAP" }` | Renderiza mapa interativo na página de detalhe |
| Pin do hotel | `new google.maps.marker.AdvancedMarkerElement({ position, map, title, content: customPinElement })` | `position: { lat, lng }`, `content`: div customizado com ícone roxo de hotel | Marca hotel no mapa |
| Pins de coworkings | (mesmo) | `content`: div com ícone azul de laptop | Marca cada coworking |
| Pins de cafés | (mesmo) | `content`: div com ícone verde de café | Marca cada café |
| Mapa do dashboard (calor) | `new google.maps.Map(element, { center: { lat: -15.78, lng: -47.93 }, zoom: 4 })` + `new google.maps.Circle({ center, radius, fillColor, fillOpacity })` | Center = lat/lng da cidade; radius proporcional ao gasto; fillColor baseado no StayScore médio | Mapa de calor por cidade no dashboard |

### 14.4 Claude API (Anthropic)

| Feature | Endpoint | Modelo | System Prompt | User Input | Output Esperado | Custo Estimado |
|---------|----------|--------|---------------|------------|-----------------|----------------|
| Análise de sentimento | POST `/v1/messages` | `claude-haiku-4-5-20251001` | (ver seção 10.3) | Até 5 reviews concatenados por hotel | JSON com scores 0-1 por critério + menções | ~$0.002/hotel (5 reviews, ~2K tokens input, ~500 output) |
| Filtro de cafés produtivos | POST `/v1/messages` | `claude-haiku-4-5-20251001` | "Analise os reviews deste café e determine se é um bom local para trabalhar remotamente. Retorne JSON: { work_friendly_score: 0-1, indicators: { wifi: bool, power_outlets: bool, quiet: bool }, evidence: string[] }" | Reviews do café (até 5) | `{ work_friendly_score: 0.82, indicators: { wifi: true, power_outlets: true, quiet: false }, evidence: ["wifi rápido", "muitas tomadas", "pode ser barulhento no horário de almoço"] }` | ~$0.001/café |
| Geração de insights | POST `/v1/messages` | `claude-haiku-4-5-20251001` | "Você é um analista de viagens corporativas. Com base nos dados abaixo, gere 3-5 insights acionáveis para o travel manager. Formato: JSON array com { type: 'saving'\|'quality'\|'alert', title: string, description: string, action: string }" | JSON com: top hotéis, gastos por cidade, scores, tendências | Array de 3-5 insights | ~$0.005/geração |

### 14.5 Estimativa de Custos por API

| API | Operação | Custo unitário | Volume estimado (MVP/mês) | Custo mensal |
|-----|----------|---------------|--------------------------|-------------|
| Google Places (Text Search) | 1 busca = 20 hotéis | $0.032/request | 500 buscas | $16 |
| Google Places (Details) | 1 detalhe por hotel | $0.017/request | 2.000 detalhes | $34 |
| Google Places (Nearby Search) | 2 buscas/hotel (coworking + café) | $0.032/request | 4.000 buscas | $128 |
| Google Places (Photos) | 1 foto/hotel | $0.007/request | 2.000 fotos | $14 |
| Google Maps JavaScript | Carregamentos de mapa | $0.007/load | 3.000 loads | $21 |
| Claude API (Haiku) | Sentimento + cafés + insights | ~$0.003/operação | 3.000 operações | $9 |
| **TOTAL ESTIMADO** | | | | **~$222/mês** |

> **Nota:** Custos podem ser significativamente reduzidos com cache eficiente. Com cache hit de 80%, o custo cai para ~$50/mês.

---

*Este PRD foi elaborado como documento de referência para o hackathon Onfly 2026. Todas as estimativas de preço, cenários e dados de hotéis são baseados em médias de mercado brasileiro e servem como referência realista para desenvolvimento.*
