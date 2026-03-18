"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  FolderKanban,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

// Demo data
const mockProjects = [
  { 
    id: "1", 
    name: "Website บริษัท ABC", 
    client: "ABC Co.", 
    client_contact: "john@abc.com",
    status: "PROGRESS", 
    value: 150000, 
    created_at: "2026-03-15",
    updated_at: "2026-03-17",
    created_by: "สมชาย ใจดี"
  },
  { 
    id: "2", 
    name: "Mobile App ร้านค้า", 
    client: "Shop Co.", 
    client_contact: "info@shop.co.th",
    status: "NEW", 
    value: 300000, 
    created_at: "2026-03-17",
    updated_at: "2026-03-17",
    created_by: "สมชาย ใจดี"
  },
  { 
    id: "3", 
    name: "ระบบ ERP", 
    client: "Factory Ltd.", 
    client_contact: "contact@factory.co.th",
    status: "DONE", 
    value: 500000, 
    created_at: "2026-02-01",
    updated_at: "2026-03-10",
    created_by: "สมชาย ใจดี"
  },
  { 
    id: "4", 
    name: "POS System", 
    client: "Retail Shop", 
    client_contact: "owner@retail.com",
    status: "NEGOTIATION", 
    value: 250000, 
    created_at: "2026-03-10",
    updated_at: "2026-03-16",
    created_by: "วิชัย มาก"
  },
  { 
    id: "5", 
    name: "Inventory System", 
    client: "Warehouse Co.", 
    client_contact: "manager@warehouse.com",
    status: "PROPOSAL", 
    value: 180000, 
    created_at: "2026-03-12",
    updated_at: "2026-03-14",
    created_by: "สมชาย ใจดี"
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">โปรเจกต์</h1>
          <p className="text-muted-foreground">จัดการโปรเจกต์และติดตาม Deal ของคุณ</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link href="/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            สร้างโปรเจกต์ใหม่
          </Link>
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาโปรเจกต์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="NEW">NEW</SelectItem>
            <SelectItem value="PROGRESS">PROGRESS</SelectItem>
            <SelectItem value="DONE">DONE</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={item}>
            <Card className="card-hover">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <Link href={`/projects/${project.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-lg truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{project.client}</p>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold">{formatCurrency(project.value)}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updated_at)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            ดูรายละเอียด
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            แก้ไข
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">ไม่พบโปรเจกต์</p>
        </div>
      )}
    </div>
  )
}
