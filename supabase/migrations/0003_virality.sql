-- UNSAY — Etapa 6: viralidade.
--
-- Guarda um retrato da resposta de quem compartilhou (não um link solto
-- pra tabela answers, que é privada) — assim quem recebe o convite pode
-- ver "seu amigo respondeu X" sem que isso exija abrir acesso à tabela
-- de respostas de ninguém.
alter table public.shares
  add column if not exists sender_option_index smallint,
  add column if not exists sender_answer_text text;

-- Evita linhas de referral duplicadas quando a mesma pessoa reabre o
-- mesmo link várias vezes.
alter table public.referrals
  add constraint referrals_sender_receiver_question_unique
  unique (sender_id, receiver_id, question_id);

-- Resolve um slug publicamente: devolve a pergunta e a resposta de quem
-- compartilhou, sem expor a tabela shares (RLS) nem quem enviou além do
-- id (necessário só para registrar o referral). security definer +
-- só devolve o que é necessário pra a tela pública funcionar.
create or replace function public.resolve_share(p_slug text)
returns table (
  question_id integer,
  question_text text,
  question_type text,
  question_options jsonb,
  question_category text,
  question_dims jsonb,
  sender_option_index smallint,
  sender_answer_text text,
  sender_id uuid
)
language sql
security definer
set search_path = public
stable
as $$
  select
    q.id as question_id,
    q.text as question_text,
    q.type as question_type,
    q.options as question_options,
    q.category as question_category,
    q.dims as question_dims,
    s.sender_option_index,
    s.sender_answer_text,
    s.user_id as sender_id
  from public.shares s
  join public.questions q on q.id = s.question_id
  where s.slug = p_slug
  limit 1;
$$;

grant execute on function public.resolve_share(text) to anon, authenticated;

-- Registra o referral do lado de quem CHEGOU pelo link (não de quem
-- enviou) — por isso não dá pra usar a RLS padrão de "insere como
-- remetente" (migration 0001). Em vez de afrouxar a policy, resolve tudo
-- aqui dentro, com privilégio elevado só para essa operação específica.
create or replace function public.record_referral(p_slug text)
returns table (recorded boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sender_id uuid;
  v_question_id integer;
begin
  select s.user_id, s.question_id into v_sender_id, v_question_id
  from public.shares s
  where s.slug = p_slug
  limit 1;

  if v_sender_id is null then
    return query select false;
    return;
  end if;

  -- não vira referral de si mesmo (ex.: testando o próprio link)
  if v_sender_id = auth.uid() then
    return query select false;
    return;
  end if;

  insert into public.referrals (sender_id, receiver_id, question_id)
  values (v_sender_id, auth.uid(), v_question_id)
  on conflict (sender_id, receiver_id, question_id) do nothing;

  return query select true;
end;
$$;

grant execute on function public.record_referral(text) to authenticated;
