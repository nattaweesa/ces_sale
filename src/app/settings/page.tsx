"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Palette,
  Save
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

// Demo user
const mockUser = {
  name: "สมชาย ใจดี",
  email: "sale@ces.co.th",
  role: "SALE",
  avatar_url: ""
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">ตั้งค่า</h1>
        <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวและการตั้งค่าระบบ</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              โปรไฟล์
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              การแจ้งเตือน
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              ความปลอดภัย
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              หน้าตา
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
                <CardDescription>จัดการข้อมูลส่วนตัวของคุณ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mockUser.avatar_url} />
                    <AvatarFallback className="text-xl bg-primary/10">
                      {getInitials(mockUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">เปลี่ยนรูปโปรไฟล์</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG ขนาดไม่เกิน 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input id="name" defaultValue={mockUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input id="email" type="email" defaultValue={mockUser.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input id="phone" placeholder="08x-xxx-xxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>ตำแหน่ง</Label>
                    <Input value={mockUser.role === 'SALE' ? 'พนักงานขาย' : 'ผู้จัดการ'} disabled />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>การแจ้งเตือน</CardTitle>
                <CardDescription>ตั้งค่าการแจ้งเตือนที่คุณต้องการรับ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'email', label: 'อีเมล', desc: 'รับการแจ้งเตือนทางอีเมล' },
                  { id: 'project', label: 'อัพเดตโปรเจกต์', desc: 'เมื่อมีการอัพเดตสถานะโปรเจกต์' },
                  { id: 'deal', label: 'Deal ใหม่', desc: 'เมื่อมี Deal ใหม่หรืออัพเดต' },
                  { id: 'report', label: 'รายงานประจำเดือน', desc: 'ส่งรายงานอัตโนมัติทุกเดือน' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>ความปลอดภัย</CardTitle>
                <CardDescription>จัดการรหัสผ่านและความปลอดภัยของบัญชี</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>รหัสผ่านปัจจุบัน</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>รหัสผ่านใหม่</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>ยืนยันรหัสผ่านใหม่</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Lock className="w-4 h-4 mr-2" />
                    เปลี่ยนรหัสผ่าน
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>หน้าตา</CardTitle>
                <CardDescription>ปรับแต่งรูปลักษณ์ของแอปพลิเคชัน</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ธีม</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', preview: 'bg-white' },
                      { id: 'dark', label: 'Dark', preview: 'bg-slate-900' },
                      { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-slate-900' },
                    ].map((theme) => (
                      <div 
                        key={theme.id}
                        className="p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors"
                      >
                        <div className={`h-16 rounded-md ${theme.preview} mb-2 border`} />
                        <p className="text-center text-sm font-medium">{theme.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
