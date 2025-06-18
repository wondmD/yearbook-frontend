'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { uploadEventPhoto } from '@/lib/api/events';
import { Loader2, Upload, X } from "lucide-react";

interface UploadPhotoModalProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function UploadPhotoModal({ eventId, isOpen, onClose, onUploadSuccess }: UploadPhotoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isHEICFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return fileType === 'image/heic' || 
           fileType === 'image/heif' || 
           fileName.endsWith('.heic') || 
           fileName.endsWith('.heif');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      // Check file size (max 30MB)
      const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 30MB');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const isHEIC = isHEICFile(selectedFile);
      
      if (!validTypes.includes(selectedFile.type) && !isHEIC) {
        toast.error('Only JPEG, PNG, WebP, and HEIC images are allowed');
        return;
      }
      
      // Show loading state for HEIC conversion
      if (isHEIC) {
        setIsConverting(true);
      } else {
        // Show preview immediately for non-HEIC images
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
        return;
      }
      
      // Convert HEIC to PNG if needed - only in browser environment
      if (isHEIC && typeof window !== 'undefined') {
        try {
          // Dynamically import heic2any only when needed and in browser
          const heic2any = (await import('heic2any')).default;
          const pngBlob = await heic2any({
            blob: selectedFile,
            toType: 'image/png',
            quality: 0.8
          }) as Blob;
          
          // Create a new file from the Blob
          const fileToUse = new File(
            [pngBlob],
            selectedFile.name.replace(/\.(heic|heif)$/i, '.png'),
            { type: 'image/png' }
          );
          
          // Update the preview with the converted image
          const previewUrl = URL.createObjectURL(pngBlob);
          setPreviewUrl(previewUrl);
          setFile(fileToUse);
        } catch (conversionError) {
          console.error('Error converting HEIC image:', conversionError);
          toast.error('Failed to convert HEIC image. Please try a different format.');
          setPreviewUrl(null);
          setFile(null);
        }
      } else if (isHEIC) {
        // If we're not in the browser, we can't convert HEIC
        toast.error('HEIC conversion is not supported in this environment. Please use a different image format.');
        setPreviewUrl(null);
        setFile(null);
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try another file.');
      setPreviewUrl(null);
      setFile(null);
    } finally {
      // Always reset the loading state when done
      setIsConverting(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    // Reset the file input
    if (typeof window !== 'undefined') {
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }

    try {
      setIsUploading(true);
      await uploadEventPhoto(eventId, file, caption);
      
      toast.success('Photo uploaded successfully!');
      onUploadSuccess();
      onClose();
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>
            Share your favorite moments from this event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="photo-upload">Photo</Label>
              {isConverting ? (
                <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-md border border-dashed">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Converting HEIC to PNG...</p>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="relative group">
                  <div className="relative h-40 w-full overflow-hidden rounded-md">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, WebP, or HEIC (max 15MB)
                      </p>
                    </div>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*,.heic,.heif"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading || isConverting}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input 
              id="caption" 
              placeholder="Add a caption..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
