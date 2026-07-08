import { createClient } from "@supabase/supabase-js";

// Cliente de navegador. Si no hay env configurado, exporta null y la app cae a localStorage.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
