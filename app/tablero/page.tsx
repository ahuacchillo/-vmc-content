import Link from "next/link";
import s from "./page.module.css";
import MatrixEditor from "./MatrixEditor";
import Copys from "./Copys";
import Profile from "./Profile";

export const metadata = { title: "Plan de lanzamiento · @vmcsubastas" };

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
            <div className={s.brandChip}><span className={s.dot} /> Relanzamiento · <b>@vmcsubastas</b></div>
            <h1>Plan de lanzamiento <span className={s.grad}>· 15 jul</span></h1>
          </div>
          <div className={s.launchSlim}>Lanzamiento <b>15 Jul</b> · Mié</div>
        </header>

        <h2 className={s.sec}><span className={s.n}>01</span> Perfil en Instagram <span className={s.hint}>vista previa editable · así se ve en el celular</span></h2>
        <Profile />

        <h2 className={s.sec}><span className={s.n}>02</span> Grilla del feed <span className={s.hint}>7 días · Reel / Carrusel / Foto · clic para editar</span></h2>
        <MatrixEditor />

        <h2 className={s.sec}><span className={s.n}>03</span> Copys y slogans <span className={s.hint}>opciones editables · copia la que uses</span></h2>
        <Copys />

        <footer className={s.footer}>Plan de lanzamiento · @vmcsubastas · presentación 08 jul · lanzamiento 15 jul 2026</footer>
      </div>
    </div>
  );
}
