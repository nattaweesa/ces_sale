import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CES Sales CRM",
  description: "Sales Project Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
