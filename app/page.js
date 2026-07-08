import { redirect } from "next/navigation";

// La cara de la app es el plan de contenido; el publicador vive en /publicar.
export default function Home() {
  redirect("/tablero");
}
