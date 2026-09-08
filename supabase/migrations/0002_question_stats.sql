-- UNSAY — Etapa 4: estatísticas agregadas por pergunta.
--
-- Alimenta o algoritmo de seleção com uso real: perguntas mais respondidas
-- e mais compartilhadas ganham um pequeno reforço de prioridade ("o que já
-- funciona"), e perguntas pouco expostas recebem um bônus de exploração
-- para não ficarem esquecidas no fundo do banco de 100 perguntas.
--
-- security definer + só devolve contagens agregadas (nunca uma resposta
-- individual), então é seguro liberar pra anon/authenticated.
create or replace function public.get_question_stats()
returns table (
  question_id integer,
  times_answered integer,
  times_shared integer,
  share_rate numeric
)
language sql
security definer
set search_path = public
stable
as $$
  select
    q.id as question_id,
    coalesce(a.times_answered, 0) as times_answered,
    coalesce(s.times_shared, 0) as times_shared,
    case when coalesce(a.times_answered, 0) = 0 then 0
      else round(coalesce(s.times_shared, 0)::numeric / a.times_answered, 3)
    end as share_rate
  from public.questions q
  left join (
    select question_id, count(*) as times_answered
    from public.answers
    group by question_id
  ) a on a.question_id = q.id
  left join (
    select question_id, count(*) as times_shared
    from public.shares
    group by question_id
  ) s on s.question_id = q.id;
$$;

grant execute on function public.get_question_stats() to anon, authenticated;
