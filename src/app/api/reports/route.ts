import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') // WEEKLY or MONTHLY
    
    // Demo: Return mock data for now
    const mockReports = [
      { id: "1", sale_id: "1", period: "MONTHLY", new_projects_count: 5, won_deals_value: 450000, conversion_rate: 32.5, generated_at: "2026-03-01", sale: { name: "สมชาย ใจดี" } },
      { id: "2", sale_id: "2", period: "MONTHLY", new_projects_count: 3, won_deals_value: 280000, conversion_rate: 25.0, generated_at: "2026-03-01", sale: { name: "วิชัย มาก" } },
    ]

    return NextResponse.json({ reports: mockReports })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sale_id, period } = body

    if (!sale_id || !period) {
      return NextResponse.json(
        { error: 'Sale ID and period are required' },
        { status: 400 }
      )
    }

    // Calculate report data
    const startDate = period === 'MONTHLY' 
      ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Get new projects count
    const { count: newProjectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', sale_id)
      .gte('created_at', startDate)

    // Get won deals value
    const { data: wonDeals } = await supabase
      .from('deals')
      .select('value')
      .eq('stage', 'WON')
      .gte('created_at', startDate)

    const wonDealsValue = wonDeals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0

    // Calculate conversion rate
    const { count: totalDeals } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate)

    const conversionRate = totalDeals ? ((wonDeals?.length || 0) / totalDeals) * 100 : 0

    // Create report
    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        sale_id,
        period,
        new_projects_count: newProjectsCount || 0,
        won_deals_value: wonDealsValue,
        conversion_rate: conversionRate
      })
      .select()
      .single()

    if (error) {
      console.error('Report create error:', error)
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      )
    }

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Report create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
