import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "spk/coffee — Pemilihan Coffee Shop Yogyakarta (MFEP)",
  description:
    "Sistem Penunjang Keputusan pemilihan coffee shop di Yogyakarta berdasarkan preferensi pengunjung dengan metode MFEP.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 text-xs text-ink-3">
            <span className="font-mono">spk/coffee</span>
            <span>SPK Pemilihan Coffee Shop Yogyakarta · Metode MFEP</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
