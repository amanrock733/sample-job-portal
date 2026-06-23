import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionInitializer } from "@/components/providers/session-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPortal — Find your next role",
  description:
    "A modern job portal where candidates discover opportunities and admins manage hiring — built with Next.js, Prisma, JWT auth, and dark mode.",
  keywords: [
    "job portal",
    "job board",
    "MERN",
    "Next.js",
    "Prisma",
    "recruitment",
    "hiring",
  ],
  authors: [{ name: "JobPortal" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SessionInitializer>
              {children}
            </SessionInitializer>
            <Toaster />
            <SonnerToaster position="top-right" richColors closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
