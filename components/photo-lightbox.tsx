'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface PhotoLightboxProps {
  photos: Array<{
    id: number;
    image_url: string;
    caption?: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PhotoLightbox({ 
  photos, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev 
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex];

  if (!currentPhoto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-0 overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Previous photo</span>
          </Button>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-0 pb-[75%] max-h-[70vh]">
              <Image
                src={currentPhoto.image_url}
                alt={currentPhoto.caption || 'Event photo'}
                fill
                className="object-contain"
                priority
              />
            </div>
            {currentPhoto.caption && (
              <div className="mt-4 px-4 py-2 text-center text-white">
                <p className="text-sm sm:text-base">{currentPhoto.caption}</p>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-400">
              {currentIndex + 1} of {photos.length}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext}
            disabled={currentIndex === photos.length - 1}
            className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Next photo</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
