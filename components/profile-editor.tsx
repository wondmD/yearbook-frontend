import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, X, Upload, Mail, Github, Linkedin, Twitter, Instagram, Globe } from 'lucide-react';
import { createOrUpdateProfile, fetchMyProfile, UserProfile, ProfileFormValues, ProfileFormData, uploadProfileImage } from '@/lib/api/profiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Maximum file size 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
    message: 'Max image size is 5MB',
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
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize default form values
  const defaultValues: ProfileFormValues = {
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
      email: '',
    },
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
      
      return {
        ...defaultValues,
        ...initialData,
        interests: formattedInterests,
        social_links: formattedSocialLinks
      };
    })(),
  });

  const socialLinks = watch('social_links');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPEG, PNG, WEBP)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    setValue('image', file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setValue('image', null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      if (formData.image instanceof File) {
        const { url } = await uploadProfileImage(formData.image);
        imageUrl = url;
      } else if (typeof formData.image === 'string') {
        imageUrl = formData.image;
      }

      // Prepare the data to send to the API
      const dataToSend: ProfileFormData = {
        ...formData,
        // Convert comma-separated interests to array
        interests: formData.interests
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean),
        // Ensure social_links is always defined with all required fields
        social_links: formData.social_links || {
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          website: '',
          email: ''
        },
        // Use the uploaded image URL or existing URL
        image: imageUrl
      };

      // Call the API to save the profile
      await createOrUpdateProfile(dataToSend);
      
      // Show success message
      toast({
        title: 'Success!',
        description: 'Your profile has been saved.',
      });
      
      // Call the success callback if provided
      onSuccess?.();
      
      // Close the modal and refresh the page
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Show error message
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile',
        variant: 'destructive',
      });
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
            <div className="flex items-center justify-center">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={previewImage || initialData?.image} 
                    alt="Profile preview" 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {initialData?.user?.first_name?.[0]}{initialData?.user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {previewImage || initialData?.image ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message as string}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1 text-center">
                JPG, PNG or WEBP. Max 5MB.
              </p>
            </div>
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
        </form>
      </div>
    </div>
  );
}
