import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import { ToastContainer,Slide } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pulse | Media Player",
  description: "Pulse-Stream is a minimalist, high-performance music streaming interface designed for speed and simplicity. Inspired by the \"dark mode\" aesthetics of modern players like Spotify, it focuses on a \"Pulse\" (the heart of the music) and \"Stream\" (the seamless flow of data).",
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white flex h-screen`}
      >
        <SideBar />

        {/* Main area */}
        <main className="flex-1 h-full overscroll-none">
          {children}
        </main>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
      </body>
    </html>
  );
}