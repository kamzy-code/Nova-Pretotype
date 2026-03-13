import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVA - Social Commerce Platform",
  description: "Verified social commerce platform for vendors and buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
