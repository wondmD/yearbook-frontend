"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const groupPhotos = [
  {
    id: 1,
    src: "/images/pics/3D4A3444.JPG",
    alt: "CSE Class Group Photo 1",
    caption: "50 day celebration",
    rotation: "rotate-2",
  },
  {
    id: 2,
    src: "/images/pics/photo_2025-06-16_13-28-33.jpg",
    alt: "CSE Class Group Photo 2",
    caption: "GC announcement",
    rotation: "-rotate-1",
  },
  {
    id: 3,
    src: "/images/pics/photo_2025-06-16_13-29-59.jpg",
    alt: "CSE Class Group Photo 3",
    caption: "Last Exam",
    rotation: "rotate-2",
  },
  {
    id: 4,
    src: "/images/pics/photo_2025-06-16_13-30-15.jpg",
    alt: "CSE Class Group Photo 4",
    caption: "Jersey announcement day 🏆",
    rotation: "-rotate-3",
  },
  {
    id: 5,
    src: "/images/pics/photo_2025-06-16_13-30-27.jpg",
    alt: "CSE Class Group Photo 5",
    caption: "GC announcement",
    rotation: "rotate-3",
  },
  {
    id: 6,
    src: "/images/pics/photo_2025-06-16_13-30-40.jpg",
    alt: "CSE Class Group Photo 6",
    caption: "Color Day",
    rotation: "-rotate-1",
  },
]

export function GroupPhotos() {
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  
  // Handle opening the dialog
  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedPhoto(null)
  }

  return (
    <>
      {/* Scattered Photos */}
      <Dialog open={selectedPhoto === 0} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute top-20 left-10 hidden lg:block cursor-pointer"
            onClick={() => setSelectedPhoto(0)}
          >
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
        </DialogTrigger>
      </Dialog>

      <Dialog open={selectedPhoto === 1} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute top-32 right-16 hidden lg:block cursor-pointer"
            onClick={() => setSelectedPhoto(1)}
          >
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
        </DialogTrigger>
      </Dialog>

      <Dialog open={selectedPhoto === 2} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute bottom-40 left-20 hidden lg:block cursor-pointer"
            onClick={() => setSelectedPhoto(2)}
          >
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
        </DialogTrigger>
      </Dialog>

      <Dialog open={selectedPhoto === 3} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute bottom-60 right-10 hidden lg:block cursor-pointer"
            onClick={() => setSelectedPhoto(3)}
          >
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
        </DialogTrigger>
      </Dialog>

      <Dialog open={selectedPhoto === 4} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute top-1/2 left-5 hidden xl:block cursor-pointer"
            onClick={() => setSelectedPhoto(4)}
          >
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
        </DialogTrigger>
      </Dialog>

      <Dialog open={selectedPhoto === 5} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div 
            className="absolute top-1/3 right-5 hidden xl:block cursor-pointer"
            onClick={() => setSelectedPhoto(5)}
          >
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
        </DialogTrigger>
      </Dialog>
      {/* Single shared dialog content */}
      <Dialog open={selectedPhoto !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          {selectedPhoto !== null && (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <Image
                src={groupPhotos[selectedPhoto].src}
                alt={groupPhotos[selectedPhoto].alt}
                fill
                className="object-contain p-4 bg-white rounded-lg"
                unoptimized={groupPhotos[selectedPhoto].src.endsWith('.gif')}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                <p className="text-lg font-medium">{groupPhotos[selectedPhoto].caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
