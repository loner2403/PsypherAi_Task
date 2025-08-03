import { getAuth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const email = user.emailAddresses[0]?.emailAddress
    const tier = (user.publicMetadata?.tier as string) || 'free'

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    // Upsert user in Supabase using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        clerk_id: userId,
        email: email,
        tier: tier,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'clerk_id'
      })
      .select()

    if (error) {
      console.error('Error syncing user:', error)
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: data?.[0],
      message: 'User synced successfully' 
    })

  } catch (error) {
    console.error('Unexpected error in sync-user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
