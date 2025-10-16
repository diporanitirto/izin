import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surat Ijin Tidak Mengikuti Pramuka",
  description: "Generator surat izin tidak mengikuti kegiatan Pramuka dengan preview A4 dan unduh PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans p-5">
        {children}
      </body>
    </html>
  );
}
