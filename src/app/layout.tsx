import { Toaster } from "sonner";
import AppWalletProvider from "@/app/components/WalletFeature";
import { AuthProvider } from "./providers/AuthContext";
import { Plus_Jakarta_Sans, Poppins, SUSE, Syne } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";

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

export const metadata = {
  title: "3Lite",
  description: "3Lite is a social media app built on the solana Network",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${syne.variable} ${suse.variable}  ${poppins.variable} h-screen  w-screen  overflow-x-hidden dak antialiased`}
      >
        <AuthProvider>
          <AppWalletProvider>{children}</AppWalletProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
