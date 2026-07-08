"use client";
import { useState } from "react";
import s from "./page.module.css";

export default function CopyBlock({ label, text }: { label: string; text: string }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    } catch {}
  };
  return (
    <div className={s.copyblock}>
      <div className={s.top}>
        <span className={s.lab}>{label}</span>
        <button className={`${s.copyBtn} ${ok ? s.ok : ""}`} onClick={copy}>
          {ok ? "Copiado ✓" : "Copiar"}
        </button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}
