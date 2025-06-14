"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Linkedin, Github, Plus, Laugh, Heart, Coffee } from "lucide-react"
import Image from "next/image"

interface ClassmatesPageProps {
  onAddProfile: () => void
}

const classmates = [
  {
    id: 1,
    name: "Alex Johnson",
    bio: "The debugging wizard who can find bugs faster than they can hide. Known for surviving on coffee and Stack Overflow.",
    location: "Addis Ababa, Ethiopia",
    interests: ["Full Stack", "AI/ML", "Coffee"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Once debugged code in their sleep",
    nickname: "Bug Hunter Supreme",
  },
  {
    id: 2,
    name: "Sarah Chen",
    bio: "Frontend magician who makes pixels dance. Can center a div blindfolded and has strong opinions about semicolons.",
    location: "Adama, Ethiopia",
    interests: ["React", "UI/UX", "Design"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Has 47 different shades of blue in her color palette",
    nickname: "Pixel Perfectionist",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    bio: "Backend ninja who speaks fluent database. Rumored to dream in SQL queries and wake up optimizing algorithms.",
    location: "Hawassa, Ethiopia",
    interests: ["Node.js", "Databases", "DevOps"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Can write a REST API faster than ordering pizza",
    nickname: "Database Whisperer",
  },
  // Add more classmates...
]

export function ClassmatesPage({ onAddProfile }: ClassmatesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fun Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Laugh className="h-12 w-12 text-yellow-500 animate-bounce" />
            <h1 className="text-5xl font-bold text-gray-900">Meet The Legends!</h1>
            <Coffee className="h-12 w-12 text-brown-500 animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-300">
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              🎉 <strong>Welcome to the Hall of Fame!</strong> 🎉
              <br />
              Here are the incredible humans who survived 4 years of coding, debugging, and pretending to understand
              algorithms! Each one is a certified legend with their own superpower (and caffeine addiction). From the
              quiet ninjas to the loud and proud, from the gym heroes to the pizza enthusiasts - this is our amazing CSE
              2025 squad! 🚀
            </p>
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-lg font-semibold text-gray-800">60+ Amazing Souls & Counting!</span>
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Add Profile Button */}
        <div className="text-center mb-8">
          <Button
            onClick={onAddProfile}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your Profile to the Squad!
          </Button>
        </div>

        {/* Classmates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classmates.map((classmate) => (
            <Card
              key={classmate.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-2 hover:border-blue-200"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                    <Image
                      src={classmate.image || "/placeholder.svg"}
                      alt={classmate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{classmate.name}</h3>
                  <div className="text-sm font-medium text-purple-600 mb-2">"{classmate.nickname}"</div>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {classmate.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{classmate.bio}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {classmate.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-4 border border-yellow-200">
                  <p className="text-xs text-gray-600 font-medium flex items-center">
                    <Laugh className="h-3 w-3 mr-1" />
                    Fun Fact:
                  </p>
                  <p className="text-sm text-gray-700 italic">{classmate.funFact}</p>
                </div>

                <div className="flex justify-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Github className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Missing Someone Awesome?</h3>
            <p className="text-gray-600 mb-6">
              Don't see yourself or a friend here? Join the squad and add your profile to our legendary collection!
              Every CSE 2025 student deserves a spot in our digital hall of fame! 🌟
            </p>
            <Button
              onClick={onAddProfile}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Join the Legend Squad!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
