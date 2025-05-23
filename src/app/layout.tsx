import "../../styles/global.css";
import { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Remotion and Next.js",
  description: "Remotion and Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#101828]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
