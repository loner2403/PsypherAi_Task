'use client'


import { Event } from '@/lib/supabase'
import Image from 'next/image'
import { useState } from 'react'

interface EventCardProps {
  event: Event
  userTier: string
  isAccessible: boolean
}

const tierColors = {
  free: {
    bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
    text: 'text-gray-800',
    border: 'border-gray-300',
    glow: 'shadow-gray-200/50'
  },
  silver: {
    bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
    text: 'text-blue-800',
    border: 'border-blue-300',
    glow: 'shadow-blue-200/50'
  },
  gold: {
    bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    glow: 'shadow-yellow-200/50'
  },
  platinum: {
    bg: 'bg-gradient-to-r from-purple-100 to-purple-200',
    text: 'text-purple-800',
    border: 'border-purple-300',
    glow: 'shadow-purple-200/50'
  }
}

const tierHierarchy = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3
}

export default function EventCard({ event, userTier, isAccessible }: EventCardProps) {
  const [imageError, setImageError] = useState(false)
  
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

  // Create a simple colored placeholder based on tier
  const getTierColor = () => {
    const colors = {
      free: '#6b7280',
      silver: '#3b82f6', 
      gold: '#f59e0b',
      platinum: '#a855f7'
    }
    return colors[event.tier] || '#6b7280'
  }

  const tierStyle = tierColors[event.tier as keyof typeof tierColors]

  return (
    <div className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 ${!isAccessible ? 'opacity-70' : ''}`}>
      {/* Tier indicator line at top */}
      <div className={`h-1 ${tierStyle.bg}`}></div>
      
      <div className="relative h-56 overflow-hidden">
        {!imageError ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback gradient div when image fails to load
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br"
            style={{ 
              background: `linear-gradient(135deg, ${getTierColor()}, ${getTierColor()}dd)` 
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {event.tier === 'free' ? '🆓' : 
                 event.tier === 'silver' ? '🥈' : 
                 event.tier === 'gold' ? '🥇' : '💎'}
              </div>
              <div className="text-sm font-medium opacity-90">{event.title}</div>
            </div>
          </div>
        )}
        
        {/* Tier badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border} ${tierStyle.glow} shadow-lg`}>
          {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
        </div>
        
        {/* Lock overlay for inaccessible events */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium">Upgrade Required</p>
            </div>
          </div>
        )}
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <div className="p-8">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
        
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">{formatDate(event.event_date)}</span>
        </div>

        {/* Upgrade message for inaccessible events */}
        {!isAccessible && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Membership Upgrade Required
                </p>
                <p className="text-xs text-amber-700">
                  {getUpgradeMessage()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        {isAccessible ? (
          <button className="group/btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <span className="flex items-center justify-center">
              Register Now
              <svg className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        ) : (
          <button className="w-full bg-gray-100 text-gray-400 py-3 px-6 rounded-xl font-semibold cursor-not-allowed">
            <span className="flex items-center justify-center">
              <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Locked
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
