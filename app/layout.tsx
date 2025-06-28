import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import HelpChat from "@/components/help-chat"
import { AuthProvider } from "@/components/auth-provider" // ⬅️ import it
import { CookieBanner } from "@/components/CookieBanner";


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Traffic Montenegro - Real-time Traffic Reports",
  description: "Report and view traffic jams, accidents, and road blockages in Montenegro in real-time.",
  keywords: "Montenegro, traffic, jams, accidents, road conditions, real-time",
  authors: [{ name: "Traffic Montenegro Team" }],
  openGraph: {
    title: "Traffic Montenegro - Real-time Traffic Reports",
    description: "Report and view traffic jams, accidents, and road blockages in Montenegro in real-time.",
    type: "website",
    locale: "en_US",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        />
      </head>
      <body className={inter.className}>

        <AuthProvider> {/* ✅ Wrap everything inside AuthProvider */}
          <ThemeProvider defaultTheme="system">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main>{children}</main>
              <HelpChat />
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
                <CookieBanner />
      </body>
    </html>
  )
}
