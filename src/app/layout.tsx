import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeInit from "@/components/ThemeInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noleto iPhones | Os melhores iPhones e acessorios Apple",
  description:
    "Loja especializada em iPhones, AirPods, Apple Watch e acessorios Apple. Qualidade garantida e os melhores precos do mercado.",
  keywords: ["iPhone", "Apple", "AirPods", "Apple Watch", "acessorios Apple", "Noleto iPhones"],
  openGraph: {
    title: "Noleto iPhones | Os melhores iPhones e acessorios Apple",
    description: "Loja especializada em iPhones, AirPods, Apple Watch e acessorios Apple.",
    type: "website",
    locale: "pt_BR",
    siteName: "Noleto iPhones",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noleto iPhones",
    description: "Os melhores iPhones e acessorios Apple com qualidade garantida.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash: read theme from localStorage before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("store-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else if(window.matchMedia("(prefers-color-scheme:light)").matches){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
