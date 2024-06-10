import type { Metadata } from "next";
import { HM } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goal Tracker App",
  description:
    "A simple tool to make your goals and set a countdown timer to achieve them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={HM.className}>{children}</body>
    </html>
  );
}
