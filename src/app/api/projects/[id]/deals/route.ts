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
    const { id: projectId } = params

    const { data: deals, error } = await supabase
      .from('deals')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Deals fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      )
    }

    return NextResponse.json({ deals: deals || [] })
  } catch (error) {
    console.error('Deals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params
    const body = await request.json()
    const { value, probability, stage, expected_close_date } = body

    if (!value) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      )
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        project_id: projectId,
        value,
        probability: probability || 0,
        stage: stage || 'LEAD',
        expected_close_date
      })
      .select()
      .single()

    if (error) {
      console.error('Deal create error:', error)
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      )
    }

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('Deal create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
