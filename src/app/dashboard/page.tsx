"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  FolderKanban, 
  TrendingUp, 
  DollarSign, 
  Users,
  Plus,
  ArrowRight,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

// Demo data
const mockUser = {
  name: "สมชาย ใจดี",
  email: "somchai@ces.co.th",
  role: "SALE",
  avatar_url: ""
}

const mockStats = {
  totalProjects: 12,
  activeDeals: 5,
  thisMonthRevenue: 450000,
  conversionRate: 32
}

const mockProjects = [
  { id: "1", name: "Website บริษัท ABC", client: "ABC Co.", status: "PROGRESS", value: 150000, updated_at: "2026-03-15" },
  { id: "2", name: "Mobile App ร้านค้า", client: "Shop Co.", status: "NEW", value: 300000, updated_at: "2026-03-17" },
  { id: "3", name: "ระบบ ERP", client: "Factory Ltd.", status: "DONE", value: 500000, updated_at: "2026-03-10" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [user] = useState(mockUser)

  const stats = [
    { title: "โปรเจกต์ทั้งหมด", value: mockStats.totalProjects, icon: FolderKanban, color: "bg-blue-500" },
    { title: "Deal ที่กำลังดำเนิน", value: mockStats.activeDeals, icon: TrendingUp, color: "bg-purple-500" },
    { title: "รายได้เดือนนี้", value: formatCurrency(mockStats.thisMonthRevenue), icon: DollarSign, color: "bg-green-500" },
    { title: "Conversion Rate", value: `${mockStats.conversionRate}%`, icon: Users, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">สวัสดี, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">ยินดีต้อนรับกลับมา! มาดูภาพรวมวันนี้กัน</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link href="/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            สร้างโปรเจกต์ใหม่
          </Link>
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg shadow-${stat.color.replace('bg-', '')}/20`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>โปรเจกต์ล่าสุด</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-blue-600 transition-colors">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(project.value)}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updated_at)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
