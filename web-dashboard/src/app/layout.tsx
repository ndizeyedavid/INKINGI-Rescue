import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inkingi Rescue Dashboard",
  description: "Admin dashboard for managing rescue operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 pl-64">
            <Navbar />
            <div className="p-8 pt-28">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
