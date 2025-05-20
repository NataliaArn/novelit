"use client";

import "./globals.css";
import Header from "./components/Header";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children, session }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        <Header />
        <SessionProvider session={session}>
          <div id="page-content">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
