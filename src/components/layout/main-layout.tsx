import { Sidebar } from "@/components/layout/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
    avatar_url?: string
    role: string
  }
}

export function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      <main className="md:pl-64 min-h-screen">
        <div className="container mx-auto p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}
