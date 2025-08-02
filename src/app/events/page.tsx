import { auth, currentUser } from '@clerk/nextjs/server'
import { fetchEventsWithRetry } from '@/lib/database'
import { redirect } from 'next/navigation'
import EventCard from '@/components/EventCard'
import TierUpgrade from '@/components/TierUpgrade'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const tierHierarchy = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3
}

export default async function EventsPage() {
  try {
    console.log('🚀 Events Page: Starting...')
    
    // Check authentication
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      console.log('❌ No authentication, redirecting...')
      redirect('/sign-in')
    }

    console.log('👤 User authenticated:', user.emailAddresses[0]?.emailAddress)

    // Get user tier from Clerk metadata
    const userTier = (user.publicMetadata?.tier as string) || 'free'
    const userTierLevel = tierHierarchy[userTier as keyof typeof tierHierarchy]
    
    console.log('🏆 User tier:', userTier, 'Level:', userTierLevel)

    // Use the resilient database helper
    const { data: events, error } = await fetchEventsWithRetry(3)

    if (error || !events) {
      console.error('❌ Database connection failed after all retries:', error)
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔌</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Connection Issue
            </h1>
            <p className="text-gray-600 mb-6">
              We're having trouble connecting to our database. This might be a temporary network issue.
            </p>
            <div className="space-y-3">
              <Link 
                href="/events"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Try Again
              </Link>
              <Link 
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Go Home
              </Link>
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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Event Showcase
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover events tailored to your membership tier and unlock new opportunities
            </p>
          </div>

          {/* Tier Upgrade Component */}
          <TierUpgrade />

          {/* Accessible Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Available Events ({accessibleEvents.length})
            </h2>
            {accessibleEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No events available for your current tier.</p>
              </div>
            )}
          </div>

          {/* Non-accessible Events */}
          {nonAccessibleEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Premium Events ({nonAccessibleEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nonAccessibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    userTier={userTier}
                    isAccessible={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('💥 Unexpected error in EventsPage:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Return Home
          </Link>
        </div>
      </div>
    )
  }
}
