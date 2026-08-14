import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Serif_Bengali } from "next/font/google";
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

export const metadata: Metadata = {
  title: "THAKUR DEKHTE JABI?",
  description: "A digital Pujo experience. Ekhane eshe boshe porlam.",
  openGraph: {
    title: "THAKUR DEKHTE JABI?",
    description: "A digital Pujo experience.",
    type: "website",
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
      </body>
    </html>
  );
}
