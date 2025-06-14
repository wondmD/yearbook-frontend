"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, Plus } from "lucide-react"
import Image from "next/image"

interface MemoriesPageProps {
  onAddMemory: () => void
}

const jokes = [
  {
    id: 1,
    title: "The Semicolon Debate",
    content:
      "Why do JavaScript developers prefer dark mode? Because light attracts bugs! (And also because they've been staring at screens for 12 hours straight)",
    author: "Alex J.",
    category: "Programming",
  },
  {
    id: 2,
    title: "Coffee Chronicles",
    content:
      "Our class runs on coffee. We've calculated that we've consumed approximately 2,847 cups of coffee this semester. That's enough caffeine to power a small server farm!",
    author: "Sarah C.",
    category: "Daily Life",
  },
  {
    id: 3,
    title: "The Great Stack Overflow Incident",
    content:
      "Remember when Mike accidentally posted his homework question on Stack Overflow and got roasted by the entire community? He's now a legend there with -47 reputation points.",
    author: "Emily D.",
    category: "Programming",
  },
  {
    id: 4,
    title: "Debugging at 3 AM",
    content:
      "That moment when you realize you've been debugging for 4 hours only to find out you forgot a single closing bracket. We've all been there, and we'll all be there again.",
    author: "David K.",
    category: "Programming",
  },
]

const insideStories = [
  {
    id: 1,
    title: "The Great WiFi Hunt",
    story:
      "During our first week, half the class spent 3 hours trying to connect to the college WiFi. Turns out the password was literally 'password123'. We felt like elite hackers when we figured it out.",
    date: "Week 1",
    participants: ["Everyone", "IT Support (eventually)"],
  },
  {
    id: 2,
    title: "Pizza Friday Origins",
    story:
      "It all started when Jessica brought pizza to class one Friday. Now it's a sacred tradition - every Friday is Pizza Friday, and woe betide anyone who forgets their contribution to the pizza fund.",
    date: "Month 2",
    participants: ["Jessica W.", "The entire class", "Local pizza place owner (now rich)"],
  },
  {
    id: 3,
    title: "The Midnight Coding Session",
    story:
      "The night before our major project deadline, 15 of us camped out in the computer lab. We survived on energy drinks, determination, and Ryan's terrible jokes. Somehow, everyone submitted on time.",
    date: "Project Week",
    participants: ["The Brave 15", "Vending machine (emptied)", "Security guard (confused)"],
  },
  {
    id: 4,
    title: "Professor's Pet Peeve",
    story:
      "Our Data Structures professor has a legendary hatred for inefficient algorithms. The phrase 'That's O(n²), we can do better!' has become our unofficial class motto.",
    date: "Ongoing",
    participants: ["Prof. Algorithm", "Every student's nightmare", "Big O notation"],
  },
]

const quotes = [
  {
    quote: "Code is poetry written in a language only computers understand.",
    author: "Anonymous CSE Student",
    context: "Written on the whiteboard during a particularly philosophical debugging session",
  },
  {
    quote: "There are only 10 types of people in the world: those who understand binary and those who don't.",
    author: "Classic CS Joke",
    context: "Told approximately 847 times in our class",
  },
  {
    quote: "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 117 little bugs in the code.",
    author: "The Debugging Song",
    context: "Our unofficial anthem during project weeks",
  },
  {
    quote: "In CSE, we don't say 'I love you', we say 'Your code compiled successfully' and I think that's beautiful.",
    author: "Priya P.",
    context: "During a particularly romantic moment in the lab",
  },
]

const memories = [
  {
    id: 1,
    title: "First Day Chaos",
    description:
      "Remember our very first day? We were all lost, confused, and trying to find the CSE building. Half of us ended up in the wrong department, and the other half were still looking for parking. This photo captures the exact moment we realized we had no idea what we were doing, but we were doing it together! 😅",
    image: "/placeholder.svg?height=400&width=600",
    date: "September 15, 2021",
    location: "ASTU Campus",
    likes: 45,
    tags: ["FirstDay", "Memories", "Chaos"],
  },
  {
    id: 2,
    title: "The Great WiFi Hunt",
    description:
      "That legendary day when the entire batch spent 3 hours trying to connect to the college WiFi. We tried everything - restarting our laptops, standing in weird positions, even sacrificing a USB cable to the tech gods. Turns out the password was 'password123' all along. We felt like elite hackers when we finally figured it out! 🔍💻",
    image: "/placeholder.svg?height=400&width=600",
    date: "September 22, 2021",
    location: "Computer Lab",
    likes: 67,
    tags: ["WiFi", "TechStruggles", "Funny"],
  },
  {
    id: 3,
    title: "Pizza Friday Origins",
    description:
      "The birth of our sacred tradition! It all started when Jessica brought pizza to class one Friday. Now it's a holy ritual - every Friday is Pizza Friday, and woe betide anyone who forgets their contribution to the pizza fund. This photo shows the very first Pizza Friday that started it all. Look at those innocent faces, not knowing they were about to become pizza addicts! 🍕",
    image: "/placeholder.svg?height=400&width=600",
    date: "October 8, 2021",
    location: "Classroom 201",
    likes: 89,
    tags: ["PizzaFriday", "Tradition", "Food"],
  },
  {
    id: 4,
    title: "Midnight Coding Warriors",
    description:
      "The night before our major project deadline - 15 brave souls camped out in the computer lab. We survived on energy drinks, determination, and Ryan's terrible jokes. This photo was taken at 3 AM when we were all questioning our life choices but still coding like champions. Somehow, everyone submitted on time! 🌙💻",
    image: "/placeholder.svg?height=400&width=600",
    date: "December 14, 2022",
    location: "Computer Lab",
    likes: 78,
    tags: ["LateNight", "Projects", "Dedication"],
  },
  {
    id: 5,
    title: "Professor's Algorithm Rant",
    description:
      "The day our Data Structures professor went on a 45-minute rant about inefficient algorithms. 'That's O(n²), we can do better!' became our unofficial class motto. This photo captures the exact moment we all realized we were in for a wild ride. Half the class looks terrified, the other half looks confused, and Mike is somehow taking notes! 📚🤯",
    image: "/placeholder.svg?height=400&width=600",
    date: "February 10, 2023",
    location: "Lecture Hall",
    likes: 56,
    tags: ["Professor", "Algorithms", "ClassicMoments"],
  },
  {
    id: 6,
    title: "The Great Debugging Session",
    description:
      "When the entire class spent 2 hours debugging Sarah's code, only to discover she had a missing semicolon. The collective facepalm was so loud it could be heard from the next building. This photo shows the exact moment of realization - pure comedy gold! We still bring this up whenever someone has a 'complex' bug. 🐛😂",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 25, 2023",
    location: "Computer Lab",
    likes: 92,
    tags: ["Debugging", "Semicolon", "Epic"],
  },
]

export function MemoriesPage({ onAddMemory }: MemoriesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Precious Memories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every photo tells a story, every moment holds a memory. Here are the snapshots of our incredible journey
            together - the funny, the touching, and the absolutely unforgettable moments that made us who we are today.
          </p>
        </div>

        {/* Add Memory Button */}
        <div className="text-center mb-8">
          <Button
            onClick={onAddMemory}
            className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-semibold px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Share a Memory
          </Button>
        </div>

        {/* Memories Grid */}
        <div className="space-y-8">
          {memories.map((memory, index) => (
            <Card
              key={memory.id}
              className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } lg:flex`}
            >
              <div className="lg:w-1/2 relative h-64 lg:h-auto">
                <Image src={memory.image || "/placeholder.svg"} alt={memory.title} fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">{memory.likes}</span>
                </div>
              </div>

              <CardContent className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{memory.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {memory.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {memory.location}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-lg">{memory.description}</p>

                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Got a Memory to Share?</h3>
            <p className="text-gray-600 mb-6">
              Every moment matters! Share your favorite photos and the stories behind them. Let's build our collective
              memory bank together! 📸✨
            </p>
            <Button
              onClick={onAddMemory}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your Memory
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
