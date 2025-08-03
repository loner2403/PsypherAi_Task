import { auth, currentUser } from '@clerk/nextjs/server'
import { fetchEventsWithRetry } from '@/lib/database'
import { redirect } from 'next/navigation'
import EventCard from '@/components/EventCard'
import TierUpgrade from '@/components/TierUpgrade'
import UserSync from '@/components/UserSync'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const tierHierarchy = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3
}

export default async function EventsContent() {
  try {

    
    // Check authentication
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {

      redirect('/sign-in')
    }



    // Get user tier from Clerk metadata
    const userTier = (user.publicMetadata?.tier as string) || 'free'
    const userTierLevel = tierHierarchy[userTier as keyof typeof tierHierarchy]
    


    // Use the resilient database helper
    const { data: events, error } = await fetchEventsWithRetry(3)

    if (error || !events) {
      console.error('❌ Database connection failed after all retries:', error)
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-white/20">
              <div className="text-6xl mb-4">🔌</div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Connection Issue
              </h1>
              <p className="text-gray-600 mb-6">
                We&apos;re having trouble connecting to our database. This might be a temporary network issue.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/events"
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Again
                </Link>
                <Link 
                  href="/"
                  className="block w-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-800 py-3 px-4 rounded-xl transition-all duration-300 font-medium"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    console.log('✅ Events loaded successfully:', events.length)

    // Filter events based on user tier
    const accessibleEvents = events.filter(event => 
      tierHierarchy[event.tier as keyof typeof tierHierarchy] <= userTierLevel
    )

    const nonAccessibleEvents = events.filter(event => 
      tierHierarchy[event.tier as keyof typeof tierHierarchy] > userTierLevel
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Client-side user sync component */}
        <UserSync />
        
        {/* Navigation */}
        <nav className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo - Always visible */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hidden xs:block">
                    Event Showcase
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent block xs:hidden">
                    Events
                  </span>
                </Link>
              </div>
              
              {/* Right side - Responsive layout */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Welcome message - Hidden on mobile */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      Welcome, {user.firstName || user.emailAddresses[0].emailAddress?.split('@')[0]}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                </div>
                
                {/* Tier badge - Responsive sizing */}
                <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  userTier === 'free' ? 'bg-gray-100 text-gray-700' :
                  userTier === 'silver' ? 'bg-blue-100 text-blue-700' :
                  userTier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  <span className="hidden sm:inline">{userTier} Member</span>
                  <span className="sm:hidden">{userTier}</span>
                </span>
                
                {/* User button */}
                <UserButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200/50 mb-6">
              <span className="text-sm font-medium text-indigo-700">🎯 Personalized for {userTier} tier</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Your Exclusive</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Event Collection
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover premium events and workshops curated for your membership level.
              <span className="block mt-2 text-lg text-gray-500">
                Unlock new opportunities and connect with like-minded professionals.
              </span>
            </p>
          </div>

          {/* Tier Upgrade Component */}
          <div className="mb-16">
            <TierUpgrade />
          </div>

          {/* Accessible Events */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ✨ Available Events
                </h2>
                <p className="text-gray-600">
                  {accessibleEvents.length} events you can access with your {userTier} membership
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {accessibleEvents.length} Available
                </span>
              </div>
            </div>
            
            {accessibleEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accessibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    userTier={userTier}
                    isAccessible={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
                <p className="text-gray-500 mb-6">No events are currently available for your tier level.</p>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                  💡 Try upgrading your tier to access more events
                </div>
              </div>
            )}
          </div>

          {/* Non-accessible Events */}
          {nonAccessibleEvents.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🔒 Premium Events
                  </h2>
                  <p className="text-gray-600">
                    {nonAccessibleEvents.length} exclusive events for higher tier members
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    Upgrade Required
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nonAccessibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    userTier={userTier}
                    isAccessible={false}
                  />
                ))}
              </div>
              
               {/* Upgrade CTA  */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  🚀 Upgrade Your Membership to Access All Events
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('💥 Unexpected error in EventsPage:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">An unexpected error occurred while loading your events.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Return Home
          </Link>
        </div>
      </div>
    )
  }
}
