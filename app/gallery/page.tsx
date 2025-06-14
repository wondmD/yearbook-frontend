"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, Heart, Loader2, Plus, Home, Image as ImageIcon, User, LogIn } from "lucide-react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import Image from "next/image"
import { toast } from "sonner"
import { fetchEvent, fetchEventPhotos } from "@/lib/api/events"

// Use the EventPhoto type from the API to ensure consistency
import type { EventPhoto as APIEventPhoto } from '@/lib/api/events';

// Extend the API type to ensure compatibility with our component
interface EventPhoto extends Omit<APIEventPhoto, 'event'> {
  event?: string | number; // Allow both string and number for event ID
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  cover_image_url: string | null
  category: string
  is_approved: boolean
  created_at: string
  updated_at: string
  created_by: number
}

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
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event')
  
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const { data: session } = useSession()
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUploadClick = () => {
    if (!session) {
      toast.error("Please sign in to upload photos")
      return
    }
    setShowUploadDialog(true)
  }

  const handleUpload = async () => {
    if (!selectedFile || !eventId || !session?.accessToken) return
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      if (caption) {
        formData.append('caption', caption)
      }
      
      const response = await fetch(`/api/events/events/${eventId}/photos/`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload photo')
      }
      
      const newPhoto = await response.json()
      setPhotos(prev => [...prev, newPhoto])
      setShowUploadDialog(false)
      setSelectedFile(null)
      setCaption("")
      setPreviewUrl(null)
      toast.success('Photo uploaded successfully!')
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    console.log('Event ID from URL:', eventId);
    if (eventId) {
      loadEventAndPhotos();
    } else {
      console.error('No eventId found in URL');
    }
  }, [eventId])

  const loadEventAndPhotos = async () => {
    if (!eventId) {
      console.error('No eventId provided');
      return;
    }
    
    console.log('Starting to load event and photos for eventId:', eventId);
    setLoading(true);
    
    try {
      // 1. Fetch event data
      console.log('1. Fetching event data...');
      const eventData = await fetchEvent(Number(eventId));
      console.log('✅ Event data loaded:', eventData);
      
      // 2. Fetch photos
      console.log('2. Fetching photos...');
      const photosData = await fetchEventPhotos(Number(eventId));
      console.log('✅ Photos data loaded. Count:', photosData.length);
      console.log('Photos data sample:', photosData[0] || 'No photos found');
      
      // 3. Format event data
      const formattedEvent: Event = {
        id: eventData.id,
        title: eventData.title || 'Untitled Event',
        description: eventData.description || '',
        date: eventData.date || new Date().toISOString(),
        location: eventData.location || '',
        cover_image_url: eventData.cover_image_url || null,
        category: eventData.category || 'General',
        is_approved: eventData.is_approved || false,
        created_at: eventData.created_at || new Date().toISOString(),
        updated_at: eventData.updated_at || new Date().toISOString(),
        created_by: typeof eventData.created_by === 'object' ? eventData.created_by.id : eventData.created_by || 0
      };
      
      // 4. Update state
      console.log('3. Updating component state...');
      setEvent(formattedEvent);
      
      // Use the photos data as is since we've updated the interface to match
      const typedPhotos: EventPhoto[] = [...photosData];
      
      setPhotos(typedPhotos);
      console.log('✅ State updated with', typedPhotos.length, 'photos');
      
    } catch (error) {
      console.error('❌ Error loading event data:', error);
      toast.error('Failed to load event data');
    } finally {
      setLoading(false);
      console.log('Finished loading event and photos');
    }
  }

  const currentImage = selectedImage !== null && 
                       photos && 
                       photos[selectedImage] 
    ? {
        id: photos[selectedImage]?.id,
        src: photos[selectedImage]?.image_url,
        alt: photos[selectedImage]?.caption || `Event photo ${selectedImage + 1}`,
        event: event?.title || 'Event',
        category: event?.category || 'Photo',
        likes: 0,
        uploaded_by: photos[selectedImage]?.uploaded_by?.username || 'User',
        uploaded_at: photos[selectedImage]?.uploaded_at 
          ? new Date(photos[selectedImage].uploaded_at).toLocaleDateString()
          : ''
      }
    : null

  // Ensure photos is always an array before filtering
  const photosArray = Array.isArray(photos) ? photos : [];
  console.log('Current photos array:', photosArray);
  
  // Filter approved photos only for non-admin users
  const filteredPhotos = useMemo(() => 
    photosArray
      .filter(photo => photo && photo.image_url) // Ensure photo has required fields
      .filter(photo => {
        // If user is admin, show all photos
        if ((session?.user as any)?.isAdmin) return true;
        // Otherwise, only show approved photos
        return photo.is_approved === true;
      }),
    [photosArray, session?.user]
  );

  // Debugging: Log the photos data and its type
  useEffect(() => {
    console.log('=== Photos Debug ===');
    console.log('Photos data:', JSON.stringify(photos, null, 2));
    console.log('Photos type:', typeof photos);
    console.log('Is array:', Array.isArray(photos));
    if (Array.isArray(photos)) {
      console.log('Number of photos:', photos.length);
      if (photos.length > 0) {
        console.log('First photo:', photos[0]);
        console.log('First photo image_url:', photos[0]?.image_url);
      }
    } else {
      console.log('Photos is not an array, converting to array');
    }
    console.log('Filtered photos count:', filteredPhotos.length);
    console.log('Session user:', session?.user);
    console.log('Is admin:', (session?.user as any)?.isAdmin);
  }, [photos, filteredPhotos, session]);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    let newIndex
    if (direction === "prev") {
      newIndex = selectedImage > 0 ? selectedImage - 1 : filteredPhotos.length - 1
    } else {
      newIndex = selectedImage < filteredPhotos.length - 1 ? selectedImage + 1 : 0
    }
    setSelectedImage(newIndex)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Menubar className="border-b-0">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                Home
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <ImageIcon className="h-4 w-4 mr-2" />
                Gallery
              </MenubarTrigger>
            </MenubarMenu>
            <div className="ml-auto flex items-center">
              {session ? (
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.name || 'Profile'}
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>My Profile</MenubarItem>
                    <MenubarItem>Sign Out</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <Button variant="ghost" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </Menubar>
        </div>
      </div>

      {/* Upload Photo Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Photo</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowUploadDialog(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop your photo here, or click to browse
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  id="photo-upload" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  {previewUrl ? 'Change Photo' : 'Select Photo'}
                </Button>
                {previewUrl && (
                  <div className="mt-4 relative h-40">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (optional)
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Photo'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? `${event.title} - Photos` : 'Event Photos'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              className="gap-2"
              onClick={handleUploadClick}
            >
              <Plus className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing every smile, every laugh, and every unforgettable moment of our incredible journey together. Click
            on any photo to view it in full size!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No photos have been added to this event yet.</p>
            </div>
          ) : (
            filteredPhotos.map((photo, index) => (
              <Card
                key={photo.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square overflow-hidden">
                  {photo.image_url ? (
                    <Image
                      src={photo.image_url}
                      alt={photo.caption || `Event photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.error('Error loading image:', photo.image_url);
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop if placeholder also fails
                        target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  {(photo.caption || photo.uploaded_at) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      {photo.caption && (
                        <h3 className="font-medium text-white line-clamp-1">{photo.caption}</h3>
                      )}
                      {photo.uploaded_at && (
                        <p className="text-xs text-white/80">
                          {new Date(photo.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gallery Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{filteredPhotos.length}</div>
              <div className="text-gray-600">Total Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {filteredPhotos.reduce((sum, img) => sum + (img.likes || 0), 0)}
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
        {selectedImage && currentImage && (
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
                  src={currentImage.src || "/placeholder.svg"}
                  alt={currentImage.alt}
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
                <h3 className="text-xl font-semibold mb-2">{currentImage.alt}</h3>
                <div className="flex justify-center items-center space-x-4">
                  <Badge className="bg-white/20 text-white">{currentImage.event}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => toggleLike(currentImage.id)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${likedImages.has(currentImage.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {currentImage.likes + (likedImages.has(currentImage.id) ? 1 : 0)}
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
