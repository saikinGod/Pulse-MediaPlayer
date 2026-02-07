import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pulse | MediaPlayer",
  description: "A fast, lightweight all-in-one player.",
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body
        // Fixed body with sidebar and scrollable main content
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white flex h-screen overflow-hidden pb-28`}
      >
        <SideBar />
        
        {/* Main scrollable area */}
        <main className="flex-1 h-full overflow-y-auto relative p-8">
          {children}
        </main>
      </body>
    </html>
  );
}