import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Aadhar Manuskicha | आधार माणुसकीचा",
  description: "Inspired by Sant Gadgebaba, we transform rural lives through education, healthcare, women empowerment, and sustainable community development in Marathwada, Maharashtra.",
  keywords: "NGO, Aadhar Manuskicha, Sant Gadgebaba, Ambajogai, Beed, Maharashtra, charity, education, rural development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
