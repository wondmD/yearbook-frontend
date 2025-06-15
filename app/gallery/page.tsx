'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchEventPhotos } from '@/lib/api/events';
import { toast } from 'sonner';

interface EventPhoto {
  id: number;
  image_url: string;
  caption?: string;
  uploaded_by: {
    id: number;
    username: string;
  };
  uploaded_at: string;
  is_approved: boolean;
}

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: session } = useSession();

  // Load photos when component mounts or eventId changes
  useEffect(() => {
    const loadPhotos = async () => {
      if (!eventId) {
        toast.error('No event specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Loading photos for event ${eventId}...`);
        
        const photosData = await fetchEventPhotos(Number(eventId));
        console.log('Fetched photos:', photosData);
        
        setPhotos(Array.isArray(photosData) ? photosData : []);
      } catch (error) {
        console.error('Error loading photos:', error);
        toast.error('Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [eventId]);

  // Navigation functions
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    setSelectedImage(prev => {
      if (prev === null) return null;
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : photos.length - 1;
      } else {
        return prev < photos.length - 1 ? prev + 1 : 0;
      }
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage, photos.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Photos Yet</h1>
        <p className="text-gray-600">Be the first to upload a photo to this event!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Event Gallery</h1>
      
      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="relative group cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setSelectedImage(index);
              setIsFullscreen(true);
            }}
          >
            <Image
              src={photo.image_url}
              alt={photo.caption || 'Event photo'}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
                <p className="text-white text-sm truncate">{photo.caption}</p>
                <p className="text-xs text-gray-300">By: {photo.uploaded_by.username}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={() => navigateImage('prev')}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={photos[selectedImage].image_url}
                alt={photos[selectedImage].caption || 'Event photo'}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain"
                priority
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={() => navigateImage('next')}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          <div className="mt-4 text-center text-white max-w-2xl w-full">
            <h3 className="text-xl font-semibold">
              {photos[selectedImage].caption || 'Untitled Photo'}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Uploaded by {photos[selectedImage].uploaded_by.username} •{' '}
              {new Date(photos[selectedImage].uploaded_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}