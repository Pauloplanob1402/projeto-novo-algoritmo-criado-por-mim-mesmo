# UNSAY — Etapas 1 e 2

**Etapa 1 (Experiência & Frontend)** e **Etapa 2 (Supabase)** concluídas.
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase.

Ainda **sem autenticação real** (login com Google/e-mail é Etapa 3) e **sem
Gemini** (Etapa 5) — o app usa sessão anônima do Supabase Auth para já
persistir dados reais desde já, sem exigir cadastro.

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
  useAnonymousSession.ts     # garante login anônimo real via Supabase Auth
  useUnsayFlow.ts              # máquina de estado — tenta persistir real, cai pro local

components/  (ver comentários em cada arquivo)

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
| Login de verdade (trocar o anônimo por conta) | Etapa 3 |

## Próxima etapa

Etapa 3 — Autenticação: login com Google e e-mail via Supabase Auth,
ligando a identidade real à sessão anônima já existente
(`supabase.auth.linkIdentity`), sem perder o histórico de respostas de
quem já usou o app sem conta.
