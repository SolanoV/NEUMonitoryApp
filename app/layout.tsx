import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider"; // Adjust the import path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEU MOA Monitoring App",
  description: "Monitor the approval of MOAs entered by the university.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-neu-black min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}