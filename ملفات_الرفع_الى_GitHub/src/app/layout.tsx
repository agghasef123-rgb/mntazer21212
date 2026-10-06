import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة قسم هندسة تكرير النفط والغاز - المحاضرات الهندسية التخصصية",
  description: "المنصة الأكاديمية لرفع ومشاهدة المحاضرات التخصصية والشيتات الهندسية لطلاب قسم هندسة تكرير النفط والغاز",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
