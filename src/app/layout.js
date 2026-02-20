import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiCacheProvider } from "@/lib/api-cache";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Namma Metro Bangalore",
  description: "Find the fastest metro route in Bangalore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4673772994110546"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApiCacheProvider>{children}</ApiCacheProvider>
      </body>
    </html>
  );
}
