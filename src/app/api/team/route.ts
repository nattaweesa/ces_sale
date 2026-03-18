import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // Get all sales and managers
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, created_at')
      .in('role', ['SALE', 'MANAGER', 'ADMIN'])
      .order('name')

    if (error) {
      console.error('Team fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team' },
        { status: 500 }
      )
    }

    // Get project count for each user
    const { data: projectCounts } = await supabase
      .from('projects')
      .select('created_by, status')

    const teamWithStats = users?.map(user => {
      const userProjects = projectCounts?.filter(p => p.created_by === user.id) || []
      return {
        ...user,
        stats: {
          totalProjects: userProjects.length,
          activeProjects: userProjects.filter(p => p.status === 'PROGRESS').length,
          completedProjects: userProjects.filter(p => p.status === 'DONE').length
        }
      }
    }) || []

    return NextResponse.json({ team: teamWithStats })
  } catch (error) {
    console.error('Team error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
