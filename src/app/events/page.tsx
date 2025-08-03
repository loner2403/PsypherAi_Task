import EventsContent from '@/components/EventsContent'
import EventsPageSkeleton from '@/components/EventsPageSkeleton'
import { Suspense } from 'react'

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <EventsContent />
    </Suspense>
  )
}
