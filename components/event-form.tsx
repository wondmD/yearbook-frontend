'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createEvent } from '@/lib/api/events';

const categories = [
  { value: 'MILESTONE', label: 'Milestone' },
  { value: 'THEME_DAY', label: 'Theme Day' },
  { value: 'ACADEMIC', label: 'Academic' },
  { value: 'WELCOME', label: 'Welcome' },
];

interface EventFormProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function EventForm({ onSuccess, children }: EventFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [highlights, setHighlights] = useState(['']);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [category, setCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session?.accessToken) {
      toast.error('You must be logged in to create an event');
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Add date if selected
    if (date) {
      formData.append('date', date.toISOString().split('T')[0]);
    }
    
    // Add category
    if (category) {
      formData.set('category', category);
    }
    
    // Add highlights
    const highlightsList = highlights.filter(h => h.trim() !== '');
    formData.delete('highlights'); // Remove any existing highlights
    highlightsList.forEach((highlight, index) => {
      formData.append(`highlights[${index}]`, highlight);
    });
    
    // Add cover image if selected
    if (file) {
      formData.set('cover_image', file);
    }

    setLoading(true);
    
    try {
      const event = await createEvent(formData);
      toast.success('Event created successfully!');
      setOpen(false);
      
      // Reset form
      e.currentTarget.reset();
      setDate(new Date());
      setHighlights(['']);
      setFile(null);
      setPreviewUrl(null);
      setCategory('');
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      const newHighlights = highlights.filter((_, i) => i !== index);
      setHighlights(newHighlights);
    }
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
  
  const isHEICFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return fileType === 'image/heic' || 
           fileType === 'image/heif' || 
           fileName.endsWith('.heic') || 
           fileName.endsWith('.heif');
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter event title"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter event location"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={loading}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                name="category" 
                value={category}
                onValueChange={setCategory}
                required 
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell us about the event..."
              className="min-h-[100px]"
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                {isConverting ? (
                  <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-md">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Converting HEIC to PNG...</p>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <div className="relative h-40 w-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div>
                <Label
                  htmlFor="cover_image"
                  className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Choose File
                </Label>
                <Input
                  id="cover_image"
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Highlights</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHighlight}
                disabled={loading}
              >
                Add Highlight
              </Button>
            </div>
            
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder={`Highlight ${index + 1}`}
                    disabled={loading}
                  />
                  {highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                      disabled={loading}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}