import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BlockchainProvider } from "../contexts/BlockchainContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClearFund - Secure Crowdfunding Platform",
  description: "A secure, transparent crowdfunding platform with KYC/KYB verification, milestone tracking, and AI fraud detection.",
  keywords: "crowdfunding, fundraising, secure donations, KYC, milestones, escrow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn-uicons.flaticon.com/2.0.0/uicons/css/uicons-rounded-thin.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={inter.className}>
        <BlockchainProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </BlockchainProvider>
      </body>
    </html>
  );
}