import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { newTier } = await req.json();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate tier value
    const validTiers = ['free', 'silver', 'gold', 'platinum'];
    if (!validTiers.includes(newTier)) {
      return NextResponse.json({ 
        error: 'Invalid tier. Must be one of: free, silver, gold, platinum' 
      }, { status: 400 });
    }

    // Get the clerk client and update user
    const client = await clerkClient();
    const updatedUser = await client.users.updateUser(userId, {
      publicMetadata: {
        tier: newTier,
      },
    });
    
    // Also update in Supabase database
    try {
      const { error: supabaseError } = await supabase
        .from('users')
        .update({ 
          tier: newTier,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', userId);
      
      if (supabaseError) {
        console.warn('Failed to sync tier to Supabase:', supabaseError);
        // Don't fail the request, just log the warning
      } else {
        console.log('✅ Tier synced to Supabase successfully');
      }
    } catch (syncError) {
      console.warn('Supabase sync error (non-critical):', syncError);
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        tier: updatedUser.publicMetadata.tier
      }
    });
    
  } catch (error) {
    console.error('Error updating user tier:', error);
    return NextResponse.json({ 
      error: 'Failed to update tier' 
    }, { status: 500 });
  }
}
