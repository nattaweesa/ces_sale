"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  FolderKanban,
  DollarSign
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

// Demo data
const mockReports = [
  { 
    id: "1", 
    sale: { name: "สมชาย ใจดี" }, 
    period: "MONTHLY", 
    new_projects_count: 5, 
    won_deals_value: 450000, 
    conversion_rate: 32.5, 
    generated_at: "2026-03-01" 
  },
  { 
    id: "2", 
    sale: { name: "วิชัย มาก" }, 
    period: "MONTHLY", 
    new_projects_count: 3, 
    won_deals_value: 280000, 
    conversion_rate: 25.0, 
    generated_at: "2026-03-01" 
  },
]

const mockTeamStats = [
  { name: "สมชาย ใจดี", projects: 12, revenue: 850000, won: 8, rate: 32 },
  { name: "วิชัย มาก", projects: 8, revenue: 520000, won: 5, rate: 28 },
  { name: "สมศักดิ์ ผู้จัดการ", projects: 15, revenue: 1200000, won: 12, rate: 35 },
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

export default function ReportsPage() {
  const [period, setPeriod] = useState("MONTHLY")

  const totalProjects = mockTeamStats.reduce((sum, t) => sum + t.projects, 0)
  const totalRevenue = mockTeamStats.reduce((sum, t) => sum + t.revenue, 0)
  const avgRate = Math.round(mockTeamStats.reduce((sum, t) => sum + t.rate, 0) / mockTeamStats.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">รายงาน</h1>
          <p className="text-muted-foreground">ภาพรวมผลการดำเนินงานของทีมขาย</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">รายเดือน</SelectItem>
              <SelectItem value="WEEKLY">รายสัปดาห์</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">โปรเจกต์ทั้งหมด</p>
                  <p className="text-3xl font-bold mt-1">{totalProjects}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% จากเดือนก่อน
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">รายได้รวม</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18% จากเดือนก่อน
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold mt-1">{avgRate}%</p>
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -3% จากเดือนก่อน
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="team">
          <TabsList>
            <TabsTrigger value="team">ภาพรวมทีม</TabsTrigger>
            <TabsTrigger value="personal">รายบุคคล</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>ผลงานทีมขาย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">พนักงาน</th>
                        <th className="text-right py-3 px-4 font-medium">โปรเจกต์</th>
                        <th className="text-right py-3 px-4 font-medium">Won</th>
                        <th className="text-right py-3 px-4 font-medium">รายได้</th>
                        <th className="text-right py-3 px-4 font-medium">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTeamStats.map((member, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {member.name.charAt(0)}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{member.projects}</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="success">{member.won}</Badge>
                          </td>
                          <td className="text-right py-3 px-4 font-medium">{formatCurrency(member.revenue)}</td>
                          <td className="text-right py-3 px-4">
                            <span className={member.rate >= 30 ? "text-green-600" : "text-yellow-600"}>
                              {member.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="mt-4 space-y-4">
            {mockReports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.sale.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {report.period === 'MONTHLY' ? 'รายเดือน' : 'รายสัปดาห์'} • {new Date(report.generated_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <Badge variant="outline">{report.period}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{report.new_projects_count}</p>
                      <p className="text-sm text-muted-foreground">โปรเจกต์ใหม่</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(report.won_deals_value)}</p>
                      <p className="text-sm text-muted-foreground">รายได้</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{report.conversion_rate}%</p>
                      <p className="text-sm text-muted-foreground">Conversion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
