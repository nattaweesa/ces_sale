import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:users!projects_created_by_fkey(name, email, role),
        assigned_sales(
          sale:users(id, name, email, role)
        ),
        details:project_details(*)
      `)
      .eq('id', id)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch deals
    const { data: deals } = await supabase
      .from('deals')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    // Fetch follow-ups
    const { data: followUps } = await supabase
      .from('follow_ups')
      .select(`
        *,
        creator:users(name)
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      project: {
        ...project,
        creator: project.creator?.[0],
        assigned_sales: project.assigned_sales?.map((a: any) => a.sale).filter(Boolean),
        deals: deals || [],
        follow_ups: followUps || []
      }
    })
  } catch (error) {
    console.error('Project detail error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const { name, description, client_name, client_contact, status, details } = body

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name,
        description,
        client_name,
        client_contact,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Project update error:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    // Update or insert details
    if (details) {
      const { error: detailsError } = await supabase
        .from('project_details')
        .upsert({
          project_id: id,
          ...details,
          updated_at: new Date().toISOString()
        })

      if (detailsError) {
        console.error('Project details update error:', detailsError)
      }
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Project delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
