import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";

import Header from "./_partials/Header";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MumCentral",
  description:
    "Find trusted clinics, schedule antenatal & postnatal visits, track infant growth, and access mental health support—all in one web app built for Nigerian mothers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${openSans.className} antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontSize: "14px",
            },
          }}
        />
        <div className="flex flex-col h-dvh w-dvw bg-[#f9f9f9] text-[#333]">
          <Header />

          <div className="w-dvw overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 py-5">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
