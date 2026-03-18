import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('projects')
      .select(`
        *,
        creator:users!projects_created_by_fkey(name, email, role),
        assigned_sales(
          sale:users(id, name, email, role)
        ),
        details:project_details(*),
        deals(*)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,client_name.ilike.%${search}%`)
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Projects fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    // Transform the data
    const transformedProjects = projects?.map(p => ({
      ...p,
      creator: p.creator?.[0],
      assigned_sales: p.assigned_sales?.map((a: any) => a.sale).filter(Boolean)
    })) || []

    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    console.error('Projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, client_name, client_contact, status, details } = body

    if (!name || !client_name) {
      return NextResponse.json(
        { error: 'Name and client are required' },
        { status: 400 }
      )
    }

    // Demo user ID (in production, get from session)
    const created_by = 'demo-user-id'

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        client_name,
        client_contact,
        status: status || 'NEW',
        created_by
      })
      .select()
      .single()

    if (error) {
      console.error('Project create error:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // Create project details if provided
    if (details) {
      const { error: detailsError } = await supabase
        .from('project_details')
        .insert({
          project_id: project.id,
          ...details
        })

      if (detailsError) {
        console.error('Project details error:', detailsError)
      }
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Project create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
