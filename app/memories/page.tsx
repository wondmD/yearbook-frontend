"use client"

import { Navigation } from "@/components/navigation"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Laugh, Heart, Coffee, Code, Lightbulb, Star } from "lucide-react"

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

const memories = [
  {
    id: 1,
    title: "First Day Jitters",
    content:
      "Walking into our first CSE class, we were all nervous strangers. Now look at us - we're nervous friends who debug each other's code and share memes at 2 AM.",
    emotion: "Nostalgic",
    icon: Heart,
  },
  {
    id: 2,
    title: "The Eureka Moments",
    content:
      "Those magical moments when a complex algorithm finally clicks, or when your code runs without errors on the first try. Rare, but absolutely euphoric when they happen.",
    emotion: "Triumphant",
    icon: Lightbulb,
  },
  {
    id: 3,
    title: "Group Project Chaos",
    content:
      "Git merge conflicts, last-minute changes, and the classic 'it works on my machine' syndrome. Somehow, we always pulled through and learned the true meaning of teamwork.",
    emotion: "Chaotic Good",
    icon: Code,
  },
  {
    id: 4,
    title: "Late Night Lab Sessions",
    content:
      "The computer lab at midnight, empty pizza boxes, and the gentle hum of servers. These quiet moments of focused coding created some of our strongest bonds.",
    emotion: "Peaceful",
    icon: Coffee,
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

function MemoriesPage({ onAddMemory }: { onAddMemory: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fun & Memories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The inside jokes, funny stories, and cherished memories that made our CSE journey absolutely unforgettable.
            These are the moments that will make us smile years from now!
          </p>
        </div>

        <Tabs defaultValue="jokes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="jokes" className="flex items-center space-x-2">
              <Laugh className="h-4 w-4" />
              <span>Jokes & Memes</span>
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Inside Stories</span>
            </TabsTrigger>
            <TabsTrigger value="memories" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Sweet Memories</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center space-x-2">
              <Coffee className="h-4 w-4" />
              <span>Famous Quotes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jokes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jokes.map((joke) => (
                <Card key={joke.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-gray-900">{joke.title}</CardTitle>
                      <Badge variant="secondary">{joke.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">{joke.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">- {joke.author}</span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Laugh className="h-4 w-4" />
                        <span className="text-sm">LOL</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {insideStories.map((story) => (
                <AccordionItem key={story.id} value={`story-${story.id}`}>
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-semibold">{story.title}</span>
                      <Badge variant="outline">{story.date}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 pl-8">
                      <p className="text-gray-600 mb-4 leading-relaxed">{story.story}</p>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Key Players:</h4>
                        <div className="flex flex-wrap gap-2">
                          {story.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="memories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memories.map((memory) => {
                const IconComponent = memory.icon
                return (
                  <Card
                    key={memory.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{memory.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {memory.emotion}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{memory.content}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="space-y-6">
              {quotes.map((quote, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-50 to-blue-50"
                >
                  <CardContent className="p-8">
                    <blockquote className="text-xl text-gray-800 font-medium mb-4 italic">"{quote.quote}"</blockquote>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-600 font-semibold">- {quote.author}</p>
                        <p className="text-sm text-gray-500 mt-1">{quote.context}</p>
                      </div>
                      <Coffee className="h-6 w-6 text-brown-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Memory Wall */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Memory Wall</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <Laugh className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Countless Laughs</h3>
              <p className="text-gray-600">From debugging disasters to inside jokes that only we understand</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Lifelong Bonds</h3>
              <p className="text-gray-600">Friendships forged in the fires of group projects and late-night coding</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
              <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Golden Moments</h3>
              <p className="text-gray-600">Those perfect moments that made all the hard work worth it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MemoriesPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()

  const handleAddMemory = () => {
    if (!session) {
      setShowAuthModal(true)
    } else {
      console.log("Adding memory for user:", session.user?.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CodeDecorations />
      <FloatingCode />
      <Navigation />
      <div className="relative z-10">
        <MemoriesPage onAddMemory={handleAddMemory} />
      </div>
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action="share a memory" />}
    </div>
  )
}
