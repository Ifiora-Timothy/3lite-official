import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthContext";
import { Plus_Jakarta_Sans, Poppins, SUSE, Syne } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WalletConnectionProvider } from "./contexts/WalletProvider";
import { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "cyrillic-ext", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["greek", "latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
const suse = SUSE({
  variable: "--font-suse",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata:Metadata = {
  title: "3LiteMessenger - Secure and Private Messaging",
  description: "3Lite is a social media app built on the solana Network",
  
};
export const viewport:Viewport = {
  initialScale: 1,
  width: "device-width",
  height: "device-height",
  maximumScale: 1,
  minimumScale: 1,

}

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body
         
          className={`${plusJakartaSans.variable} ${syne.variable} ${suse.variable} ${inter.className} ${poppins.variable} h-screen  w-screen  overflow-x-hidden dark  antialiased`}
        >
          <WalletConnectionProvider>


          <AuthProvider>
            {children}
          </AuthProvider>
          </WalletConnectionProvider>
          <Toaster richColors position="top-right" />
        </body>
      </ThemeProvider>
    </html>
  );
}
