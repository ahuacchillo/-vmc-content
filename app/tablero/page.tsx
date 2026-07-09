import Link from "next/link";
import s from "./page.module.css";
import MatrixEditor from "./MatrixEditor";
import Copys from "./Copys";
import Profile from "./Profile";

export const metadata = { title: "Grilla de contenido · VMC Subastas" };

const CAMP_RULES = [
  ["1", "Lleva un mensaje nuevo a audiencia fría (Reels de expansión)."],
  ["2", "Empuja una conversión medible con un solo link (lista / registro / puja)."],
  ["3", "Ya gana en orgánico → amplificas un ganador probado."],
];

export default function Tablero() {
  return (
    <div className={s.root}>
      <div className={s.topbar}>
        <Link href="/tablero" className={s.navActive}>Plan</Link>
        <Link href="/tablero/audit">Audit VMC</Link>
        <span className={s.muted}>Subastop · plan de contenido</span>
      </div>

      <div className={s.wrap}>
        <header className={s.heroSlim}>
          <div>
            <div className={s.brandChip}><span className={s.dot} /> <b>@vmcsubastas</b></div>
            <h1>Grilla de contenido <span className={s.grad}>VMC Subastas</span></h1>
          </div>
        </header>

        <div className={s.rulesNote}>
          <p className={s.rulesHead}>📣 Reglas de pauta <span>una pieza lleva campaña solo si cumple ≥1</span></p>
          <ul className={s.rulesList}>
            {CAMP_RULES.map(([n, t]) => (<li key={n}><b>{n}</b> {t}</li>))}
          </ul>
          <p className={s.rulesFoot}>Si no cumple ninguna, se queda orgánica. Objetivos: <b>Alcance</b> (frío) · <b>Tráfico</b> (retarget → lista) · <b>Conversión</b> (registro/puja). ~60% del presupuesto, del reveal en adelante.</p>
        </div>

        <h2 className={s.sec}><span className={s.n}>01</span> Perfil en Instagram <span className={s.hint}>vista previa editable · así se ve en el celular</span></h2>
        <Profile />

        <h2 className={s.sec}><span className={s.n}>02</span> Grilla del feed <span className={s.hint}>Reel / Carrusel / Foto · clic para editar</span></h2>
        <MatrixEditor />

        <h2 className={s.sec}><span className={s.n}>03</span> Slogans <span className={s.hint}>opciones editables · copia el que uses</span></h2>
        <Copys />
      </div>
    </div>
  );
}
