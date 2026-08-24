import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeCustomizationProvider } from "@/context/ThemeCustomizationContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PakkaBill — Indian GST Billing & Invoice Generator",
  description:
    "100% Client-Side, Free, No-Login Indian GST Billing web app for Gold, Silver, Grocery & General businesses with 40 print templates and live UPI QR.",
};

const themeInitScript = `
(function() {
  try {
    var mode = localStorage.getItem('pakkabill_theme_mode') || 'dark';
    var palette = localStorage.getItem('pakkabill_color_palette') || 'amber';
    var font = localStorage.getItem('pakkabill_font_style') || 'sans';
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.setAttribute('data-palette', palette);
    root.setAttribute('data-font', font);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-150">
        <ThemeCustomizationProvider>{children}</ThemeCustomizationProvider>
      </body>
    </html>
  );
}
