'use client'

import { Event } from '@/lib/supabase'
import Image from 'next/image'

interface EventCardProps {
  event: Event
  userTier: string
  isAccessible: boolean
}

const tierColors = {
  free: 'bg-gray-100 text-gray-800',
  silver: 'bg-blue-100 text-blue-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800'
}

const tierHierarchy = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3
}

import { useState } from 'react'

export default function EventCard({ event, userTier, isAccessible }: EventCardProps) {
  const [imgSrc, setImgSrc] = useState(event.image_url);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUpgradeMessage = () => {
    const currentTierLevel = tierHierarchy[userTier as keyof typeof tierHierarchy]
    const eventTierLevel = tierHierarchy[event.tier as keyof typeof tierHierarchy]
    
    if (eventTierLevel > currentTierLevel) {
      return `Upgrade to ${event.tier.charAt(0).toUpperCase() + event.tier.slice(1)} to access this event`
    }
    return null
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${!isAccessible ? 'opacity-60' : ''}`}>
      <div className="relative h-48">
        <Image
          src={imgSrc}
          alt={event.title}
          fill
          className="object-cover"
          onError={() => setImgSrc('/fallback-event.png')}
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${tierColors[event.tier]}`}>
          {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
        </div>
        {!isAccessible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {formatDate(event.event_date)}
        </div>

        {!isAccessible && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800 font-medium">
              🔒 {getUpgradeMessage()}
            </p>
          </div>
        )}

        {isAccessible && (
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
            Register Now
          </button>
        )}
      </div>
    </div>
  )
}
