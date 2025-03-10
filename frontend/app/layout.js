import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Log File Upload",
  description: "Upload and analyze your log files.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#F9F9F9] to-[#E1E1E1] min-h-screen`}
      >
        <div className="container mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
