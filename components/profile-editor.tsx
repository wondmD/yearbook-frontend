"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X, Upload, Mail, Github, Linkedin, Twitter, Instagram, Globe } from 'lucide-react';
import { createOrUpdateProfile, fetchMyProfile, UserProfile, ProfileFormData, uploadProfileImage } from '@/lib/api/profiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfileFormValues = Omit<ProfileFormData, 'interests' | 'social_links'> & {
  interests: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    email: string;
  };
  image?: File | string | null;
};

// Maximum file size 30MB
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// Define the social links schema for form validation
const socialLinksSchema = z.object({
  github: z.string().url('Please enter a valid URL').or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').or(z.literal('')),
  twitter: z.string().url('Please enter a valid URL').or(z.literal('')),
  instagram: z.string().url('Please enter a valid URL').or(z.literal('')),
  website: z.string().url('Please enter a valid URL').or(z.literal('')),
  email: z.string().email('Please enter a valid email').or(z.literal('')),
}).strict();

// Create the validation schema for the form values
const profileSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  interests: z.string().min(1, 'Please add at least one interest'),
  fun_fact: z.string().min(1, 'Fun fact is required'),
  image: z.any().optional(),
  social_links: socialLinksSchema.optional(),
}).refine(
  (data) => !data.image || (data.image instanceof File && data.image.size <= MAX_FILE_SIZE),
  {
    message: 'Max image size is15MB',
    path: ['image'],
  }
).refine(
  (data) => !data.image || (data.image instanceof File && ACCEPTED_IMAGE_TYPES.includes(data.image.type)),
  {
    message: 'Only .jpg, .jpeg, .png, and .webp files are accepted',
    path: ['image'],
  }
);

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<UserProfile>;
}

export function ProfileEditor({ isOpen, onClose, onSuccess, initialData }: ProfileEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  
  // Initialize default form values
  const defaultValues: ProfileFormValues = {
    first_name: session?.user?.name?.split(' ')[0] || '',
    last_name: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    email: session?.user?.email || '',
    nickname: '',
    bio: '',
    location: '',
    interests: '',
    fun_fact: '',
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      website: '',
      email: ''
    },
    image: null
  };

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: (() => {
      if (!initialData) return defaultValues;
      
      // Format interests array to string if needed
      const formattedInterests = Array.isArray(initialData.interests) 
        ? initialData.interests.join(', ')
        : initialData.interests || '';
      
      // Merge default social links with any existing ones
      const formattedSocialLinks = {
        ...defaultValues.social_links,
        ...(initialData.social_links || {})
      };
      
      // Create the form values with proper typing
      const formValues: ProfileFormValues = {
        ...defaultValues,
        nickname: initialData.nickname || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
        fun_fact: initialData.fun_fact || '',
        interests: formattedInterests,
        social_links: formattedSocialLinks,
        image: initialData.image || null
      };
      
      return formValues;
    })(),
  });

  const socialLinks = watch('social_links');

  const isHEICFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return fileType === 'image/heic' || 
           fileType === 'image/heif' || 
           fileName.endsWith('.heic') || 
           fileName.endsWith('.heif');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 30MB');
        return;
      }
      
      // Check file type
      const isHEIC = isHEICFile(selectedFile);
      if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type) && !isHEIC) {
        toast.error('Only JPEG, PNG, WebP, and HEIC images are allowed');
        return;
      }
      
      // Show loading state for HEIC conversion
      if (isHEIC) {
        setIsConverting(true);
      } else {
        // Show preview immediately for non-HEIC images
        setPreviewImage(URL.createObjectURL(selectedFile));
      }
      
      let fileToUse = selectedFile;
      
      // Convert HEIC to PNG if needed
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
          fileToUse = new File(
            [pngBlob],
            selectedFile.name.replace(/\.(heic|heif)$/i, '.png'),
            { type: 'image/png' }
          );
          
          // Update the preview with the converted image
          const previewUrl = URL.createObjectURL(pngBlob);
          setPreviewImage(previewUrl);
        } catch (conversionError) {
          console.error('Error converting HEIC image:', conversionError);
          toast.error('Failed to convert HEIC image. Please try a different format.');
          return;
        }
      } else if (isHEIC) {
        // If we're not in the browser, we can't convert HEIC
        toast.error('HEIC conversion is not supported in this environment. Please use a different image format.');
        return;
      }
      
      // Update the file state - cast to any to bypass the type checking for now
      setValue('image' as any, fileToUse);
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try another file.');
      setPreviewImage(null);
      setValue('image' as any, null);
    } finally {
      // Always reset the loading state when done
      setIsConverting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setValue('image', null);
    setPreviewImage(null);
    // Reset the file input
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          interests: initialData.interests?.join(', ') || '',
        });
      }
      setIsLoading(false);
    }
  }, [isOpen, initialData, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Handle image upload if a new file was selected
      let imageUrl: string | null = null;
      if (formData.image) {
        if (typeof formData.image !== 'string') {
          const result = await uploadProfileImage(formData.image as File);
          if (result && 'url' in result) {
            imageUrl = result.url;
          } else {
            throw new Error('Failed to upload image');
          }
        } else {
          imageUrl = formData.image;
        }
      }

      // Prepare the data to send to the API
      const dataToSend: ProfileFormData = {
        ...formData,
        first_name: session?.user?.name?.split(' ')[0] || '',
        last_name: session?.user?.name?.split(' ').slice(1).join(' ') || '',
        email: session?.user?.email || '',
        // Convert comma-separated interests to array
        interests: formData.interests
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean),
        // Ensure social_links is always defined with all required fields
        social_links: {
          github: formData.social_links?.github || '',
          linkedin: formData.social_links?.linkedin || '',
          twitter: formData.social_links?.twitter || '',
          instagram: formData.social_links?.instagram || '',
          website: formData.social_links?.website || '',
          email: formData.social_links?.email || ''
        },
        // Use the uploaded image URL or existing URL
        image: imageUrl || undefined
      };

      // Call the API to save the profile
      await createOrUpdateProfile(dataToSend);
      
      // Show success message
      toast.success('Your profile has been saved.');
      
      // Call the success callback if provided
      onSuccess?.();
      
      // Close the modal and refresh the page
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Show error message
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {initialData ? 'Edit Your Profile' : 'Create Your Profile'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-image-upload">Profile Picture</Label>
              {isConverting ? (
                <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-md border border-dashed">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Converting HEIC to PNG...</p>
                  </div>
                </div>
              ) : previewImage || initialData?.image ? (
                <div className="relative group">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewImage || initialData?.image || ''}
                      alt="Profile preview"
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
                    htmlFor="profile-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, WebP, or HEIC (max 30MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}
              {errors.image && (
                <p className="text-sm font-medium text-destructive">
                  {errors.image.message as string}
                </p>
              )}
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*,.heic,.heif"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={isSubmitting || isConverting}
              />
            </div>
            
            <div>
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                placeholder="Your nickname"
                {...register('nickname')}
                className={errors.nickname ? 'border-red-500' : ''}
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                {...register('bio')}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where are you from?"
                {...register('location')}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="interests">Interests (comma separated)</Label>
              <Input
                id="interests"
                placeholder="e.g. React, Python, Hiking, Coffee"
                {...register('interests')}
              />
              {errors.interests && (
                <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="fun_fact">Fun Fact</Label>
              <Input
                id="fun_fact"
                placeholder="Share something interesting about yourself"
                {...register('fun_fact')}
                className={errors.fun_fact ? 'border-red-500' : ''}
              />
              {errors.fun_fact && (
                <p className="text-red-500 text-sm mt-1">{errors.fun_fact.message}</p>
              )}
            </div>
            
            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    {...register('social_links.github')}
                    className={errors.social_links?.github ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.github && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.github.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    {...register('social_links.linkedin')}
                    className={errors.social_links?.linkedin ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.linkedin && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.linkedin.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    {...register('social_links.twitter')}
                    className={errors.social_links?.twitter ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.twitter && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.twitter.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/username"
                    {...register('social_links.instagram')}
                    className={errors.social_links?.instagram ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.instagram && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.instagram.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Personal Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    {...register('social_links.website')}
                    className={errors.social_links?.website ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.website && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.website.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('social_links.email')}
                    className={errors.social_links?.email ? 'border-red-500' : ''}
                  />
                  {errors.social_links?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.email.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
