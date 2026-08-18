import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Serif_Bengali } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const bengali = Noto_Serif_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
});

// TODO: replace with the real production domain once deployed (needed so
// the og-image resolves to an absolute URL for link-preview crawlers).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain-here.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "THAKUR DEKHTE JABI?",
  description: "A digital Pujo experience. Ekhane eshe boshe porlam.",
  openGraph: {
    title: "THAKUR DEKHTE JABI?",
    description: "A digital Pujo experience.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thakur Dekhte Jabi?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THAKUR DEKHTE JABI?",
    description: "A digital Pujo experience.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#08070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${bengali.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden bg-black text-[#f3ecdf]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
