"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { useSession } from "next-auth/react"
import { useState } from "react"

const events = [
  {
    id: 1,
    title: "50 Day Celebration",
    date: "March 15, 2024",
    location: "Main Auditorium",
    description:
      "Our first major milestone celebration! We made it through the first 50 days of college with flying colors (and lots of coffee).",
    attendees: 58,
    photos: 45,
    highlights: ["Welcome speeches", "Ice breaker games", "Group photos", "Pizza party"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Milestone",
  },
  {
    id: 2,
    title: "100 Day Bash",
    date: "May 20, 2024",
    location: "College Grounds",
    description:
      "The legendary 100-day celebration! We survived our first semester and celebrated with style, music, and unforgettable memories.",
    attendees: 62,
    photos: 78,
    highlights: ["DJ Night", "Dance performances", "Food stalls", "Group activities"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Milestone",
  },
  {
    id: 3,
    title: "Jersey Day",
    date: "August 10, 2024",
    location: "Campus Wide",
    description:
      "Everyone showed up in their favorite team jerseys! From cricket to football, we represented our favorite teams with pride.",
    attendees: 55,
    photos: 32,
    highlights: ["Team spirit", "Jersey parade", "Sports trivia", "Team photos"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Theme Day",
  },
  {
    id: 4,
    title: "Tech Fest 2024",
    date: "September 5-7, 2024",
    location: "Tech Block",
    description:
      "Our department's annual tech fest featuring coding competitions, hackathons, and tech talks by industry experts.",
    attendees: 120,
    photos: 95,
    highlights: ["Hackathon", "Coding contest", "Tech talks", "Project showcase"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Academic",
  },
  {
    id: 5,
    title: "Freshers' Welcome",
    date: "July 1, 2024",
    location: "Main Hall",
    description:
      "Welcoming the new batch with open arms! A day filled with introductions, performances, and the beginning of new friendships.",
    attendees: 85,
    photos: 67,
    highlights: ["Welcome ceremony", "Cultural performances", "Talent show", "Networking"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Welcome",
  },
  {
    id: 6,
    title: "Halloween Costume Party",
    date: "October 31, 2024",
    location: "Student Lounge",
    description:
      "Spooky, scary, and absolutely hilarious! Our Halloween party brought out everyone's creative side with amazing costumes.",
    attendees: 48,
    photos: 89,
    highlights: ["Costume contest", "Spooky decorations", "Horror movie marathon", "Themed snacks"],
    image: "/placeholder.svg?height=400&width=600",
    category: "Theme Day",
  },
]

const categories = ["All", "Milestone", "Theme Day", "Academic", "Welcome"]

function EventsPage({ onAddEvent }: { onAddEvent: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Epic Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From milestone celebrations to themed parties, here are all the amazing events that brought us together and
            created memories that will last a lifetime.
          </p>
          <Button onClick={onAddEvent} className="mt-4">
            Add Event
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white">{event.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center text-blue-600">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees} attendees
                  </div>
                  <div className="flex items-center text-purple-600">
                    <Camera className="h-4 w-4 mr-1" />
                    {event.photos} photos
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Event Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {event.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/gallery?event=${event.id}`}>View Event Photos</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Timeline */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Event Timeline</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
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
                    {event.date} • {event.location}
                  </p>
                </div>
                <Badge variant="secondary">{event.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()

  const handleAddEvent = () => {
    if (!session) {
      setShowAuthModal(true)
    } else {
      console.log("Adding event for user:", session.user?.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CodeDecorations />
      <FloatingCode />
      <Navigation />
      <div className="relative z-10">
        <EventsPage onAddEvent={handleAddEvent} />
      </div>
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action="add a new event" />}
    </div>
  )
}
