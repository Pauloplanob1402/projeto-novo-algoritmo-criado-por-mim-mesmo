# UNSAY — Etapas 1 a 6

**Etapa 1 (Experiência & Frontend)**, **Etapa 2 (Supabase)**, **Etapa 3
(Autenticação)**, **Etapa 4 (Algoritmo)**, **Etapa 5 (Gemini)** e
**Etapa 6 (Viralidade)** concluídas. Next.js 16 (App Router) + TypeScript
+ Tailwind CSS v4 + Supabase Auth + Gemini.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. `npm run lint` limpo, `npm run build` limpo,
`npx tsc --noEmit` limpo.

## Configurando o Supabase (Etapa 2)

1. Crie um projeto em https://supabase.com.
2. No **SQL Editor** do projeto, cole e rode o conteúdo de
   `supabase/migrations/0001_init.sql` (cria tabelas, índices, RLS e a
   função `get_answer_percent`).
3. Em **Authentication → Providers**, habilite o provider **Anonymous**
   (é o que permite responder sem cadastro desde já — a Etapa 3 troca isso
   por login de verdade, mantendo o mesmo `user_id`).
4. Copie **Project URL**, **anon public key** e **service_role key** em
   Project Settings → API.
5. Rode o seed das 100 perguntas (só localmente, com a service role key —
   nunca comite essa chave):

   ```bash
   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx npm run seed
   ```

6. Configure as env vars no Vercel (ver `.env.example`):
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A
   `SUPABASE_SERVICE_ROLE_KEY` **não** precisa ir pro Vercel — só é usada
   localmente pelo script de seed.

**Sem essas variáveis, o app continua funcionando normalmente** — cai
automaticamente no comportamento da Etapa 1 (tudo simulado em memória).
Isso é proposital: dá pra fazer o deploy a qualquer momento, com ou sem o
banco configurado ainda.

## Configurando a autenticação (Etapa 3)

1. Em **Authentication → Providers → Google**, habilite e cole o **Client
   ID** e **Client Secret** de um projeto OAuth no Google Cloud Console
   (tela de consentimento + credencial "Web application"). A URI de
   redirect a autorizar no Google é a que o próprio painel do Supabase
   mostra ali (algo como `https://xxxx.supabase.co/auth/v1/callback`).
2. Em **Authentication → URL Configuration**, defina o **Site URL** como
   o domínio de produção (ex.: `https://unsay.vercel.app`) e adicione as
   URLs de preview/local em **Redirect URLs**. É pra lá que o Google e o
   link de e-mail redirecionam de volta.
3. Login por e-mail é **passwordless** (magic link) — decisão
   deliberada: elimina o fluxo inteiro de "esqueci minha senha" do
   briefing original, porque não existe senha para esquecer. O próprio
   link por e-mail já cumpre esse papel toda vez que a pessoa precisa
   entrar de novo.
4. **A conta anônima "vira" a conta de verdade**: quem já respondeu
   perguntas sem cadastro e faz login depois (Google ou e-mail) continua
   com o mesmo `user_id` — nada do histórico se perde. Isso usa
   `linkIdentity` (Google) e `updateUser({ email })` (e-mail), os
   métodos oficiais do Supabase Auth pra converter uma sessão anônima.
5. Login/logout ficam sempre acessíveis no painel de perfil (ícone no
   canto superior direito, a qualquer momento) — não só na tela de
   cadastro que aparece depois de 7 respostas.

**Limitação conhecida:** como o login com Google recarrega a página (é um
redirect de verdade para o Google e de volta), a posição do usuário
dentro do fluxo de perguntas é reiniciada visualmente após o login — mas
os dados já respondidos continuam salvos no banco, sob o mesmo usuário.
Retomar exatamente de onde parou é uma melhoria futura, fora do escopo
desta etapa (evitando overengineering agora).

## Configurando o Gemini (Etapa 5)

1. Gere uma chave em https://aistudio.google.com/apikey.
2. Configure `GEMINI_API_KEY` no Vercel (Project Settings → Environment
   Variables). Nunca vai pro `NEXT_PUBLIC_*` — é lida só em
   `app/api/ai/insight/route.ts`, no servidor.
3. Opcionalmente, `GEMINI_MODEL` troca o modelo usado (padrão:
   `gemini-2.0-flash` — rápido e barato, adequado pra uma frase curta por
   vez; ajuste se o nome do modelo mudar no Google AI Studio).
4. **Sem a chave configurada**, a rota funciona normalmente e devolve o
   texto gerado localmente por `lib/insights.ts` (o mesmo comportamento
   da Etapa 1) — nunca quebra, nunca deixa a pessoa sem descoberta.

**Como funciona:** `lib/gemini.ts` chama o Gemini só nos momentos de alto
valor já definidos (`INSIGHT_MILESTONES` em `lib/insights.ts`, ou quando
uma contradição nova é detectada) — nunca a cada resposta, seguindo o
"controle de custo" do briefing. O prompt do sistema proíbe
explicitamente diagnóstico, termos clínicos ou afirmações absolutas de
personalidade — só linguagem probabilística ("suas respostas sugerem...",
"pode haver uma contradição..."). Cada chamada:

1. calcula um fallback local instantaneamente (`generateInsight`, mesma
   lógica de templates da Etapa 1);
2. tenta o Gemini com um resumo estruturado (perfil 0–100 por dimensão +
   últimas respostas como contexto, nunca o histórico bruto inteiro);
3. se o Gemini falhar, não responder a tempo (timeout de 6s) ou não
   estiver configurado, usa o fallback sem a pessoa perceber diferença;
4. persiste o resultado final na tabela `insights`, já existente desde a
   Etapa 2.

## Deploy (GitHub + Vercel)

1. Suba esta pasta como repositório no GitHub (`.gitignore` já exclui
   `node_modules`, `.next`, `.env*.local`, `.vercel`).
2. Importe no Vercel — build detectado automaticamente.
3. Configure as env vars do Supabase (passo acima) em Project Settings →
   Environment Variables, se quiser persistência real.

## Estrutura

```
app/
  layout.tsx, page.tsx, globals.css
  q/[slug]/page.tsx, not-found.tsx   # página pública de pergunta compartilhada (Etapa 6)
  api/
    _lib/auth.ts          # valida o token do usuário nas rotas
    answers/route.ts       # grava resposta + atualiza perfil + percentual real
    shares/route.ts          # cria o registro de compartilhamento (slug)
    shares/[slug]/route.ts     # resolve publicamente um link de compartilhamento
    referrals/route.ts           # credita quem enviou o convite (Etapa 6)
    questions/stats/route.ts       # estatísticas agregadas por pergunta (Etapa 4), público
    ai/insight/route.ts              # gera o insight via Gemini (com fallback) e persiste (Etapa 5)

types/question.ts, data/questions.ts   # domínio e as 100 perguntas seedadas

lib/
  algorithm.ts, profile.ts, insights.ts, stats.ts, labels.ts, gemini.ts
  supabase/
    config.ts               # detecta se o Supabase está configurado
    browserClient.ts          # client do navegador — import() dinâmico (code-splitting)
    serverClient.ts             # clients server-side (autenticado e anônimo)
    shareResolver.ts              # resolve um slug server-side (usado pela página e pela API)
    authActions.ts                  # login Google/e-mail, logout
    api.ts                            # helpers fetch (com fallback null em caso de falha)

hooks/
  useUserSession.ts             # sessão (anônima ou logada) + escuta onAuthStateChange
  useUnsayFlow.ts                 # máquina de estado — tenta persistir real, cai pro local

components/  (ver comentários em cada arquivo)
  AccountActions.tsx               # botões de login (Google + e-mail), usados na tela de cadastro e no perfil
  SharedQuestionScreen.tsx           # tela pública de quem chega por um link compartilhado

supabase/migrations/
  0001_init.sql, 0002_question_stats.sql, 0003_virality.sql
scripts/seed-questions.ts             # popula as 100 perguntas (idempotente)
```

## O que é real agora vs. o que falta

| Camada | Estado |
|---|---|
| UI, navegação, algoritmo de próxima pergunta | Real desde a Etapa 1 |
| Schema, índices, RLS | **Real** — `supabase/migrations/0001_init.sql` |
| Persistência de respostas, perfil, contradições | **Real** — via `/api/answers`, com fallback local se offline/sem config |
| Percentual de comparação social | **Real** (contagem via `get_answer_percent`), cai pro determinístico local se a rede falhar |
| Criação de link de compartilhamento (slug) | **Real** — `/api/shares` grava no banco, com a resposta de quem envia |
| Resolução pública do link (`/q/[slug]`) | **Real** — página pública funcional, com comparação e referral |
| Geração do texto do insight | **Real** — Gemini server-side, com fallback local automático (chave ausente ou chamada falha) |
| Login com Google e e-mail (magic link) | **Real** — via Supabase Auth, convertendo a sessão anônima existente |
| Logout | **Real** — sempre acessível no painel de perfil |
| Algoritmo de próxima pergunta | **Real** — combina os atributos autorais das perguntas com uso real (taxa de compartilhamento observada + bônus de exploração para perguntas pouco vistas) |
| Tracking de referral | **Real** — `record_referral()`, deduplicado por (remetente, destinatário, pergunta) |

## Etapa 4 — Algoritmo aprendendo com uso real

`lib/algorithm.ts` agora aceita um mapa de estatísticas (`QuestionStatsMap`)
vindo de `get_question_stats()` (nova função SQL em
`supabase/migrations/0002_question_stats.sql`): quantas vezes cada
pergunta foi respondida e compartilhada. Isso entra como um componente a
mais na pontuação (`performance`, peso 0.12):

- perguntas com **alta taxa de compartilhamento real** ganham prioridade
  (o que a galera de fato manda pra frente, não só o que os metadados
  autorais *acham* que é compartilhável);
- perguntas **pouco respondidas** recebem um bônus de exploração, pra o
  banco inteiro de 100 perguntas continuar circulando em vez de
  convergir sempre pras mesmas favoritas.

`/api/questions/stats` expõe esse agregado publicamente (sem
autenticação — são só contagens, nada individual), com cache de 1 minuto.
Sem essa rota respondendo (Supabase não configurado, ou API fora do ar), o
algoritmo simplesmente opera no modo neutro da Etapa 1, sem quebrar nada.

## Etapa 6 — Viralidade

O link `/q/[slug]` agora resolve de verdade — é uma página pública real,
não mais um placeholder. A migration `0003_virality.sql` (separada da
`0001`/`0002` pelo mesmo motivo de sempre: nunca editar uma migration que
você já pode ter rodado) adiciona:

- **retrato da resposta de quem compartilhou** (`sender_option_index`,
  `sender_answer_text` na tabela `shares`) — assim quem recebe o link vê
  "seu amigo respondeu X" sem precisar de acesso à tabela de respostas de
  ninguém;
- a função `resolve_share(slug)`, pública e agregada, que devolve a
  pergunta + a resposta de quem enviou;
- a função `record_referral(slug)`, que credita quem enviou o convite
  quando uma pessoa nova chega e responde — com deduplicação automática
  (reabrir o mesmo link não gera linhas repetidas) e sem precisar afrouxar
  a RLS da tabela `referrals` (a lógica roda com privilégio elevado só
  para essa operação específica).

**O fluxo "responda primeiro, cadastre-se depois":** quem abre um link
compartilhado cai direto na pergunta (sessão anônima criada na hora,
igual ao resto do app), responde, vê a comparação com quem mandou o link
*e* com o percentual real de todo mundo, e só depois disso é convidado a
"descobrir mais" — entrando na experiência completa em `/`. Nenhuma
barreira de cadastro antes de responder.

- `ENVIAR PARA UM AMIGO` agora usa a **Web Share API** nativa quando
  disponível (abre o menu de compartilhar do celular — WhatsApp,
  Mensagens, etc.), com fallback pra copiar o link em navegadores sem
  suporte.
- O link mostrado e copiado é o **domínio real** do deploy, não mais um
  placeholder.
- `generateMetadata` no `/q/[slug]` gera um preview decente (título com a
  pergunta) quando o link é colado em redes sociais/WhatsApp.
- Link expirado ou inexistente cai numa página 404 com a mesma
  identidade visual do resto do produto, não a página genérica do Next.

## Performance & mobile

Passada dedicada de leveza e responsividade, sem introduzir nada novo em
termos de produto:

- **Fontes**: trocadas de fonte variável (que baixa o eixo inteiro de peso
  + tamanho óptico) para **5 instâncias estáticas exatas** — só os pesos
  que a interface de fato usa (`ital,wght@0,400;0,500;0,600;1,300;1,600`
  pro Fraunces), reduzindo bastante o payload de fontes.
- **Code-splitting do Supabase**: `@supabase/supabase-js` (a dependência
  mais pesada do projeto) foi convertida pra `import()` dinâmico em
  `lib/supabase/browserClient.ts`. Confirmado no build: os chunks que
  contêm essa biblioteca **não** aparecem entre os arquivos carregados
  eagerly na home (`build-manifest.json` → `rootMainFiles`) — só entram
  quando alguma ação de sessão realmente precisa.
- **Viewport mobile correto**: `viewportFit: "cover"` + `env(safe-area-inset-*)`
  no header e na área de conteúdo, pra não ficar por baixo do notch/home
  indicator em iPhones. `theme-color` definido pra combinar a barra do
  navegador com o app.
- **Altura dinâmica**: `min-h-dvh` em vez de `min-h-screen` — evita o
  clássico bug de conteúdo escondido atrás da barra de endereço em
  navegadores mobile.
- Tap targets de todos os botões ≥ 48px de altura, tipografia com
  `clamp()` pra escalar suavemente de celulares pequenos a desktop.

## Próxima etapa

Etapa 7 — Produção: performance/SEO avançado, PWA instalável, analytics,
monitoramento de erros, rate limiting, moderação de conteúdo, política de
privacidade, exclusão de conta, preparo final para escala.
