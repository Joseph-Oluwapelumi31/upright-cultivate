import type { Metadata } from "next";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fresh Leafy Greens & Culinary Herbs Supplier in Nigeria | Upright Cultivate",
  description:
    "Upright Cultivate supplies fresh leafy greens and culinary herbs to restaurants, hotels, cafés, supermarkets, caterers, and commercial kitchens in Nigeria.",

  keywords: [
    "leafy greens supplier Nigeria",
    "fresh herbs supplier Nigeria",
    "fresh produce supplier Nigeria",
    "aeroponic farming Nigeria",
    "leafy greens Lagos",
    "culinary herbs Lagos",
    "fresh vegetables Lagos",
  ],

  openGraph: {
    title:
      "Fresh Leafy Greens & Culinary Herbs Supplier in Nigeria | Upright Cultivate",
    description:
      "Fresh leafy greens and culinary herbs grown closer to the businesses that need them.",
    type: "website",
    siteName: "Upright Cultivate",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}