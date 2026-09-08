# UNSAY — Etapas 1, 2 e 3

**Etapa 1 (Experiência & Frontend)**, **Etapa 2 (Supabase)** e **Etapa 3
(Autenticação)** concluídas. Next.js 16 (App Router) + TypeScript +
Tailwind CSS v4 + Supabase Auth.

Ainda **sem Gemini** (Etapa 5) — os insights continuam gerados por
template local, só que agora já persistidos no banco.

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
  api/
    _lib/auth.ts          # valida o token do usuário nas rotas
    answers/route.ts       # grava resposta + atualiza perfil + percentual real
    insights/route.ts       # persiste um insight (texto ainda gerado localmente)
    shares/route.ts          # cria o registro de compartilhamento (slug)

types/question.ts, data/questions.ts   # domínio e as 100 perguntas seedadas

lib/
  algorithm.ts, profile.ts, insights.ts, stats.ts, labels.ts
  supabase/
    config.ts               # detecta se o Supabase está configurado
    browserClient.ts          # client do navegador (sessão anônima)
    serverClient.ts             # client server-side, autenticado com o token do usuário
    api.ts                        # helpers fetch (com fallback null em caso de falha)

hooks/
  useUserSession.ts             # sessão (anônima ou logada) + escuta onAuthStateChange
  useUnsayFlow.ts                 # máquina de estado — tenta persistir real, cai pro local

components/  (ver comentários em cada arquivo)
  AccountActions.tsx               # botões de login (Google + e-mail), usados na tela de cadastro e no perfil

supabase/migrations/0001_init.sql   # schema completo + RLS + função agregada
scripts/seed-questions.ts             # popula as 100 perguntas (idempotente)
```

## O que é real agora vs. o que falta

| Camada | Estado |
|---|---|
| UI, navegação, algoritmo de próxima pergunta | Real desde a Etapa 1 |
| Schema, índices, RLS | **Real** — `supabase/migrations/0001_init.sql` |
| Persistência de respostas, perfil, contradições | **Real** — via `/api/answers`, com fallback local se offline/sem config |
| Percentual de comparação social | **Real** (contagem via `get_answer_percent`), cai pro determinístico local se a rede falhar |
| Criação de link de compartilhamento (slug) | **Real** — `/api/shares` grava no banco |
| Resolução pública do link (`/q/[slug]`) | Ainda não — é escopo da Etapa 6 |
| Geração do texto do insight | Ainda por template local — vira Gemini na Etapa 5 (a tabela `insights` já existe e já persiste) |
| Login com Google e e-mail (magic link) | **Real** — via Supabase Auth, convertendo a sessão anônima existente |
| Logout | **Real** — sempre acessível no painel de perfil |

## Próxima etapa

Etapa 4 — Algoritmo: ligar `lib/algorithm.ts` a estatísticas reais de uso
(performance histórica por pergunta, taxa de resposta, taxa de
compartilhamento), em vez dos pesos fixos atuais.
