import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const tierHierarchy = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3
}

export async function GET() {
  try {

    
    // Fix: Await the auth() function call
    const { userId } = await auth()
    const user = await currentUser()




    if (!userId || !user) {

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTier = (user.publicMetadata?.tier as string) || 'free'
    const userTierLevel = tierHierarchy[userTier as keyof typeof tierHierarchy]
    


    // Test Supabase connection

    const { data: testConnection, error: connectionError } = await supabase
      .from('events')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      console.error('❌ Supabase connection error:', connectionError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: connectionError.message 
      }, { status: 500 })
    }



    // Fetch all events

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      console.error('❌ Error fetching events:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch events', 
        details: error.message 
      }, { status: 500 })
    }



    // Filter events based on user tier
    const accessibleEvents = events?.filter(event => 
      tierHierarchy[event.tier as keyof typeof tierHierarchy] <= userTierLevel
    ) || []

    const nonAccessibleEvents = events?.filter(event => 
      tierHierarchy[event.tier as keyof typeof tierHierarchy] > userTierLevel
    ) || []




    return NextResponse.json({
      accessible: accessibleEvents,
      nonAccessible: nonAccessibleEvents,
      userTier,
      totalEvents: events?.length || 0
    })
  } catch (error) {

    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
