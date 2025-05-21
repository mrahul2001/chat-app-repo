import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/utils/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Periskope",
  description: "Periskope App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ProtectedRoute>
            <div className="flex h-screen">
              <Sidebar />

              <div className="flex flex-col flex-1 overflow-y-auto">
                <Navbar />
                <div className="flex-1 overflow-auto bg-white">{children}</div>
              </div>
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
