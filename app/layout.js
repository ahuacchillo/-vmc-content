import "./globals.css";

export const metadata = {
  title: "Subastop · Publicador de Instagram",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
