import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Models Showcase",
  description: "Browse and explore amazing 3D models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
