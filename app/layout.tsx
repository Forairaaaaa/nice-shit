import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nice Shit",
  description: "Forairaaaaa personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
