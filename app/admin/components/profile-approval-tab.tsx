'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X, User, Calendar, Mail, GraduationCap, MapPin, Info } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Profile {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    batch: string;
  };
  nickname: string;
  bio: string;
  location: string;
  interests: string[];
  fun_fact: string;
  social_links: Record<string, string>;
  image: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function ProfileApprovalTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [rejecting, setRejecting] = useState<Record<string, boolean>>({});
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true);
      const baseUrl = 'https://yearbook.ethioace.com';
      // Use auth prefix to match backend route
      const apiUrl = `${baseUrl}/api/auth/admin/profiles/pending/`;
      console.log('[ProfileApprovalTab] Fetching pending profiles from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('[ProfileApprovalTab] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('[ProfileApprovalTab] Error response:', errorData);
          errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
        } catch (e) {
          console.error('[ProfileApprovalTab] Failed to parse error response:', e);
        }
        throw new Error(`Failed to fetch pending profiles: ${errorMessage}`);
      }
      
      const responseData = await response.json();
      console.log('[ProfileApprovalTab] Raw API response:', responseData);
      
      // DEBUG: Log the exact structure of the response
      console.log('[DEBUG] Response data type:', typeof responseData);
      console.log('[DEBUG] Response keys:', Object.keys(responseData));
      
      // Handle different response formats
      let allProfiles = [];
      
      if (Array.isArray(responseData)) {
        console.log('[DEBUG] Response is an array');
        allProfiles = responseData;
      } else if (responseData && typeof responseData === 'object') {
        console.log('[DEBUG] Response is an object');
        
        // Check for common response structures
        if (Array.isArray(responseData.results)) {
          console.log('[DEBUG] Found results array with length:', responseData.results.length);
          allProfiles = responseData.results;
        } else if (Array.isArray(responseData.profiles)) {
          console.log('[DEBUG] Found profiles array with length:', responseData.profiles.length);
          allProfiles = responseData.profiles;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          console.log('[DEBUG] Found data array with length:', responseData.data.length);
          allProfiles = responseData.data;
        } else {
          // Try to find any array in the response
          const arrayKeys = Object.keys(responseData).filter(key => Array.isArray(responseData[key]));
          console.log('[DEBUG] Array keys in response:', arrayKeys);
          
          if (arrayKeys.length > 0) {
            allProfiles = responseData[arrayKeys[0]];
            console.log(`[DEBUG] Using array from key '${arrayKeys[0]}' with length:`, allProfiles.length);
          }
        }
      }
      
      console.log(`[ProfileApprovalTab] Extracted ${allProfiles.length} profiles from response`);
      
      if (allProfiles.length === 0) {
        console.warn('[ProfileApprovalTab] No profiles found in the response');
        console.log('[ProfileApprovalTab] Full response structure:', JSON.stringify(responseData, null, 2));
        
        // Try to find any objects that might be profiles
        const potentialProfiles = [];
        function findPotentialProfiles(obj, path = '') {
          if (!obj || typeof obj !== 'object') return;
          
          // If this looks like a profile object
          if (obj.user && obj.user.id) {
            potentialProfiles.push({ path, data: obj });
          }
          
          // Recursively search through the object
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              findPotentialProfiles(obj[key], path ? `${path}.${key}` : key);
            }
          }
        }
        
        findPotentialProfiles(responseData);
        console.log('[DEBUG] Potential profiles found:', potentialProfiles);
        
        if (potentialProfiles.length > 0) {
          console.log('[DEBUG] Found potential profiles at these paths:');
          potentialProfiles.forEach(({ path }, index) => {
            console.log(`[${index + 1}] ${path}`);
          });
          
          // Use the first potential profile path if found
          const path = potentialProfiles[0].path.split('.');
          let profiles = responseData;
          for (const key of path) {
            profiles = profiles[key];
          }
          allProfiles = Array.isArray(profiles) ? profiles : [profiles];
          console.log(`[DEBUG] Using profiles from path '${potentialProfiles[0].path}':`, allProfiles);
        }
      }
      
      // TEMPORARY: Disable filtering for debugging
      console.log('[DEBUG] Bypassing profile filtering for debugging');
      const validProfiles = [...allProfiles];
      
      console.log(`[ProfileApprovalTab] Displaying ${validProfiles.length} profiles (filtering disabled for debugging)`);
      setProfiles(validProfiles);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
      toast.error('Failed to load pending profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId: string) => {
    try {
      setApproving(prev => ({ ...prev, [profileId]: true }));
      
      // Use auth prefix to match backend route
      const response = await fetch(getApiUrl(`auth/admin/profiles/${profileId}/approve`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to approve profile');
      }

      toast.success('Profile approved successfully');
      setProfiles(profiles.filter(profile => profile.id !== profileId));
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error approving profile:', error);
      toast.error('Failed to approve profile');
    } finally {
      setApproving(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const handleReject = async (profileId: string) => {
    try {
      setRejecting(prev => ({ ...prev, [profileId]: true }));
      
      // Use auth prefix to match backend route
      const response = await fetch(getApiUrl(`auth/admin/profiles/${profileId}/reject`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to reject profile');
      }

      toast.success('Profile rejected');
      setProfiles(profiles.filter(profile => profile.id !== profileId));
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error rejecting profile:', error);
      toast.error('Failed to reject profile');
    } finally {
      setRejecting(prev => ({ ...prev, [profileId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-lg">No pending profiles to review</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h2 className="text-lg font-semibold">Pending Profiles</h2>
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                selectedProfile?.id === profile.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedProfile(profile)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  {profile?.image ? (
                    <AvatarImage 
                      src={profile.image}
                      alt={profile.user?.username || 'User'} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <AvatarFallback>
                      {profile?.user?.first_name?.[0]}
                      {profile?.user?.last_name?.[0] || 
                       (profile?.user?.username?.[0] || 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {profile?.user?.first_name || 'Unknown'} {profile?.user?.last_name || 'User'}
                    {profile?.nickname && ` (${profile.nickname})`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.user?.batch ? `Batch ${profile.user.batch} • ` : ''}
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProfile && (
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative h-48 w-48 rounded-lg overflow-hidden border">
                  {selectedProfile.image ? (
                    <Image
                      src={selectedProfile.image}
                      alt={`${selectedProfile?.user?.first_name || 'User'}'s profile`}
                      fill
                      className="object-cover"
                      sizes="192px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/default-profile.png';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {selectedProfile?.user?.first_name || 'User'} {selectedProfile?.user?.last_name || ''}
                      {selectedProfile?.nickname && (
                        <span className="text-muted-foreground ml-2">"{selectedProfile.nickname}"</span>
                      )}
                    </h1>
                    <div className="flex items-center text-muted-foreground mt-1 space-x-4 flex-wrap gap-y-1">
                      {selectedProfile?.user?.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{selectedProfile.user.email}</span>
                        </div>
                      )}
                      {selectedProfile?.user?.batch && (
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>Batch {selectedProfile.user.batch}</span>
                        </div>
                      )}
                      {selectedProfile?.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{selectedProfile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {selectedProfile?.status || 'pending'}
                  </Badge>
                </div>

                <div className="mt-6 space-y-4">
                  {(selectedProfile?.bio) ? (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                      <p className="mt-1">{selectedProfile.bio}</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                      <p className="mt-1 text-muted-foreground italic">No bio provided</p>
                    </div>
                  )}
                  
                  {(selectedProfile?.interests && selectedProfile.interests.length > 0) ? (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProfile.interests.map((interest: string, i: number) => (
                          <Badge key={i} variant="secondary">
                            {interest.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Interests</h3>
                      <p className="text-muted-foreground italic">No interests listed</p>
                    </div>
                  )}

                  {(selectedProfile?.fun_fact) ? (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Fun Fact</h3>
                      <p className="mt-1">{selectedProfile.fun_fact}</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Fun Fact</h3>
                      <p className="mt-1 text-muted-foreground italic">No fun fact provided</p>
                    </div>
                  )}

                  {selectedProfile.social_links && Object.keys(selectedProfile.social_links).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Social Links</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(selectedProfile.social_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedProfile.id)}
                    disabled={rejecting[selectedProfile.id]}
                  >
                    {rejecting[selectedProfile.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedProfile.id)}
                    disabled={approving[selectedProfile.id]}
                  >
                    {approving[selectedProfile.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
