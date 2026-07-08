import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

import type { ReactNode } from "react";

export default function ProgramarLayout({ children }: { children: ReactNode }) {
  return <div className={jakarta.variable}>{children}</div>;
}
