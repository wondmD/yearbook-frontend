import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Crown, Star, Laugh, Heart } from "lucide-react"
import Image from "next/image"

const nominations = [
  {
    id: 1,
    title: "The Shy Squad 🙈",
    winners: ["Pawa", "Jerry"],
    description: "Masters of the 'Oops, did someone say my name?' vibe!",
    funnyDescription:
      "If hiding was an Olympic sport, these two would take gold, silver, and somehow bronze too! They've perfected the art of becoming invisible the moment a professor asks a question.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "The Famous Faces 😎",
    winners: ["Nati", "Betty"],
    description: "Always in the spotlight, flashing those shades like pros!",
    funnyDescription:
      "These two don't just enter a room - they make an ENTRANCE! Always camera-ready, always fabulous, always making the rest of us look like we just rolled out of bed.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Silent Ninjas 🔕",
    winners: ["Abdulfeta", "Kidst"],
    description: "So quiet, you'd think they're ninjas on a stealth mission.",
    funnyDescription:
      "These two are so quiet that when they finally speak, everyone stops and listens like it's a rare Pokemon sighting! They've mastered the art of communication through meaningful glances.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Brainiacs Unite! 🧠",
    winners: ["Nahom", "Hermona"],
    description: "Calculators fear these two—smartness overload!",
    funnyDescription:
      "These two don't just solve problems - they solve problems that don't even exist yet! They're the reason our class average is respectable.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "The Ghost Team 🚫",
    winners: ["Bura", "Tsnat"],
    description: "Experts in the ancient art of 'now you see me, now you don't.'",
    funnyDescription:
      "These legends have mastered the art of selective attendance! They show up just enough to pass but mysteriously vanish during the boring parts.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    title: "Handsome Heartthrob 🧍‍♂️",
    winners: ["Fitse"],
    description: "The charm is real, and the mirror agrees!",
    funnyDescription:
      "This guy doesn't just walk - he glides! Even his code looks handsome. Rumor has it that bugs fix themselves just to impress him.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 7,
    title: "The Cute Charm 🧍‍♀️",
    winners: ["Feven"],
    description: "Warning: Cuteness levels may cause instant smiles!",
    funnyDescription:
      "So cute that even error messages apologize before appearing! Has the magical ability to make everyone's day better just by existing.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 8,
    title: "Most Active Sprinters 🏃‍♂️",
    winners: ["Hayle", "Melu"],
    description: "If attendance was a race, these two would win gold every time!",
    funnyDescription:
      "These two are so punctual that they probably arrive before the professor even thinks about the class! They've never met a deadline they couldn't beat.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 9,
    title: "Voice of the Department 📣",
    winners: ["Sitotaw"],
    description: "The one who speaks up so the rest don't have to!",
    funnyDescription:
      "When everyone else is too shy to ask questions, this hero steps up! Has probably saved the entire class from confusion multiple times.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 10,
    title: "Vibe Managers Extraordinaire 🔥",
    winners: ["Nola", "Betty"],
    description: "Keeping the energy high and the party lit 24/7!",
    funnyDescription:
      "These two could make even a database lecture feel like a festival! They're the reason our class events are legendary and our group chats never sleep.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 11,
    title: "Top Football Player ⚽️",
    winners: ["Fira", "Kal"],
    description: "Running circles on the field and stealing hearts!",
    funnyDescription:
      "These stars could have had a career in football if they hadn't chosen CSE! Their footwork is as impressive as their coding skills.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 12,
    title: "Pocket-Sized Powerhouses 🤏",
    winners: ["Dave", "Mikhon"],
    description: "Small but mighty — don't underestimate the short stack!",
    funnyDescription:
      "Proof that greatness comes in small packages! These compact geniuses pack more talent per inch than anyone else in the department.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 13,
    title: "Sky-High Duo 🗼",
    winners: ["Sadam", "Fasika"],
    description: "Heads in the clouds, feet on the ground.",
    funnyDescription:
      "These towering figures don't just stand out in a crowd - they can see over it! Always willing to help get things from high shelves.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 14,
    title: "The Skinny Legends 🦴",
    winners: ["Tare", "Mahi"],
    description: "So thin, you could almost see right through 'em!",
    funnyDescription:
      "These two could hide behind a flagpole! They've mastered the art of slipping through crowds and fitting into the smallest coding spaces.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 15,
    title: "Cuddly Bears Club 🐻",
    winners: ["Hamza", "Wak"],
    description: "Soft, lovable, and proud of their fluff!",
    funnyDescription:
      "The department's official teddy bears! Their hugs are legendary and have been scientifically proven to reduce stress during exam season.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 16,
    title: "Official Music Player 🎵",
    winners: ["Bereket"],
    description: "Singing in the shower, in the lab, in class, on the road...",
    funnyDescription:
      "Our walking karaoke machine! Can turn any situation into a musical and knows the lyrics to literally every song ever created.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 17,
    title: "Comedy Kings & Queens 😄",
    winners: ["Minte", "Faf"],
    description: "Guaranteed to crack you up (or at least try)!",
    funnyDescription:
      "These two could make a compiler error sound hilarious! Their jokes have gotten us through the toughest debugging sessions and longest lectures.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 18,
    title: "Gym Hero 🏋️‍♂️",
    winners: ["Ermi"],
    description: "Lifting weights and spirits with equal passion.",
    funnyDescription:
      "Rumor has it their biceps have their own GitHub repositories! Can debug code and do push-ups simultaneously.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 19,
    title: "Dance Floor Dynamos 🕺",
    winners: ["Ermi", "Sifen"],
    description: "Bringing moves that make even chairs wanna groove!",
    funnyDescription:
      "These dancing machines turn every department event into a dance-off! Their victory dances after successful code compilation are legendary.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 20,
    title: "Best Coordinator 🤝",
    winners: ["Wonde"],
    description: "The mastermind behind the magic and mayhem.",
    funnyDescription:
      "The glue that holds our chaotic batch together! Has somehow managed to organize events despite our collective inability to respond to messages on time.",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export function NominationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              🎉 CSE Department Awards & Honors 2025! 🎉
            </h1>
            <Crown className="h-16 w-16 text-yellow-500 animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-slate-100 rounded-xl p-8 border-2 border-dashed border-blue-300">
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
              🏆 <strong>Welcome to the most prestigious awards ceremony in CSE history!</strong> 🏆
              <br />
              After 4 years of careful observation, extensive research, and a lot of laughs, we present the official
              (totally unofficial) awards for our amazing batch! These categories were scientifically determined by a
              panel of experts (us) and are 100% accurate (maybe). Drumroll please... 🥁
            </p>
          </div>
        </div>

        {/* Special Department Award */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-slate-800 border-4 border-blue-700 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Trophy className="h-12 w-12 text-white animate-spin" />
                <h2 className="text-3xl font-bold text-white">🏆 Best Department of ASTU 🏆</h2>
                <Star className="h-12 w-12 text-white animate-pulse" />
              </div>
              <div className="text-6xl mb-4">🏚👌</div>
              <h3 className="text-2xl font-bold text-white mb-4">Computer Science & Engineering</h3>
              <p className="text-white text-lg">
                Taking the crown with brains, brawn, and a whole lotta vibe! We didn't just study computer science - we
                BECAME computer science! 💻✨
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Nominations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nominations.map((nomination) => (
            <Card
              key={nomination.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-2 hover:border-blue-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={nomination.image || "/placeholder.svg"}
                  alt={nomination.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                    {nomination.id}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Trophy className="h-8 w-8 text-blue-500 animate-pulse" />
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{nomination.title}</h3>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {nomination.winners.map((winner, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold">
                        🏆 {winner}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{nomination.description}</p>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Laugh className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-blue-800">The Full Story:</span>
                  </div>
                  <p className="text-sm text-blue-700 leading-relaxed">{nomination.funnyDescription}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-blue-300">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800">Congratulations to All Our Winners!</h3>
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg">
              Remember, these awards are given with love, laughter, and a healthy dose of inside jokes! Every single one
              of you made our CSE journey absolutely incredible. Here's to the memories, the friendships, and the
              legendary moments that made us who we are today! 🎉✨
            </p>
            <div className="mt-6 text-4xl">🎊 🎈 🎉 🏆 🎉 🎈 🎊</div>
          </div>
        </div>
      </div>
    </div>
  )
}
