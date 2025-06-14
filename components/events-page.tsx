"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Camera, ArrowLeft, Plus } from "lucide-react"
import Image from "next/image"

interface EventsPageProps {
  onAddEvent: () => void
}

const events = [
  {
    id: 1,
    title: "50 Day Celebration",
    date: "March 15, 2024",
    location: "Main Auditorium",
    description:
      "Our first major milestone celebration! We made it through the first 50 days of college with flying colors (and lots of coffee).",
    fullDescription:
      "What an incredible day! Our 50-day celebration marked the first major milestone of our CSE journey. The auditorium was packed with excited students, proud faculty, and enough pizza to feed a small army. We had ice-breaker games that actually broke the ice (and some friendships 😄), group photos where everyone tried to look serious but failed miserably, and speeches that ranged from inspiring to hilariously awkward. The highlight was definitely when Professor Ahmed tried to explain recursion using pizza slices - we're still confused but we got free pizza! This day officially marked us as 'real' CSE students, whatever that means.",
    attendees: 58,
    photos: 45,
    highlights: ["Welcome speeches", "Ice breaker games", "Group photos", "Pizza party"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 2,
    title: "100 Day Bash",
    date: "May 20, 2024",
    location: "College Grounds",
    description:
      "The legendary 100-day celebration! We survived our first semester and celebrated with style, music, and unforgettable memories.",
    fullDescription:
      "If the 50-day celebration was good, the 100-day bash was LEGENDARY! 🎉 We had survived our first semester (barely), and it was time to party like the coding warriors we had become. The college grounds were transformed into a festival zone with DJ music that could be heard from space, dance performances that made TikTok jealous, food stalls that emptied our wallets but filled our hearts, and group activities that tested both our teamwork and our sanity. The night ended with everyone singing along to 'We Are The Champions' while holding their laptops like trophies. Epic doesn't even begin to describe it!",
    attendees: 62,
    photos: 78,
    highlights: ["DJ Night", "Dance performances", "Food stalls", "Group activities"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  // Add more events...
]

const categories = ["All", "Milestone", "Theme Day", "Academic", "Welcome"]

export function EventsPage({ onAddEvent }: EventsPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  if (selectedEvent !== null) {
    const event = events.find((e) => e.id === selectedEvent)
    if (!event) return null

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={() => setSelectedEvent(null)} variant="outline" className="mb-6 hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 md:h-96">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{event.attendees}</div>
                  <div className="text-gray-600">Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{event.photos}</div>
                  <div className="text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{event.highlights.length}</div>
                  <div className="text-gray-600">Highlights</div>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Story</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{event.fullDescription}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {event.highlights.map((highlight, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {event.gallery.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`${event.title} photo ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
        </div>

        {/* Add Event Button */}
        <div className="text-center mb-8">
          <Button
            onClick={onAddEvent}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Event
          </Button>
        </div>

        {/* Category Filter */}
        {/* <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div> */}

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden cursor-pointer"
              onClick={() => setSelectedEvent(event.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
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

                <Button className="w-full">View Event Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Timeline */}
        {/* <div className="bg-white rounded-lg p-8 shadow-lg">
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
        </div> */}
      </div>
    </div>
  )
}
