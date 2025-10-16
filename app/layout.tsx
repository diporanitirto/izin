import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surat Ijin Tidak Mengikuti Pramuka",
  description: "Surat izin tidka mengikuti pramuka.",
  icons: {
    icon: "/assets/logo-diporani.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans p-3 sm:p-5" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
