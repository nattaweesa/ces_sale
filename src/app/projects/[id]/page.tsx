"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Plus,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  User,
  MessageSquare,
  FileText,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from "@/lib/utils"

// Demo data
const mockProject = {
  id: "1",
  name: "Website บริษัท ABC",
  description: "พัฒนาเว็บไซต์บริษัทครบวงจร",
  client_name: "ABC Co.",
  client_contact: "john@abc.com",
  status: "PROGRESS",
  created_by: "สมชาย ใจดี",
  created_at: "2026-03-15",
  updated_at: "2026-03-17",
  details: {
    requirement: "ต้องการเว็บไซต์บริษัท 5 หน้า รวม Contact Form",
    budget: 150000,
    timeline: "2 เดือน",
    notes: "ลูกค้าต้องการเริ่มโปรเจกต์เร็วๆ นี้"
  },
  assigned_sales: [
    { id: "1", name: "สมชาย ใจดี", role: "SALE" },
    { id: "2", name: "วิชัย มาก", role: "SALE" }
  ]
}

const mockDeals = [
  { id: "1", value: 150000, probability: 70, stage: "PROPOSAL", expected_close_date: "2026-04-15", created_at: "2026-03-15" },
  { id: "2", value: 50000, probability: 100, stage: "WON", expected_close_date: "2026-03-01", created_at: "2026-02-01" },
]

const mockFollowUps = [
  { id: "1", content: "ส่ง proposal ให้ลูกค้าแล้ว", created_by: "สมชาย ใจดี", created_at: "2026-03-17T10:30:00" },
  { id: "2", content: "นัดพบลูกค้าวันศุกร์", created_by: "สมชาย ใจดี", created_at: "2026-03-16T14:00:00" },
  { id: "3", content: "เริ่มทำ mockup", created_by: "สมชาย ใจดี", created_at: "2026-03-15T09:00:00" },
]

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      LEAD: "bg-gray-100 text-gray-700",
      PROPOSAL: "bg-purple-100 text-purple-700",
      NEGOTIATION: "bg-orange-100 text-orange-700",
      WON: "bg-green-100 text-green-700",
      LOST: "bg-red-100 text-red-700",
    }
    return colors[stage] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปโปรเจกต์
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{mockProject.name}</h1>
              <Badge className={getStatusColor(mockProject.status)}>
                {mockProject.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{mockProject.client_name} • {mockProject.client_contact}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/projects/${params.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                แก้ไข
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              ลบ
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">มูลค่า</p>
                <p className="font-semibold">{formatCurrency(150000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">โอกาส</p>
                <p className="font-semibold">70%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ปิด Deal</p>
                <p className="font-semibold">15 เม.ย.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">อัพเดตล่าสุด</p>
                <p className="font-semibold">{formatDate(mockProject.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">รายละเอียด</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activity">กิจกรรม</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ข้อมูลโปรเจกต์</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">ความต้องการ</Label>
                    <p className="mt-1">{mockProject.details.requirement}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">งบประมาณ</Label>
                    <p className="mt-1">{formatCurrency(mockProject.details.budget || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Timeline</Label>
                    <p className="mt-1">{mockProject.details.timeline}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">ผู้สร้าง</Label>
                    <p className="mt-1">{mockProject.created_by}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">หมายเหตุ</Label>
                  <p className="mt-1">{mockProject.details.notes}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">ทีมที่ดูแล</Label>
                  <div className="flex gap-2 mt-1">
                    {mockProject.assigned_sales?.map(sale => (
                      <Badge key={sale.id} variant="outline">
                        <User className="w-3 h-3 mr-1" />
                        {sale.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Deals</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่ม Deal
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDeals.map(deal => (
                    <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Badge className={getStageColor(deal.stage)}>
                          {deal.stage}
                        </Badge>
                        <div>
                          <p className="font-medium">{formatCurrency(deal.value)}</p>
                          <p className="text-sm text-muted-foreground">Probability: {deal.probability}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Expected: {formatDate(deal.expected_close_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">กิจกรรม</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มกิจกรรม
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFollowUps.map(followUp => (
                    <div key={followUp.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{followUp.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {followUp.created_by} • {formatDateTime(followUp.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
