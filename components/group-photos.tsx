"use client"

import Image from "next/image"
import { useState } from "react"

const groupPhotos = [
  {
    id: 1,
    src: "/placeholder.svg?height=200&width=300",
    alt: "CSE Class Group Photo 1",
    caption: "First Day Vibes 📸",
    rotation: "rotate-2",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=180&width=280",
    alt: "CSE Class Group Photo 2",
    caption: "100 Day Celebration 🎉",
    rotation: "-rotate-3",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=220&width=320",
    alt: "CSE Class Group Photo 3",
    caption: "Tech Fest Squad 💻",
    rotation: "rotate-1",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=190&width=290",
    alt: "CSE Class Group Photo 4",
    caption: "Lab Session Fun 🔬",
    rotation: "-rotate-2",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=210&width=310",
    alt: "CSE Class Group Photo 5",
    caption: "Graduation Prep 🎓",
    rotation: "rotate-3",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=200&width=300",
    alt: "CSE Class Group Photo 6",
    caption: "Pizza Friday 🍕",
    rotation: "-rotate-1",
  },
]

export function GroupPhotos() {
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  return (
    <>
      {/* Scattered Photos */}
      <div className="absolute top-20 left-10 hidden lg:block">
        <div
          className={`relative transform ${groupPhotos[0].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(1)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[0].src || "/placeholder.svg"}
              alt={groupPhotos[0].alt}
              width={200}
              height={150}
              className="rounded object-cover"
            />
            {hoveredPhoto === 1 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[0].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-32 right-16 hidden lg:block">
        <div
          className={`relative transform ${groupPhotos[1].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(2)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[1].src || "/placeholder.svg"}
              alt={groupPhotos[1].alt}
              width={180}
              height={135}
              className="rounded object-cover"
            />
            {hoveredPhoto === 2 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[1].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-40 left-20 hidden lg:block">
        <div
          className={`relative transform ${groupPhotos[2].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(3)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[2].src || "/placeholder.svg"}
              alt={groupPhotos[2].alt}
              width={220}
              height={165}
              className="rounded object-cover"
            />
            {hoveredPhoto === 3 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[2].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-60 right-10 hidden lg:block">
        <div
          className={`relative transform ${groupPhotos[3].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(4)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[3].src || "/placeholder.svg"}
              alt={groupPhotos[3].alt}
              width={190}
              height={142}
              className="rounded object-cover"
            />
            {hoveredPhoto === 4 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[3].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-5 hidden xl:block">
        <div
          className={`relative transform ${groupPhotos[4].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(5)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[4].src || "/placeholder.svg"}
              alt={groupPhotos[4].alt}
              width={210}
              height={157}
              className="rounded object-cover"
            />
            {hoveredPhoto === 5 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[4].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-1/3 right-5 hidden xl:block">
        <div
          className={`relative transform ${groupPhotos[5].rotation} transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20`}
          onMouseEnter={() => setHoveredPhoto(6)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <Image
              src={groupPhotos[5].src || "/placeholder.svg"}
              alt={groupPhotos[5].alt}
              width={200}
              height={150}
              className="rounded object-cover"
            />
            {hoveredPhoto === 6 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {groupPhotos[5].caption}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
