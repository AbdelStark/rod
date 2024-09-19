"use client";
import React from "react";
import "../styles/globals.css";
import { NostrProvider } from "./context";
import { TanstackProvider } from "./context/TanstackProvider";
import { ToastProvider } from "../hooks/useToast";
import ToastContainer from "./components/toast-container";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
        <div className="container mx-auto px-4 py-8 relative max-w-md">
          <NostrProvider>
            <TanstackProvider>
              <ToastProvider>
                {children}
                <ToastContainer></ToastContainer>
              </ToastProvider>
            </TanstackProvider>
          </NostrProvider>
        </div>
      </body>
    </html>
  );
}
