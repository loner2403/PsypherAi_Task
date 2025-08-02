'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

const tiers = ['free', 'silver', 'gold', 'platinum']

export default function TierUpgrade() {
  const { user } = useUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<string | null>(null)
  const currentTier = user?.publicMetadata?.tier as string || 'free'

  const updateTier = async (newTier: string) => {
    if (!user) return
    
    setIsUpdating(true)
    setUpdateStatus(null)
    
    try {
      const response = await fetch('/api/update-tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTier }),
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateStatus('✅ Tier updated successfully!')
        // Refresh the page to reflect changes
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setUpdateStatus(`❌ ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to update tier:', error)
      setUpdateStatus('❌ Failed to update tier')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Membership</h2>
      <p className="text-gray-600 mb-6">
        Current Tier: <span className="font-semibold capitalize text-indigo-600">{currentTier}</span>
      </p>
      
      {updateStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          updateStatus.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {updateStatus}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => updateTier(tier)}
            disabled={isUpdating || currentTier === tier}
            className={`p-3 rounded-lg border transition-colors ${
              currentTier === tier
                ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-medium capitalize">
              {isUpdating ? '⏳' : tier}
            </div>
            {currentTier === tier && (
              <div className="text-xs text-indigo-600 mt-1">Current</div>
            )}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        💡 This is a demo feature. In a real app, tier upgrades would involve payment processing.
      </p>
    </div>
  )
}
