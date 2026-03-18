import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Demo user ID
    const created_by = 'demo-user-id'

    const { data: followUp, error } = await supabase
      .from('follow_ups')
      .insert({
        project_id: projectId,
        content,
        created_by
      })
      .select(`
        *,
        creator:users(name)
      `)
      .single()

    if (error) {
      console.error('Follow-up create error:', error)
      return NextResponse.json(
        { error: 'Failed to create follow-up' },
        { status: 500 }
      )
    }

    return NextResponse.json({ followUp }, { status: 201 })
  } catch (error) {
    console.error('Follow-up create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
