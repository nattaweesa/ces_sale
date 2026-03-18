export type UserRole = 'SALE' | 'MANAGER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type ProjectStatus = 'NEW' | 'PROGRESS' | 'DONE' | 'CANCELLED'

export interface Project {
  id: string
  name: string
  description?: string
  client_name: string
  client_contact?: string
  status: ProjectStatus
  created_by: string
  created_at: string
  updated_at: string
  // Joined fields
  creator?: User
  assigned_sales?: User[]
  details?: ProjectDetail
  deals?: Deal[]
}

export interface ProjectDetail {
  id: string
  project_id: string
  requirement?: string
  budget?: number
  timeline?: string
  notes?: string
  custom_fields?: Record<string, any>
}

export type DealStage = 'LEAD' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'

export interface Deal {
  id: string
  project_id: string
  value: number
  probability: number
  stage: DealStage
  expected_close_date?: string
  created_at: string
  updated_at: string
}

export interface FollowUp {
  id: string
  project_id: string
  content: string
  created_by: string
  created_at: string
  creator?: User
}

export type ReportPeriod = 'WEEKLY' | 'MONTHLY'

export interface Report {
  id: string
  sale_id: string
  period: ReportPeriod
  new_projects_count: number
  won_deals_value: number
  conversion_rate: number
  generated_at: string
  sale?: User
}

export interface DashboardStats {
  totalProjects: number
  activeDeals: number
  thisMonthRevenue: number
  conversionRate: number
}
