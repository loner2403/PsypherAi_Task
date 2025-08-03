import Link from 'next/link'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Suspense } from 'react'

// Loading skeleton component
function NavSkeleton() {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Navigation */}
      <Suspense fallback={<NavSkeleton />}>
        <nav className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Event Showcase
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100/50">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/events" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100/50">
                    Events
                  </Link>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </nav>
      </Suspense>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200/50 mb-8">
            <span className="text-sm font-medium text-indigo-700">🎉 Tier-based exclusive access</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Exclusive Events</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
              Tailored to You
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Access premium events and workshops based on your membership tier.
            <span className="block mt-2 text-lg text-gray-500">
              From free community meetups to exclusive CEO roundtables.
            </span>
          </p>
          
          {/* CTA Buttons */}
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <SignUpButton mode="modal">
                <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1 hover:scale-105">
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="group relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white hover:shadow-lg transform hover:-translate-y-1">
                  Sign In
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          
          <SignedIn>
            <div className="mb-12">
              <Link href="/events">
                <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1 hover:scale-105">
                  <span className="relative z-10 flex items-center">
                    View My Events
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>
          </SignedIn>
          
          {/* Stats or Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-16">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              1000+ Active Members
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              50+ Events Monthly
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              4 Membership Tiers
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'Free', 
              gradient: 'from-gray-400 to-gray-600',
              bgGradient: 'from-gray-50 to-gray-100',
              features: ['Community Meetups', 'Basic Workshops'],
              icon: '🆓',
              popular: false
            },
            { 
              name: 'Silver', 
              gradient: 'from-blue-400 to-blue-600',
              bgGradient: 'from-blue-50 to-blue-100',
              features: ['Advanced Workshops', 'Cloud Training'],
              icon: '🥈',
              popular: false
            },
            { 
              name: 'Gold', 
              gradient: 'from-yellow-400 to-yellow-600',
              bgGradient: 'from-yellow-50 to-yellow-100',
              features: ['Masterclasses', 'Pitch Competitions'],
              icon: '🥇',
              popular: true
            },
            { 
              name: 'Platinum', 
              gradient: 'from-purple-400 to-purple-600',
              bgGradient: 'from-purple-50 to-purple-100',
              features: ['CEO Roundtables', 'VIP Conferences'],
              icon: '💎',
              popular: false
            }
          ].map((tier, index) => (
            <div key={tier.name} className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${tier.popular ? 'ring-2 ring-yellow-400/50' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.bgGradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {tier.icon}
                </div>
              </div>
              
              {/* Title */}
              <h3 className={`text-2xl font-bold text-center mb-6 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                {tier.name}
              </h3>
              
              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tier.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Bottom Decoration */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.gradient} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
