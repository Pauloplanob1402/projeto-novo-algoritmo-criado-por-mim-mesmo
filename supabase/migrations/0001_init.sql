-- UNSAY — Etapa 2: schema inicial
-- Convenção: tudo em snake_case, RLS ligado em toda tabela que guarda dado
-- de usuário. Sem auth completa ainda (isso é Etapa 3) — por enquanto os
-- usuários são criados via Supabase Auth anônimo (auth.users), o que já dá
-- um auth.uid() real e estável pra cada visitante, sem exigir cadastro.

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────────
-- users: espelha auth.users (1:1), criada automaticamente no primeiro
-- acesso (anônimo ou não). Guardamos aqui só o que é do domínio do
-- produto, não credenciais.
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

-- cria a linha em public.users assim que um novo auth.users aparece
-- (anônimo ou não — cobre login social feito diretamente na Etapa 3).
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, is_anonymous)
  values (new.id, new.email, coalesce(new.is_anonymous, true))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ────────────────────────────────────────────────────────────────────
-- questions: banco de perguntas (seed a partir de data/questions.ts)
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.questions (
  id integer primary key,
  text text not null,
  category text not null,
  type text not null check (type in ('binary', 'choice', 'open')),
  options jsonb not null default '[]'::jsonb,
  dims jsonb not null default '[]'::jsonb,
  curiosity smallint not null check (curiosity between 0 and 10),
  ego smallint not null check (ego between 0 and 10),
  comparison smallint not null check (comparison between 0 and 10),
  shareability smallint not null check (shareability between 0 and 10),
  depth smallint not null check (depth between 0 and 10),
  contradiction smallint not null check (contradiction between 0 and 10),
  friend_share smallint not null check (friend_share between 0 and 10),
  difficulty smallint not null check (difficulty between 0 and 10),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_category on public.questions (category);
create index if not exists idx_questions_active on public.questions (active) where active;

-- ────────────────────────────────────────────────────────────────────
-- answers: cada resposta de cada usuário
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  question_id integer not null references public.questions (id) on delete cascade,
  option_index smallint not null,
  answer_text text not null,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create index if not exists idx_answers_user on public.answers (user_id);
create index if not exists idx_answers_question on public.answers (question_id);
-- alimenta a barra de comparação social (contagem por pergunta+opção)
create index if not exists idx_answers_question_option on public.answers (question_id, option_index);

-- ────────────────────────────────────────────────────────────────────
-- user_profiles: vetor de perfil (liberdade/segurança/dinheiro/...)
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  freedom_score smallint not null default 50,
  security_score smallint not null default 50,
  money_score smallint not null default 50,
  relationship_score smallint not null default 50,
  status_score smallint not null default 50,
  risk_score smallint not null default 50,
  moral_score smallint not null default 50,
  updated_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────
-- insights: descobertas geradas (mock local por enquanto, Gemini na Etapa 5)
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (type in ('pattern', 'contradiction')),
  content text not null,
  created_at timestamptz not null default now(),
  shown_at timestamptz
);

create index if not exists idx_insights_user on public.insights (user_id);

-- ────────────────────────────────────────────────────────────────────
-- contradictions: pares de dimensões já sinalizados por usuário
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.contradictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  dimension_a text not null,
  dimension_b text not null,
  confidence real not null default 0.7,
  description text not null,
  created_at timestamptz not null default now(),
  unique (user_id, dimension_a, dimension_b)
);

create index if not exists idx_contradictions_user on public.contradictions (user_id);

-- ────────────────────────────────────────────────────────────────────
-- shares / referrals: loop viral (criação da URL agora; resolução do
-- link e atribuição completas ficam pra Etapa 6)
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  question_id integer not null references public.questions (id) on delete cascade,
  slug text not null unique,
  platform text,
  created_at timestamptz not null default now()
);

create index if not exists idx_shares_user on public.shares (user_id);
create index if not exists idx_shares_slug on public.shares (slug);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users (id) on delete cascade,
  receiver_id uuid references public.users (id) on delete set null,
  question_id integer not null references public.questions (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_sender on public.referrals (sender_id);

-- ────────────────────────────────────────────────────────────────────
-- RLS: cada usuário só acessa seus próprios dados privados.
-- questions é público-leitura (não tem dado sensível).
-- answers agregadas (contagem por pergunta) são lidas via função
-- security definer, não via select direto na tabela — assim ninguém
-- lê a resposta individual de outra pessoa, só o agregado.
-- ────────────────────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.answers enable row level security;
alter table public.user_profiles enable row level security;
alter table public.insights enable row level security;
alter table public.contradictions enable row level security;
alter table public.shares enable row level security;
alter table public.referrals enable row level security;
alter table public.questions enable row level security;

create policy "usuário vê o próprio registro" on public.users
  for select using (auth.uid() = id);
create policy "usuário atualiza o próprio registro" on public.users
  for update using (auth.uid() = id);

create policy "qualquer um lê perguntas ativas" on public.questions
  for select using (active = true);

create policy "usuário vê as próprias respostas" on public.answers
  for select using (auth.uid() = user_id);
create policy "usuário insere as próprias respostas" on public.answers
  for insert with check (auth.uid() = user_id);

create policy "usuário vê o próprio perfil" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy "usuário atualiza o próprio perfil" on public.user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "usuário vê os próprios insights" on public.insights
  for select using (auth.uid() = user_id);
create policy "usuário insere os próprios insights" on public.insights
  for insert with check (auth.uid() = user_id);

create policy "usuário vê as próprias contradições" on public.contradictions
  for select using (auth.uid() = user_id);
create policy "usuário insere as próprias contradições" on public.contradictions
  for insert with check (auth.uid() = user_id);

create policy "usuário vê os próprios compartilhamentos" on public.shares
  for select using (auth.uid() = user_id);
create policy "usuário cria os próprios compartilhamentos" on public.shares
  for insert with check (auth.uid() = user_id);
-- leitura pública de um share específico por slug é feita via função
-- security definer (Etapa 6), não por select direto na tabela.

create policy "usuário vê os referrals que enviou" on public.referrals
  for select using (auth.uid() = sender_id);
create policy "usuário cria referrals como remetente" on public.referrals
  for insert with check (auth.uid() = sender_id);

-- ────────────────────────────────────────────────────────────────────
-- Funções auxiliares (security definer): dados agregados/anônimos que
-- não devem expor respostas individuais de outras pessoas.
-- ────────────────────────────────────────────────────────────────────

-- percentual real de comparação social para uma pergunta+opção
create or replace function public.get_answer_percent(p_question_id integer, p_option_index smallint)
returns table (percent numeric, total_answers integer)
language sql
security definer
set search_path = public
stable
as $$
  select
    case when count(*) = 0 then null
      else round(100.0 * count(*) filter (where option_index = p_option_index) / count(*), 1)
    end as percent,
    count(*)::integer as total_answers
  from public.answers
  where question_id = p_question_id;
$$;

grant execute on function public.get_answer_percent(integer, smallint) to anon, authenticated;
