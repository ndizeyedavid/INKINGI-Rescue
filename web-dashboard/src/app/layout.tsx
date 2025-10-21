import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inkingi Rescue Dashboard",
  description: "Emergency response and community management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-backgroundLight flex`}>
        <Sidebar />
        <main className="flex-grow p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
