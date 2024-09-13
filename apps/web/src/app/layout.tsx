// apps/web/src/app/layout.tsx
import React from "react";
import SettingsButton from "./components/settings-button";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 py-8 relative">
          <SettingsButton />
          {children}
        </div>
      </body>
    </html>
  );
}
