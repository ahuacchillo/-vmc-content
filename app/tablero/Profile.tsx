"use client";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-perfil-v3";

type ProfileData = {
  handle: string; name: string; posts: string; followers: string; following: string;
  bio: string; linkText: string; cta: string;
};

const DEFAULT: ProfileData = {
  handle: "vmcsubastas",
  name: "VMC Subastas · Autos, Tech, Muebles 🔨",
  posts: "5,597",
  followers: "112 K",
  following: "48",
  bio: "🔨 Subastas online en Perú. Empezamos con autos, ahora subastamos de TODO.\n🚗 Autos · 📱 Tech · 🛋️ Muebles · 🏠 Inmuebles\n💸 Tú pones el precio. Sin comisiones, sin intermediarios.\n⏱️ Lotes reales con hora de cierre.\n🔴 15 de julio · nueva plataforma\n👇 Entra a la lista de espera",
  linkText: "lista-de-espera.vmc.pe",
  cta: "Únete a la lista de espera",
};

export default function Profile() {
  const [p, persist] = useStore<ProfileData>(STORE, DEFAULT);
  const set = (k: keyof ProfileData, v: string) => persist({ ...p, [k]: v });

  return (
    <div className={s.ig}>
      <div className={s.igHead}>
        <div className={s.igAvatar}>VMC</div>
        <div className={s.igMeta}>
          <div className={s.igTop}>
            <Editable className={s.igHandle} value={p.handle} onSave={(v) => set("handle", v)} prefix="@" />
            <span className={s.igBadge}>Seguir</span>
          </div>
          <div className={s.igStats}>
            <span><Editable className={s.igNum} value={p.posts} onSave={(v) => set("posts", v)} /> publicaciones</span>
            <span><Editable className={s.igNum} value={p.followers} onSave={(v) => set("followers", v)} /> seguidores</span>
            <span><Editable className={s.igNum} value={p.following} onSave={(v) => set("following", v)} /> seguidos</span>
          </div>
        </div>
      </div>
      <div className={s.igBody}>
        <Editable className={s.igName} value={p.name} onSave={(v) => set("name", v)} />
        <Editable className={s.igBio} value={p.bio} onSave={(v) => set("bio", v)} multiline />
        <Editable className={s.igLink} value={p.linkText} onSave={(v) => set("linkText", v)} />
      </div>
      <Editable className={s.igCta} value={p.cta} onSave={(v) => set("cta", v)} />
      <p className={s.note}>Vista previa editable. Regla de oro: <b>un solo enlace</b> en la bio, y el Nombre con palabras que la gente busca.</p>
    </div>
  );
}

function Editable({ value, onSave, className, prefix, multiline }:
  { value: string; onSave: (v: string) => void; className?: string; prefix?: string; multiline?: boolean }) {
  return (
    <div className={className} style={prefix ? { display: "inline-flex" } : undefined}>
      {prefix}
      <span
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        title="Editable"
        style={multiline ? { whiteSpace: "pre-wrap", display: "block" } : { outline: "none" }}
        onBlur={(e) => {
          const v = e.currentTarget.textContent.trim();
          if (v !== value) onSave(v);
        }}
      >
        {value}
      </span>
    </div>
  );
}
