"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Linkedin, Github, Plus, Laugh, Heart, Coffee, Loader2, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { fetchProfiles, type Profile } from '@/lib/api/profiles';
import { ProfileEditor } from './profile-editor';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { ProfileImageModal } from './profile-image-modal';

interface ClassmatesPageProps {
  onAddProfile: () => void;
}

export function ClassmatesPage({ onAddProfile }: ClassmatesPageProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [isUserApproved, setIsUserApproved] = useState<boolean | null>(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const { data: session } = useSession();

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProfiles();
      
      console.log('Fetched profiles:', data);
      console.log('Current session user ID:', session?.user?.id);
      
      // Filter profiles to show:
      // 1. All approved profiles with required fields
      // 2. Current user's own profile (even if pending or missing some fields)
      const validProfiles = data.filter(profile => {
        // Use username for matching since it appears more reliable than IDs
        const profileUsername = profile.username || '';
        const currentUsername = session?.user?.username || '';
        const isCurrentUser = profileUsername && currentUsername && 
                            profileUsername.toLowerCase() === currentUsername.toLowerCase();
        
        console.log('Matching - Current user:', currentUsername, 
                   'Profile user:', profileUsername, 
                   'Match:', isCurrentUser);
        
        if (isCurrentUser) {
          console.log('Showing profile for current user:', profile);
          return true;
        }
        
        // For other users, only show approved profiles with required fields
        const hasRequiredFields = profile.bio && profile.nickname && profile.image;
        const isApproved = profile.is_approved;
        const shouldShow = hasRequiredFields && isApproved;
        
        console.log('Profile check:', {
          username: profileUsername,
          hasRequiredFields,
          isApproved,
          shouldShow: isCurrentUser || shouldShow,
          fullProfile: profile
        });
        
        return isCurrentUser || shouldShow;
      });
      
      setProfiles(validProfiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profiles. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageClick = (profile: Profile, imageUrl: string, alt: string) => {
    // If profile is not approved and not the current user's profile, show popup
    if (!profile.is_approved && profile.user?.id !== session?.user?.id) {
      setShowApprovalPopup(true);
      return;
    }
    setSelectedImage({ url: imageUrl, alt });
  };

  useEffect(() => {
    const checkUserApproval = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await response.json();
        // Check for approval status in both camelCase and snake_case
        const isApproved = data.user?.isApproved || data.user?.is_approved || false;
        setIsUserApproved(isApproved);
      } catch (error) {
        console.error('Error checking user approval status:', error);
        setIsUserApproved(false);
      }
    };

    loadProfiles();
    checkUserApproval();
    
    // Refresh the approval status periodically (every 30 seconds)
    const interval = setInterval(checkUserApproval, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setIsEditorOpen(true);
  };

  const checkUserApprovalStatus = async (): Promise<boolean> => {
    if (!session) {
      console.log('No session found');
      return false;
    }
    
    try {
      console.log('Fetching fresh session data...');
      const response = await fetch('/api/auth/session', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch session:', response.status, response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log('Session data:', data);
      
      // Check for approval status in both camelCase and snake_case
      const isApproved = data.user?.isApproved || data.user?.is_approved || false;
      console.log('User approval status:', isApproved);
      
      setIsUserApproved(isApproved);
      return isApproved;
      
    } catch (error) {
      console.error('Error checking approval status:', error);
      return false;
    }
  };

  const handleAddNewProfile = async () => {
    console.log('Add profile clicked. Current session:', session);
    
    if (!session) {
      console.log('No session, calling onAddProfile');
      onAddProfile();
      return;
    }

    console.log('Checking approval status...');
    const isApproved = await checkUserApprovalStatus();
    console.log('Approval check result:', isApproved);
    
    if (!isApproved) {
      console.log('User not approved, showing popup');
      setShowApprovalPopup(true);
      return;
    }
    
    console.log('User approved, opening editor');
    setEditingProfile(null);
    setIsEditorOpen(true);
  };

  const handleProfileSaved = () => {
    loadProfiles();
    setIsEditorOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {/* Approval Popup */}
      {showApprovalPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ShieldAlert className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Profile Not Available</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    This profile is pending admin approval and is not yet visible to other users.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setShowApprovalPopup(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fun Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Laugh className="h-12 w-12 text-yellow-500 animate-bounce" />
            <h1 className="text-5xl font-bold text-gray-900">Meet The Legends!</h1>
            <Coffee className="h-12 w-12 text-amber-600 animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-300">
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              🎉 <strong>Welcome to the Hall of Fame!</strong> 🎉
              <br />
              Here are the incredible humans who survived 5 years of coding, debugging, and pretending to understand
              algorithms! Each one is a certified legend with their own superpower (and caffeine addiction).
            </p>
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-lg font-semibold text-gray-800">
                {profiles.length} {profiles.length === 1 ? 'Amazing Soul' : 'Amazing Souls'} & Counting!
              </span>
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Classmates Grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-md inline-block">
              <h3 className="text-xl font-semibold mb-2">No profiles yet</h3>
              <p className="text-gray-600 mb-4">Be the first to add your profile to the squad!</p>
              {isUserApproved !== false && (
                <Button onClick={handleAddNewProfile}>
                  <Plus className="h-4 w-4 mr-2" /> Create Your Profile
                </Button>
              )}
              {!isUserApproved && session && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldAlert className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your account is pending approval. You'll be able to add a profile once an admin approves your account.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className={`group relative transition-all duration-300 hover:-translate-y-2 bg-white border-2 ${
                  profile.is_approved 
                    ? 'hover:border-blue-200 hover:shadow-xl border-transparent' 
                    : 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 shadow-sm'
                }`}
              >
                {!profile.is_approved && (
                  <div className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center z-10">
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    <span>{profile.user?.id === session?.user?.id ? 'Your Profile' : 'Pending'}</span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div 
                      className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => profile.image && handleImageClick(profile, profile.image, profile.nickname || profile.username || 'Profile')}
                    >
                      <Image
                        src={profile.image || '/default-avatar.png'}
                        alt={profile?.nickname || profile?.username || 'Profile'}
                        fill
                        className="object-cover"
                        sizes="128px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/default-avatar.png';
                        }}
                      />
                      {!profile.is_approved && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center">
                          <ShieldAlert className="h-8 w-8 text-yellow-300 mb-1" />
                          <span className="text-sm text-white font-semibold">Pending Approval</span>
                          {profile.user?.id === session?.user?.id && (
                            <span className="text-xs text-yellow-100 mt-1 px-2 py-0.5 bg-black/30 rounded-full">Only visible to you</span>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {profile?.first_name} {profile?.last_name || ''}
                    </h3>
                    {profile?.nickname && (
                      <p className="text-sm text-blue-600 font-medium">"{profile.nickname}"</p>
                    )}
                    <p className="text-sm text-gray-500">@{profile.username}</p>
                  </div>
                  
                  {!profile.is_approved && (
                    <div className={`mb-4 p-3 rounded-lg border-l-4 ${
                      profile.user?.id === session?.user?.id 
                        ? 'bg-blue-50 border-l-blue-500 border border-blue-100'
                        : 'bg-yellow-50 border-l-yellow-500 border border-yellow-100'
                    }`}>
                      <p className="text-sm flex items-start">
                        <ShieldAlert className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${
                          profile.user?.id === session?.user?.id ? 'text-blue-500' : 'text-yellow-500'
                        }`} />
                        <span className={profile.user?.id === session?.user?.id ? 'text-blue-800' : 'text-yellow-800'}>
                          {profile.user?.id === session?.user?.id 
                            ? 'Your profile is pending admin approval and is only visible to you.'
                            : 'This profile is pending admin approval'}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{profile.bio}</p>
                  
                  {profile.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.interests.slice(0, 5).map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {profile.fun_fact && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-blue-700">
                        Fun Fact: <span className="font-normal">{profile.fun_fact}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-4 mt-4 pt-4 border-t">
                    {profile.social_links?.email && (
                      <a 
                        href={`mailto:${profile.social_links.email}`}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links?.linkedin && (
                      <a 
                        href={profile.social_links.linkedin}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links?.github && (
                      <a 
                        href={profile.social_links.github}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  
                  {session?.user?.id && profile?.id?.toString() === session.user.id && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleEditProfile(profile)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Missing Someone Awesome?</h3>
            <p className="text-gray-600 mb-6">
              Don't see yourself or a friend here? Join the squad and add your profile to our legendary collection!
              Every CSE 2025 student deserves a spot in our digital hall of fame! 🌟
            </p>
            <Button 
              onClick={handleAddNewProfile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              {profiles.some(p => p?.id?.toString() === session?.user?.id) ? 'Update Your Profile' : 'Add Your Profile'}
            </Button>
          </div>
        </div>

        {/* Profile Editor Modal */}
        {isEditorOpen && (
          <ProfileEditor 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)}
            onSuccess={handleProfileSaved}
            initialData={editingProfile || undefined}
          />
        )}

        {/* Image Modal */}
        {selectedImage && (
          <ProfileImageModal
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
            imageUrl={selectedImage.url}
            alt={selectedImage.alt}
          />
        )}
      </div>
    </div>
  );
}
