import Script from "next/script"
import { AppStateProvider } from "@/lib/state"
import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "PJSK 大门升级材料管理器",
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <AppStateProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppStateProvider>
        <Script defer src="https://a-zan.xyz/site-footer.js" data-testid="site-footer-script" charSet="utf-8" />
      </body>
    </html>
  )
}
