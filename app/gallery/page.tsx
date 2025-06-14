"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react"
import Image from "next/image"

const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    alt: "50 Day Celebration Group Photo",
    event: "50 Day Celebration",
    category: "Group Photos",
    likes: 24,
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=600",
    alt: "100 Day Bash Dance Performance",
    event: "100 Day Bash",
    category: "Performances",
    likes: 31,
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Jersey Day Team Spirit",
    event: "Jersey Day",
    category: "Theme Days",
    likes: 18,
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Tech Fest Hackathon",
    event: "Tech Fest 2024",
    category: "Academic",
    likes: 42,
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Freshers Welcome Ceremony",
    event: "Freshers' Welcome",
    category: "Ceremonies",
    likes: 35,
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Halloween Costume Contest",
    event: "Halloween Party",
    category: "Theme Days",
    likes: 28,
  },
  {
    id: 7,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Study Group Session",
    event: "Study Sessions",
    category: "Academic",
    likes: 15,
  },
  {
    id: 8,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Campus Candid Moments",
    event: "Daily Life",
    category: "Candids",
    likes: 22,
  },
  {
    id: 9,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Food Festival Fun",
    event: "Food Festival",
    category: "Food & Fun",
    likes: 39,
  },
  {
    id: 10,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Sports Day Competition",
    event: "Sports Day",
    category: "Sports",
    likes: 26,
  },
  {
    id: 11,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Cultural Night Performance",
    event: "Cultural Night",
    category: "Performances",
    likes: 33,
  },
  {
    id: 12,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Graduation Preparation",
    event: "Graduation Prep",
    category: "Ceremonies",
    likes: 47,
  },
]

const categories = [
  "All",
  "Group Photos",
  "Performances",
  "Theme Days",
  "Academic",
  "Ceremonies",
  "Candids",
  "Food & Fun",
  "Sports",
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())

  const filteredImages =
    selectedCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedImage(filteredImages[newIndex].id)
  }

  const toggleLike = (imageId: number) => {
    const newLikedImages = new Set(likedImages)
    if (newLikedImages.has(imageId)) {
      newLikedImages.delete(imageId)
    } else {
      newLikedImages.add(imageId)
    }
    setLikedImages(newLikedImages)
  }

  const selectedImageData = selectedImage ? galleryImages.find((img) => img.id === selectedImage) : null

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing every smile, every laugh, and every unforgettable moment of our incredible journey together. Click
            on any photo to view it in full size!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === selectedCategory ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => openLightbox(image.id)}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 text-gray-800 text-xs">{image.event}</Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                  <Heart
                    className={`h-3 w-3 ${likedImages.has(image.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                  <span className="text-xs text-gray-600">{image.likes}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gallery Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{galleryImages.length}</div>
              <div className="text-gray-600">Total Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {galleryImages.reduce((sum, img) => sum + img.likes, 0)}
              </div>
              <div className="text-gray-600">Total Likes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">∞</div>
              <div className="text-gray-600">Memories</div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {selectedImage && selectedImageData && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="relative">
                <Image
                  src={selectedImageData.src || "/placeholder.svg"}
                  alt={selectedImageData.alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold mb-2">{selectedImageData.alt}</h3>
                <div className="flex justify-center items-center space-x-4">
                  <Badge className="bg-white/20 text-white">{selectedImageData.event}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => toggleLike(selectedImageData.id)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${likedImages.has(selectedImageData.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {selectedImageData.likes + (likedImages.has(selectedImageData.id) ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
