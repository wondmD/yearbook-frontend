"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the session type with the properties we expect
interface CustomSession {
  accessToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // Add any additional user properties you need
  };
  // Add any other session properties you need
}
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getApiUrl, API_BASE_URL } from '@/lib/api';
import { Plus, Heart, MessageSquare, Loader2, X } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"

type Memory = {
  id: number
  title: string
  description: string
  image_url?: string
  created_by: {
    id: number
    username: string
    avatar?: string
  }
  created_at: string
  likes_count: number
  has_liked: boolean
  is_approved?: boolean
}

const MemoryCard = ({ 
  memory, 
  onLike 
}: { 
  memory: Memory; 
  onLike: (id: number) => void 
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const formattedDate = new Date(memory.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Safely get user info with fallbacks
  const user = memory.created_by || {};
  const username = user?.username || 'Anonymous';
  const avatar = user?.avatar;
  const fallbackText = username?.[0]?.toUpperCase() || 'U';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {memory.image_url && (
        <div className="relative h-48 w-full cursor-pointer" onClick={() => setIsImageOpen(true)}>
          <Image
            src={memory.image_url}
            alt={memory.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {/* Image Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
          <div className="relative w-full h-[80vh] bg-black/90 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsImageOpen(false);
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {memory.image_url && (
                <Image
                  src={memory.image_url}
                  alt={memory.title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{memory.title}</h3>
            {memory.is_approved === false && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Unapproved
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(memory.id)}
            className={`flex items-center space-x-1 ${memory.has_liked ? 'text-red-500' : ''}`}
          >
            <Heart
              size={16}
              className={memory.has_liked ? 'fill-current' : ''}
            />
            <span>{memory.likes_count || 0}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            {avatar && <AvatarImage src={avatar} alt={username} />}
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
          <span>{username}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{memory.description}</p>
      </CardContent>
    </Card>
  );
};

const MemorySkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </CardContent>
  </Card>
);

interface AddMemoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; image: File | null }) => Promise<boolean>;
}

const AddMemoryDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}: AddMemoryDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Call the parent's onSubmit and handle the dialog closing in the parent
    onSubmit({ title, description, image })
      .then((success) => {
        if (success) {
          onOpenChange(false);
        }
      })
      .catch((error) => {
        console.error('Error submitting memory:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setImage(null);
      setPreviewUrl(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share a Memory</DialogTitle>
          <DialogDescription>
            Share a funny moment, coding disaster, or any memory from your journey.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the memory about?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us the story..."
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Add a photo (optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
              {previewUrl && (
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Share Memory
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function MemoriesPage() {
  const { data: session } = useSession() as { data: CustomSession | null };
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const funnyCategories = [
    { id: 'all', label: 'All Memories', emoji: '📚' },
    { id: 'funny', label: 'Funny Moments', emoji: '😂' },
    { id: 'coding', label: 'Coding Disasters', emoji: '💻' },
    { id: 'food', label: 'Food Adventures', emoji: '🍕' },
    { id: 'random', label: 'Random Shenanigans', emoji: '🎭' },
    { id: 'my-memories', label: 'My Memories', emoji: '🌟' },
  ];

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setIsLoading(true);
        
        // Determine the endpoint based on the active tab
        const isMyMemories = activeTab === 'my-memories';
        const endpoint = isMyMemories ? 'my_memories' : '';
        
        // Set up headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add Authorization header for all requests
        if (session?.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
        }
        
        // Construct the full URL
        const url = getApiUrl(endpoint);
        console.log('=== FETCHING MEMORIES ===');
        console.log('Endpoint:', endpoint || '(default)');
        console.log('Full URL:', url);
        console.log('Active Tab:', activeTab);
        console.log('Using Auth:', !!session?.accessToken);
        
        const res = await fetch(url, { 
          headers,
          credentials: 'include', // Important for cookies
          cache: 'no-store' // Ensure fresh data
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', res.status, errorText);
          let errorMessage = `Failed to fetch memories (${res.status})`;
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await res.json();
        console.log('Raw API response:', data);
        
        // Handle paginated response (Django REST framework style)
        let memoriesArray = [];
        if (data && typeof data === 'object') {
          // Check for Django REST framework pagination format
          if (Array.isArray(data.results)) {
            memoriesArray = data.results;
          } 
          // Check for other common pagination formats
          else if (Array.isArray(data.data)) {
            memoriesArray = data.data;
          } 
          else if (data.items && Array.isArray(data.items)) {
            memoriesArray = data.items;
          }
          // If it's not paginated but has an array directly
          else if (Array.isArray(data)) {
            memoriesArray = data;
          }
          // Handle case where the response is a single memory object
          else if (data.id) {
            memoriesArray = [data];
          }
        } 
        // If the response is directly an array
        else if (Array.isArray(data)) {
          memoriesArray = data;
        }
        
        console.log(`Processed ${memoriesArray.length} memories:`, memoriesArray);
        
        // Define a type for the raw memory data from the API
        interface RawMemory {
          id: number;
          title?: string;
          description?: string;
          image_url?: string;
          image?: string;
          created_at?: string;
          likes_count?: number;
          has_liked?: boolean;
          is_approved?: boolean;
          created_by?: {
            id: number;
            username: string;
            avatar?: string;
          };
          user_id?: number;
          username?: string;
          user_avatar?: string;
          avatar?: string;  // Add this line to fix the TypeScript error
        }

        // Transform the data to match the expected Memory interface
        const formattedMemories = (memoriesArray as RawMemory[]).map((memory) => ({
          id: memory.id,
          title: memory.title || 'Untitled Memory',
          description: memory.description || '',
          image_url: memory.image_url || memory.image || undefined,
          created_at: memory.created_at || new Date().toISOString(),
          likes_count: memory.likes_count || 0,
          has_liked: memory.has_liked || false,
          is_approved: memory.is_approved, // Keep the original value
          created_by: memory.created_by || {
            id: memory.user_id || 0,
            username: memory.username || 'Unknown',
            avatar: memory.avatar || memory.user_avatar || undefined
          }
        }));
        
        setMemories(formattedMemories);
        
      } catch (error) {
        console.error('Error in fetchMemories:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to load memories. Please try again.';
        
        // Don't show error toast for 401/403 - handled by auth flow
        if (!errorMessage.toLowerCase().includes('unauthorized') && 
            !errorMessage.toLowerCase().includes('forbidden')) {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, [activeTab, session]);

  const handleLike = async (memoryId: number) => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(getApiUrl(`${memoryId}/like/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(
          responseData.error || 
          responseData.detail || 
          'Failed to like memory'
        );
      }
      
      setMemories(memories.map(memory => 
        memory.id === memoryId 
          ? { 
              ...memory, 
              has_liked: responseData.liked, 
              likes_count: responseData.likes_count 
            } 
          : memory
      ));
    } catch (error) {
      console.error('Error liking memory:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to like memory. Please try again.',
        { duration: 3000 }
      );
    }
  };

  const handleSubmitMemory = async (data: { 
    title: string; 
    description: string; 
    image: File | null 
  }): Promise<boolean> => {
    // Debug function to safely inspect objects
    const safeStringify = (obj: any) => {
      try {
        return JSON.stringify(obj, (key, value) => 
          key === 'password' || key === 'accessToken' || key === 'token' ? '***REDACTED***' : value
        );
      } catch (e) {
        return String(obj);
      }
    };
    
    const debugLog = (message: string, data?: any) => {
      console.log(`[MemorySubmit] ${message}`, data ? safeStringify(data) : '');
    };
    if (!session) {
      debugLog('No session found, redirecting to signin');
      router.push('/auth/signin');
      return false;
    }
    
    debugLog('=== START: handleSubmitMemory ===');
    debugLog('Form data', { 
      title: data.title, 
      description: data.description,
      hasImage: !!data.image,
      imageSize: data.image?.size
    });
    
    // Log session info (safely)
    debugLog('Session info', {
      hasSession: !!session,
      user: session.user ? { 
        id: session.user.id,
        name: session.user.name,
        email: session.user.email 
      } : null,
      sessionKeys: session ? Object.keys(session) : []
    });

    try {
      setIsSubmitting(true);
      
      // Client-side image size validation (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (data.image && data.image.size > MAX_FILE_SIZE) {
        throw new Error('Image size exceeds 5MB limit. Please choose a smaller file.');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (data.image) {
        formData.append('image', data.image);
      }

      // Get the token from NextAuth session
      const token = (session as any)?.accessToken || 
                  (session as any)?.access_token ||
                  (session as any)?.user?.accessToken;
                  
      // Debug log the session to see what's available
      debugLog('Session data', {
        hasSession: !!session,
        sessionKeys: session ? Object.keys(session) : [],
        userKeys: session?.user ? Object.keys(session.user) : [],
        hasToken: !!token,
        tokenPrefix: token ? `${token.substring(0, 10)}...` : 'No token found'
      });
      
      debugLog('Auth token check', {
        hasToken: !!token,
        tokenPrefix: token ? `${token.substring(0, 10)}...` : 'none',
        tokenLength: token?.length || 0,
        tokenSources: {
          'session.accessToken': !!session?.accessToken,
          'session.token.accessToken': !!(session as any)?.token?.accessToken,
          'session.user.accessToken': !!(session as any)?.user?.accessToken,
          'session.access_token': !!(session as any)?.access_token,
          'session.token': !!(session as any)?.token,
          'localStorage': typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
          'cookies': typeof document !== 'undefined' ? document.cookie.includes('access_token=') : false
        },
        // Log a sample of the token for debugging (first and last 5 chars)
        tokenSample: token ? `${token.substring(0, 5)}...${token.substring(-5)}` : 'none'
      });
      
      if (!token) {
        const error = new Error('No access token found in session');
        debugLog(error.message, { 
          sessionKeys: session ? Object.keys(session) : [],
          userKeys: session?.user ? Object.keys(session.user) : []
        });
        throw error;
      }

      if (!token) {
        const error = new Error('No authentication token found. Please log in again.');
        debugLog('Authentication error', { error: error.message });
        router.push('/auth/signin');
        return false;
      }

      // Make API request
      const apiUrl = getApiUrl('memories');
      debugLog('Sending request to', { url: apiUrl });
      
      try {
        // Prepare request options
        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`
        };
        
        debugLog('Request headers', { 
          hasAuthHeader: !!headers['Authorization'],
          authHeaderPrefix: headers['Authorization']?.substring(0, 10) + '...'
        });
        
        // Note: Don't set Content-Type header when using FormData
        // The browser will set it automatically with the correct boundary
        
        const requestOptions: RequestInit = {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include', // Include cookies in the request
          mode: 'cors', // Ensure CORS mode is set
          cache: 'no-cache', // Don't cache the request
          redirect: 'follow', // Follow redirects
          referrerPolicy: 'no-referrer-when-downgrade', // Default referrer policy
        };
        
        debugLog('Request options', {
          method: requestOptions.method,
          url: apiUrl,
          headers: {
            ...headers,
            // Don't log the full token in headers
            Authorization: headers['Authorization'] ? 'Bearer [REDACTED]' : undefined
          },
          hasBody: !!requestOptions.body,
          credentials: requestOptions.credentials,
          mode: requestOptions.mode,
          cache: requestOptions.cache
        });
        
        // Log the actual request being made
        debugLog('Sending fetch request', {
          url: apiUrl,
          method: 'POST',
          hasToken: !!token,
          hasFormData: !!formData,
          formDataKeys: Array.from(formData.keys())
        });
        
        const startTime = Date.now();
        let res;
        try {
          res = await fetch(apiUrl, requestOptions);
        } catch (fetchError) {
          debugLog('Fetch request failed', {
            error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
            name: fetchError instanceof Error ? fetchError.name : 'UnknownError',
            stack: fetchError instanceof Error ? fetchError.stack : undefined
          });
          throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
        }
        const responseTime = Date.now() - startTime;
        
        // Log response info
        const responseHeaders: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        
        debugLog('Response received', {
          status: res.status,
          statusText: res.statusText,
          responseTime: `${responseTime}ms`,
          url: res.url,
          redirected: res.redirected,
          type: res.type,
          headers: responseHeaders
        });
        
        // Clone the response so we can read it multiple times if needed
        const responseClone = res.clone();
        
        // Try to parse the response as JSON, fall back to text if it fails
        let responseData;
        const contentType = res.headers.get('content-type') || '';
        
        try {
          if (contentType.includes('application/json')) {
            try {
              responseData = await res.json();
              debugLog('Response data (JSON)', responseData);
            } catch (e) {
              debugLog('Failed to parse JSON response', { 
                error: String(e),
                contentType,
                status: res.status,
                statusText: res.statusText
              });
              const text = await responseClone.text();
              debugLog('Raw response text', text);
              responseData = { 
                error: 'Invalid JSON response', 
                raw: text,
                status: res.status,
                statusText: res.statusText
              };
            }
          } else {
            const text = await responseClone.text();
            debugLog('Response data (non-JSON)', { 
              contentType,
              length: text.length,
              preview: text.length > 200 ? `${text.substring(0, 200)}...` : text
            });
            responseData = { 
              raw: text,
              status: res.status,
              statusText: res.statusText
            };
          }
        } catch (e) {
          debugLog('Error processing response', {
            error: e instanceof Error ? e.message : 'Unknown error',
            status: res.status,
            statusText: res.statusText,
            contentType
          });
          responseData = {
            error: 'Failed to process response',
            details: e instanceof Error ? e.message : 'Unknown error',
            status: res.status,
            statusText: res.statusText
          };
        }
        
        if (!res.ok) {
          // Handle common HTTP error statuses with specific messages
          let errorMessage = 'An error occurred while processing your request';
          
          switch (res.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input and try again.';
              break;
            case 401:
              errorMessage = 'You need to be logged in to perform this action. Redirecting to login...';
              // Redirect to login page for authentication errors
              router.push('/auth/signin');
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 413:
              errorMessage = 'The file you are trying to upload is too large.';
              break;
            case 500:
              errorMessage = 'A server error occurred. Please try again later.';
              break;
            default:
              // Try to get error message from response
              errorMessage = responseData?.detail || 
                            responseData?.error || 
                            responseData?.message ||
                            `Server error: ${res.status} ${res.statusText}`;
          }
          
          // Create a detailed error object
          const error = new Error(errorMessage) as Error & {
            status?: number;
            details?: any;
            response?: any;
          };
          
          error.status = res.status;
          error.details = responseData;
          error.response = {
            status: res.status,
            statusText: res.statusText,
            headers: responseHeaders,
            url: res.url,
            redirected: res.redirected
          };
          
          debugLog('Request failed', {
            status: res.status,
            statusText: res.statusText,
            error: errorMessage,
            response: responseData,
            errorDetails: {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          });
          
          throw error;
        }
        
        // Update UI with new memory
        setMemories(prevMemories => [responseData, ...prevMemories]);
        toast.success('Memory shared successfully!');
        
        debugLog('Memory created successfully', { memoryId: responseData?.id });
        return true;
        
      } catch (error) {
        debugLog('Error in fetch request', { 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
      

      
    } catch (error) {
      // Log detailed error information for debugging
      console.error('Memory submission error:', error);
      
      // Define the error type with optional properties
      interface ApiError extends Error {
        status?: number;
        response?: any;
      }
      
      let errorMessage = 'An unknown error occurred';
      let isAuthError = false;
      let shouldRedirect = false;
      let errorDetails: any = {};
      
      const apiError = error as ApiError;
      
      // Extract error information
      if (error instanceof Error) {
        const errorStatus = 'status' in error ? (error as any).status : undefined;
        const errorResponse = 'response' in error ? (error as any).response : undefined;
        
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          status: errorStatus,
          response: errorResponse
        });
        
        errorMessage = error.message;
        
        // Check for authentication/authorization errors
        isAuthError = error.message.toLowerCase().includes('token') || 
                    error.message.toLowerCase().includes('auth') ||
                    error.message.toLowerCase().includes('login') ||
                    error.message.toLowerCase().includes('unauthorized') ||
                    error.message.toLowerCase().includes('forbidden') ||
                    errorStatus === 401 || 
                    errorStatus === 403;
        
        // Handle 403 Forbidden specifically
        if (errorStatus === 403) {
          errorMessage = 'You do not have permission to perform this action. Please log in with the correct account.';
          isAuthError = true;
        }
        
        // Get more details from the error object if available
        // @ts-ignore
        if (error.details) {
          errorDetails = error.details;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      // Log the error with all available details
      debugLog('Error in handleSubmitMemory', { 
        error: errorMessage,
        isAuthError,
        errorDetails,
        originalError: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      });
      
      // If it's an auth error, prepare to redirect to login
      if (isAuthError) {
        console.log('Auth error detected, preparing to redirect to login');
        shouldRedirect = true;
        
        // Update error message if it's a generic one
        if (!errorMessage.toLowerCase().includes('log in') && 
            !errorMessage.toLowerCase().includes('authentication')) {
          errorMessage = 'Your session has expired. Please log in again.';
        }
      }
      
      // Show error toast with appropriate duration
      toast.error(errorMessage, { 
        duration: shouldRedirect ? 5000 : 10000, // Shorter duration if redirecting
        closeButton: true,
        action: {
          label: 'Dismiss',
          onClick: () => {}
        },
        // Don't auto-close if it's not an auth error
        ...(isAuthError ? {} : { duration: 10000 })
      });
      
      // If it's an auth error, redirect to login after a short delay
      if (shouldRedirect) {
        console.log('Redirecting to login due to auth error');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 1500);
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
                {funnyCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-1"
                  >
                    <span>{category.emoji}</span>
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Button 
              className="ml-4" 
              onClick={() => {
                if (!session) {
                  router.push('/auth/signin');
                  return;
                }
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Memory
            </Button>
            <AddMemoryDialog 
              open={isDialogOpen} 
              onOpenChange={setIsDialogOpen}
              onSubmit={handleSubmitMemory}
            />
          </div>

          <div className="py-4">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <MemorySkeleton key={i} />
                ))}
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No memories yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share a memory from our journey together!
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    if (!session) {
                      router.push('/auth/signin');
                      return;
                    }
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Share a Memory
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {memories.map((memory) => (
                  <MemoryCard 
                    key={memory.id} 
                    memory={memory} 
                    onLike={handleLike} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
