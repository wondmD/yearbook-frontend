"use client"

import { Navigation } from "@/components/navigation"
import { AuthRequiredModal } from "@/components/auth-required-modal"
// Removed unused Card imports
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Camera, Loader2, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Event, fetchEvents } from "@/lib/api/events"
import { EventForm } from "@/components/event-form"

const categories = ["All", "MILESTONE", "THEME_DAY", "ACADEMIC", "WELCOME"]
const categoryLabels = {
  MILESTONE: "Milestone",
  THEME_DAY: "Theme Day",
  ACADEMIC: "Academic",
  WELCOME: "Welcome"
}

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  // Check if user is approved to create events
  const canCreateEvents = session?.user?.isApproved || false;
  
  const handleAddEventClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      // This will trigger the AuthRequiredModal
      return;
    }
    
    if (!canCreateEvents) {
      e.preventDefault();
      setShowApprovalDialog(true);
    }
  };

  const loadEvents = useCallback(async () => {
    try {
      // First, fetch all events without category filter
      const response = await fetchEvents();
      console.log('API Response:', response);
      
      // Handle the case where the response is not an array
      const eventsData = Array.isArray(response) ? response : [];
      console.log('Processed events data:', eventsData);
      
      // Filter events based on category, approval status and user permissions
      const visibleEvents = eventsData.filter(event => {
        console.log('Checking event:', event);
        // Filter by selected category
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        if (!matchesCategory) return false;
        
        // Show all approved events to everyone
        if (event.is_approved) return true;
        
        // For unapproved events, only show to the creator or admin
        const userId = session?.user?.id;
        if (!userId) return false; // Not logged in users can't see unapproved events
        
        // Handle both object and direct ID cases for created_by
        let creatorId: string | number | undefined;
        
        if (event.created_by && typeof event.created_by === 'object' && 'id' in event.created_by) {
          creatorId = event.created_by.id;
        } else if (event.created_by) {
          creatorId = event.created_by as string | number;
        }
        
        // Convert both IDs to strings for safe comparison
        const creatorIdStr = creatorId?.toString();
        const currentUserIdStr = userId?.toString();
        
        const isCreator = !!creatorIdStr && creatorIdStr === currentUserIdStr;
        const isAdmin = session?.user?.role === 'ADMIN';
        
        return isCreator || isAdmin;
      });
      
      console.log('Visible events after filtering:', visibleEvents);
      setEvents(visibleEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, session]);

  useEffect(() => {
    setLoading(true);
    loadEvents();
  }, [loadEvents]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleEventCreated = () => {
    setRefreshing(true);
    loadEvents();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Epic Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From milestone celebrations to themed parties, here are all the amazing events that brought us together and
            created memories that will last a lifetime.
          </p>
          {session ? (
            canCreateEvents ? (
              <EventForm onSuccess={() => window.location.reload()}>
                <Button className="mt-4">
                  Add Event
                </Button>
              </EventForm>
            ) : (
              <Button 
                className="mt-4"
                onClick={handleAddEventClick}
              >
                Add Event
              </Button>
            )
          ) : (
            <Button 
              className="mt-4"
              onClick={handleAddEventClick}
            >
              Add Event
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'All' ? 'All' : categoryLabels[category as keyof typeof categoryLabels]}
              </Badge>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-auto"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {events.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No events found{selectedCategory !== 'All' ? ` in ${categoryLabels[selectedCategory as keyof typeof categoryLabels] || selectedCategory}` : ''}. Check back later!</p>
            </div>
          ) : (
            events.map((event: Event) => (
              <div key={event.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.cover_image_url ? (
                    <Image
                      src={event.cover_image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 transition-colors">
                      {categoryLabels[event.category as keyof typeof categoryLabels] || event.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                      {!event.is_approved && (
                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                          Pending Approval
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-white/90 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <MapPin className="h-4 w-4 ml-3 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <p className="text-gray-600 line-clamp-3 mb-4 min-h-[60px]">
                    {event.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees_count || 0} attending
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center group-hover:underline"
                    >
                      Read More
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <Button asChild className="w-full rounded-t-none">
                  <Link href={`/gallery?event=${event.id}`} className="w-full">
                    View Event Photos
                  </Link>
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Event Timeline */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Event Timeline</h2>
          {events.length === 0 ? (
            <p className="text-center text-gray-500">No events to display in the timeline.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event: Event, index: number) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(event.date)} • {event.location}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {categoryLabels[event.category as keyof typeof categoryLabels] || event.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approval Required Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approval Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Your account needs to be approved by an administrator before you can create events.
              Please contact the school administration for approval.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowApprovalDialog(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowApprovalDialog(false);
                  // You can add a contact link here if needed
                }}
              >
                Contact Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EventsPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session } = useSession();

  const handleOpenChange = (open: boolean) => {
    setShowAuthModal(open);
  };

  // Show auth modal if not logged in
  useEffect(() => {
    if (!session) {
      setShowAuthModal(true);
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <Navigation />
      <CodeDecorations />
      <FloatingCode />
      <EventsPage />
      {!session && showAuthModal && (
        <AuthRequiredModal 
          onClose={() => setShowAuthModal(false)}
          action="view events" 
        />
      )}
    </div>
  );
}
