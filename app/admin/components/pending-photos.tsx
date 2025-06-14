'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X, Image as ImageIcon, User, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getAdminApiUrl, authGet, authPatch } from "@/lib/api"

export interface PendingPhoto {
  id: number;
  image: string;
  image_url: string;
  caption?: string;
  event: {
    id: number;
    title: string;
  };
  uploaded_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  uploaded_at: string;
}

export function PendingPhotos() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  const fetchPendingPhotos = async () => {
    try {
      setLoading(true);
      const data = await authGet(getAdminApiUrl('pending-photos'));
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      toast.error('Failed to load pending photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photoId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [photoId]: true }));
      
      await authPatch(getAdminApiUrl(`pending-photos/${photoId}`), { action: 'approve' });
      
      toast.success('Photo approved successfully');
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error approving photo:', error);
      toast.error('Failed to approve photo');
    } finally {
      setUpdating(prev => ({ ...prev, [photoId]: false }));
    }
  };

  const handleReject = async (photoId: number) => {
    if (!confirm('Are you sure you want to reject this photo? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdating(prev => ({ ...prev, [photoId]: true }));
      
      await authPatch(getAdminApiUrl(`pending-photos/${photoId}`), { action: 'reject' });
      
      toast.success('Photo rejected and deleted');
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast.error('Failed to reject photo');
    } finally {
      setUpdating(prev => ({ ...prev, [photoId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No pending photos</h3>
        <p className="mt-1 text-sm text-gray-500">All photos have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={photo.image_url}
                alt={photo.caption || `Photo from ${photo.event?.title || 'event'}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-medium">
                {photo.event?.title || 'Untitled Event'}
              </CardTitle>
              {photo.caption && (
                <p className="text-sm text-gray-600 mt-1">{photo.caption}</p>
              )}
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <User className="h-3 w-3 mr-1" />
                <span>{photo.uploaded_by.username}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(photo.uploaded_at).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(photo.id)}
                disabled={updating[photo.id]}
              >
                {updating[photo.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleApprove(photo.id)}
                disabled={updating[photo.id]}
              >
                {updating[photo.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
