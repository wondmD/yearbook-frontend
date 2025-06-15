'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
      formData.append('caption', caption);
    }

    try {
      setIsUploading(true);
      const response = await fetch(`/api/events/${eventId}/photos/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      toast.success('Photo uploaded successfully!');
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="photo">Photo</Label>
            <Input 
              id="photo" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={isUploading}
            />
          </div>
          
          {previewUrl && (
            <div className="mt-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-48 w-auto mx-auto rounded-md"
              />
            </div>
          )}
          
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
