'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function UserSync() {
  const { user, isLoaded } = useUser()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncStatus !== 'idle') return

      setSyncStatus('syncing')
      
      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          setSyncStatus('success')
          console.log('✅ User synced to Supabase successfully')
        } else {
          setSyncStatus('error')
          console.error('❌ Failed to sync user to Supabase')
        }
      } catch (error) {
        setSyncStatus('error')
        console.error('❌ Error syncing user:', error)
      }
    }

    syncUser()
  }, [user, isLoaded, syncStatus])

  // This component doesn't render anything visible
  return null
}
