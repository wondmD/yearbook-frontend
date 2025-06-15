"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event, fetchEvent } from '@/lib/api/events';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Camera, Loader2, ArrowLeft, Upload, Plus } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { UploadPhotoModal } from '@/components/upload-photo-modal';
import { PhotoLightbox } from '@/components/photo-lightbox';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  
  // Get approved photos from the event object
  const approvedPhotos = event?.photos?.filter((photo: any) => photo.is_approved) || [];
  
  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < approvedPhotos.length - 1 ? prev + 1 : prev));
  };
  
  const handleUploadSuccess = () => {
    // Refresh the page to show the newly uploaded photo
    router.refresh();
  };

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch event details which already includes the photos
        const eventData = await fetchEvent(Number(id));
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
        toast.error('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href="/events" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
              </Link>
            </Button>
            {session?.user?.isApproved && (
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
            )}
          </div>
          
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              {event.cover_image_url ? (
                <Image
                  src={event.cover_image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-white/90 text-gray-800 hover:bg-white/80 transition-colors">
                      {event.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
                  </div>
                  {!event.is_approved && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      Pending Approval
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-white/90 text-sm mt-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  <MapPin className="h-4 w-4 ml-3 mr-1" />
                  {event.location}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Photos</h2>
                {approvedPhotos.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No photos have been added to this event yet.</p>
                    {session?.user?.isApproved && (
                      <Button className="mt-4" asChild>
                        <Link href={`/gallery?event=${id}`}>
                          Add Photos
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {approvedPhotos.map((photo, index) => (
                      <button
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => openLightbox(index)}
                      >
                        <Image
                          src={photo.image_url}
                          alt={photo.caption || 'Event photo'}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <UploadPhotoModal
        eventId={Number(id)}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      <PhotoLightbox
        photos={approvedPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={goToNextPhoto}
        onPrev={goToPrevPhoto}
      />
    </div>
  );
}
