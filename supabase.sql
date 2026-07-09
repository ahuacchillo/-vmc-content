-- Tablero VMC — persistencia compartida en Supabase.
-- Una tabla, una fila por documento jsonb. Keys que usa la app hoy:
--   'vmc-matriz-v7'   (grilla del feed; cada día incluye su campo `campaign` de pauta)
--   'vmc-slogans-v2'  (slogans)
--   'vmc-perfil-v2'   (perfil de Instagram)
-- Como `data` es jsonb, cualquier campo nuevo del documento (p.ej. `campaign`) persiste
-- sin cambiar el esquema. El cliente hace: select data where key = ?  /  upsert
-- {key, data, updated_at} on conflict (key).
-- Correr en Supabase → SQL Editor. Es idempotente: se puede re-ejecutar sin romper nada.

create table if not exists public.docs (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- updated_at siempre correcto aunque el cliente no lo mande.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists docs_set_updated_at on public.docs;
create trigger docs_set_updated_at
  before insert or update on public.docs
  for each row execute function public.set_updated_at();

-- RLS: herramienta interna, la anon key puede leer y escribir (no borra filas).
alter table public.docs enable row level security;

drop policy if exists "docs anon select" on public.docs;
drop policy if exists "docs anon insert" on public.docs;
drop policy if exists "docs anon update" on public.docs;

create policy "docs anon select" on public.docs for select using (true);
create policy "docs anon insert" on public.docs for insert with check (true);
create policy "docs anon update" on public.docs for update using (true) with check (true);

-- ⚠️ Esto deja la tabla abierta a cualquiera con la anon key (que es pública en el navegador).
-- Suficiente para un tablero interno. Si el tablero se vuelve sensible, cámbialo por
-- Supabase Auth + policies con auth.uid(), o mueve la escritura a una API route con service_role.
