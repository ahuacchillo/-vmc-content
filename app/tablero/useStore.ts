"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Estado compartido: carga desde Supabase (tabla `docs`, 1 fila jsonb por `key`),
// cae a localStorage si Supabase no está configurado o falla. Guarda en ambos.
// Devuelve [value, save, { saved }]. `save(next)` persiste; no rehace merges.
export function useStore<T>(key: string, fallback: T): [T, (next: T) => void, { saved: boolean }] {
  const [value, setValue] = useState<T>(fallback);
  const [saved, setSaved] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      // 1) cache local inmediato (evita parpadeo)
      try { const raw = localStorage.getItem(key); if (raw && alive) setValue(JSON.parse(raw)); } catch {}
      // 2) fuente de verdad remota si existe
      if (supabase) {
        const { data, error } = await supabase.from("docs").select("data").eq("key", key).maybeSingle();
        if (!error && data && alive) {
          setValue(data.data as T);
          try { localStorage.setItem(key, JSON.stringify(data.data)); } catch {}
        }
      }
    })();
    return () => { alive = false; };
  }, [key]);

  const save = (next: T) => {
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    if (supabase) {
      supabase.from("docs").upsert({ key, data: next, updated_at: new Date().toISOString() }).then(() => {});
    }
    setSaved(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setSaved(false), 1600);
  };

  return [value, save, { saved }];
}
