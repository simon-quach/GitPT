import "./globals.css";

import Image from "next/image";
import ThreeD from "./components/ThreeD";

export const metadata = {
  title: "GitPT",
  description: "Decoding Complex Codebases, One Chat at a Time",
  icons: {
    icon: "./gitpt-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1B1C1E] text-[#c8c8c8] font-montserrat">
      <div className="fixed z-[-1]">
          <ThreeD />
        </div>
        <nav className="flex h-[100px] text-[14px] items-center px-[3rem] justify-between">
          <Image
            src="./gitpt-logo.svg"
            alt="gitpt-logo"
            width={48}
            height={48}
            className="cursor-pointer text-white"
          />
          <div className="flex gap-[3rem] items-center">
            <div className="cursor-pointer hover:text-white transition-all">
              Home
            </div>
            <div className="cursor-pointer hover:text-white transition-all">
              About
            </div>
            <div className="cursor-pointer hover:text-white transition-all">
              Services
            </div>
            <div className="font-bold bg-white text-[#1B1C1E] px-[1.5rem] py-[1rem] rounded-md cursor-pointer hover:bg-[#1B1C1E] hover:text-white border-[1px] transition-all">
              Get Started
            </div>
          </div>
        </nav>
        
        
        {children}
      </body>
    </html>
  );
}
