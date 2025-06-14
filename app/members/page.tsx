import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Linkedin, Github } from "lucide-react"
import Image from "next/image"

const members = [
  {
    id: 1,
    name: "Alex Johnson",
    bio: "The debugging wizard who can find bugs faster than they can hide. Known for surviving on coffee and Stack Overflow.",
    location: "San Francisco, CA",
    interests: ["Full Stack", "AI/ML", "Coffee"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Once debugged code in their sleep",
  },
  {
    id: 2,
    name: "Sarah Chen",
    bio: "Frontend magician who makes pixels dance. Can center a div blindfolded and has strong opinions about semicolons.",
    location: "Seattle, WA",
    interests: ["React", "UI/UX", "Design"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Has 47 different shades of blue in her color palette",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    bio: "Backend ninja who speaks fluent database. Rumored to dream in SQL queries and wake up optimizing algorithms.",
    location: "Austin, TX",
    interests: ["Node.js", "Databases", "DevOps"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Can write a REST API faster than ordering pizza",
  },
  {
    id: 4,
    name: "Emily Davis",
    bio: "Data science enthusiast who finds patterns in everything, including her morning coffee consumption vs productivity.",
    location: "Boston, MA",
    interests: ["Python", "Machine Learning", "Statistics"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Predicted the weather using her mood data",
  },
  {
    id: 5,
    name: "David Kim",
    bio: "Mobile app developer who thinks in Swift and dreams in Kotlin. Has more apps than friends (but we love him anyway).",
    location: "Los Angeles, CA",
    interests: ["iOS", "Android", "Flutter"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Built an app to remind him to build apps",
  },
  {
    id: 6,
    name: "Jessica Wang",
    bio: "Cybersecurity expert who locks down systems tighter than her study notes. Ethical hacker by day, Netflix binger by night.",
    location: "New York, NY",
    interests: ["Security", "Penetration Testing", "Cryptography"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Once hacked into her own account to test security",
  },
  {
    id: 7,
    name: "Ryan Thompson",
    bio: "Game developer who turns caffeine into code and code into adventures. Currently working on a game about debugging.",
    location: "Portland, OR",
    interests: ["Game Dev", "Unity", "C#"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Has a high score in every game he's ever played",
  },
  {
    id: 8,
    name: "Priya Patel",
    bio: "Cloud architect who builds castles in the cloud. Can deploy to production faster than you can say 'serverless'.",
    location: "Denver, CO",
    interests: ["AWS", "Cloud Computing", "Microservices"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Her code runs in 7 different time zones simultaneously",
  },
]

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Amazing Batch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The brilliant minds, future innovators, and lifelong friends who made this journey unforgettable. Each one
            unique, all of them awesome!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-2 hover:border-blue-200"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {member.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.interests.map((interest, index) => (
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

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 font-medium">Fun Fact:</p>
                  <p className="text-sm text-gray-700 italic">{member.funFact}</p>
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

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Missing Someone?</h3>
            <p className="text-gray-600 mb-4">
              If you don't see yourself here or notice someone missing, let us know! We want to make sure everyone is
              part of our digital yearbook.
            </p>
            <div className="text-sm text-gray-500">Contact the yearbook committee to add or update profiles</div>
          </div>
        </div>
      </div>
    </div>
  )
}
