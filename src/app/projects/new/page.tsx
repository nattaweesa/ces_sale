"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Save,
  Plus,
  Trash2,
  User,
  DollarSign,
  Calendar,
  FileText,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "CANCELLED", label: "Cancelled" },
]

const mockSalesTeam = [
  { id: "1", name: "สมชาย ใจดี" },
  { id: "2", name: "วิชัย มาก" },
  { id: "3", name: "สมศักดิ์ ผู้จัดการ" },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_name: "",
    client_contact: "",
    status: "NEW",
    requirement: "",
    budget: "",
    timeline: "",
    notes: "",
    assigned_sales: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/projects")
    }, 1000)
  }

  const toggleSale = (saleId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_sales: prev.assigned_sales.includes(saleId)
        ? prev.assigned_sales.filter(id => id !== saleId)
        : [...prev.assigned_sales, saleId]
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
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

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">สร้างโปรเจกต์ใหม่</h1>
        </div>
        <p className="text-muted-foreground">กรอกข้อมูลโปรเจกต์ใหม่ของคุณ</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                ข้อมูลพื้นฐาน
              </CardTitle>
              <CardDescription>ข้อมูลหลักของโปรเจกต์</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อโปรเจกต์ *</Label>
                  <Input 
                    id="name" 
                    placeholder="ชื่อโปรเจกต์"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">สถานะ</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea 
                  id="description" 
                  placeholder="คำอธิบายโปรเจกต์..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                ข้อมูลลูกค้า
              </CardTitle>
              <CardDescription>ข้อมูลติดต่อลูกค้า</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_name">ชื่อลูกค้า *</Label>
                  <Input 
                    id="client_name" 
                    placeholder="ชื่อบริษัท/ลูกค้า"
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_contact">ติดต่อ</Label>
                  <Input 
                    id="client_contact" 
                    placeholder="อีเมลหรือเบอร์โทร"
                    value={formData.client_contact}
                    onChange={(e) => setFormData({...formData, client_contact: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                รายละเอียดโปรเจกต์
              </CardTitle>
              <CardDescription>ข้อมูลเพิ่มเติมสำหรับการติดตาม</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirement">ความต้องการ</Label>
                <Textarea 
                  id="requirement" 
                  placeholder="รายละเอียดความต้องการ..."
                  value={formData.requirement}
                  onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget">งบประมาณ (บาท)</Label>
                  <Input 
                    id="budget" 
                    type="number"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input 
                    id="timeline" 
                    placeholder="เช่น 2 เดือน"
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">หมายเหตุ</Label>
                <Textarea 
                  id="notes" 
                  placeholder="หมายเหตุเพิ่มเติม..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assign Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                มอบหมายงาน
              </CardTitle>
              <CardDescription>เลือกทีมที่ดูแลโปรเจกต์</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockSalesTeam.map((sale) => (
                  <Button
                    key={sale.id}
                    type="button"
                    variant={formData.assigned_sales.includes(sale.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSale(sale.id)}
                    className="gap-2"
                  >
                    {formData.assigned_sales.includes(sale.id) && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                    {sale.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/projects">ยกเลิก</Link>
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'กำลังบันทึก...' : 'บันทึกโปรเจกต์'}
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  )
}
