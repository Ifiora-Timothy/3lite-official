import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthContext";
import { PropsWithChildren } from "react";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WalletConnectionProvider } from "./contexts/WalletProvider";
import { Metadata, Viewport } from "next";
import { Space_Grotesk } from 'next/font/google';


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


const spaceGrotesk= Space_Grotesk({
  subsets: ['latin',"vietnamese"],
  weight: ['300','400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body
         
          className={`  ${spaceGrotesk.className}  h-screen  w-screen  overflow-x-hidden dark  antialiased`}
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
