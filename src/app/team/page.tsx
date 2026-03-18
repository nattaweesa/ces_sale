"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Users,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  MoreVertical,
  Mail,
  Phone
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"

// Demo data
const mockTeam = [
  { 
    id: "1", 
    name: "สมศักดิ์ ผู้จัดการ", 
    email: "manager@ces.co.th", 
    role: "MANAGER",
    stats: { totalProjects: 15, activeProjects: 8, completedProjects: 7 }
  },
  { 
    id: "2", 
    name: "สมชาย ใจดี", 
    email: "sale1@ces.co.th", 
    role: "SALE",
    stats: { totalProjects: 12, activeProjects: 5, completedProjects: 7 }
  },
  { 
    id: "3", 
    name: "วิชัย มาก", 
    email: "sale2@ces.co.th", 
    role: "SALE",
    stats: { totalProjects: 8, activeProjects: 3, completedProjects: 5 }
  },
  { 
    id: "4", 
    name: "สมชาย ใจดี", 
    email: "sale3@ces.co.th", 
    role: "SALE",
    stats: { totalProjects: 6, activeProjects: 2, completedProjects: 4 }
  },
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

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTeam = mockTeam.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Manager</Badge>
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Admin</Badge>
      default:
        return <Badge variant="outline">Sale</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">ทีม</h1>
          <p className="text-muted-foreground">จัดการทีมขายและดูผลงาน</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Users className="w-4 h-4 mr-2" />
          เชิญสมาชิกใหม่
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md"
      >
        <Input
          placeholder="ค้นหาทีม..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Team Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredTeam.map((member) => (
          <motion.div key={member.id} variants={item}>
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      {getRoleBadge(member.role)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        ส่งอีเมล
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="w-4 h-4 mr-2" />
                        โทร
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xl font-bold">{member.stats.totalProjects}</p>
                      <p className="text-xs text-muted-foreground">ทั้งหมด</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{member.stats.activeProjects}</p>
                      <p className="text-xs text-muted-foreground">กำลังทำ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{member.stats.completedProjects}</p>
                      <p className="text-xs text-muted-foreground">เสร็จ</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/team/${member.id}`}>
                      <FolderKanban className="w-4 h-4 mr-2" />
                      ดูโปรเจกต์
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredTeam.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">ไม่พบสมาชิกในทีม</p>
        </div>
      )}
    </div>
  )
}
