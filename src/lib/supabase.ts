import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-my-custom-header': 'tier-event-showcase',
    },
  },
  db: {
    schema: 'public',
  },
  // Add timeout and retry settings
  realtime: {
    timeout: 30000,
  }
})

export type Event = {
  id: string
  title: string
  description: string
  event_date: string
  image_url: string
  tier: 'free' | 'silver' | 'gold' | 'platinum'
  created_at: string
  updated_at: string
}
