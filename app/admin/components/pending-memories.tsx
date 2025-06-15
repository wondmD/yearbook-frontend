'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X, User, Clock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getAdminApiUrl, authGet, authPatch } from "@/lib/api"

export interface PendingMemory {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  created_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  likes_count: number;
  comments_count: number;
}

export function PendingMemories() {
  const [memories, setMemories] = useState<PendingMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchPendingMemories();
  }, []);

  const fetchPendingMemories = async () => {
    try {
      setLoading(true);
      const response = await authGet(getAdminApiUrl('pending-memories'));
      if (response && Array.isArray(response)) {
        setMemories(response);
      } else {
        console.error('Unexpected response format:', response);
        toast.error('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('Error fetching pending memories:', error);
      toast.error(error.message || 'Failed to load pending memories');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memoryId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [memoryId]: true }));
      // Make sure to include a trailing slash in the URL
      const url = getAdminApiUrl(`pending-memories/${memoryId}/`);
      console.log('Approving memory with URL:', url);
      
      const response = await authPatch(url, { action: 'approve' });
      console.log('Approve response:', response);
      
      if (response && response.status === 'approved') {
        toast.success('Memory approved successfully');
        setMemories(prev => prev.filter(m => m.id !== memoryId));
      } else {
        throw new Error(response?.error || 'Failed to approve memory');
      }
    } catch (error: any) {
      console.error('Error approving memory:', error);
      toast.error(error.message || 'Failed to approve memory');
    } finally {
      setUpdating(prev => ({ ...prev, [memoryId]: false }));
    }
  };

  const handleReject = async (memoryId: number) => {
    if (!confirm('Are you sure you want to reject this memory? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdating(prev => ({ ...prev, [memoryId]: true }));
      // Make sure to include a trailing slash in the URL
      const url = getAdminApiUrl(`pending-memories/${memoryId}/`);
      console.log('Rejecting memory with URL:', url);
      
      const response = await authPatch(url, { action: 'reject' });
      console.log('Reject response:', response);
      
      if (response && response.status === 'rejected') {
        toast.success('Memory rejected successfully');
        setMemories(prev => prev.filter(m => m.id !== memoryId));
      } else {
        throw new Error(response?.error || 'Failed to reject memory');
      }
    } catch (error: any) {
      console.error('Error rejecting memory:', error);
      toast.error(error.message || 'Failed to reject memory');
    } finally {
      setUpdating(prev => ({ ...prev, [memoryId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No pending memories to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memories.map((memory) => (
        <Card key={memory.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{memory.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>{memory.created_by.first_name} {memory.created_by.last_name}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(memory.id)}
                  disabled={updating[memory.id]}
                >
                  {updating[memory.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(memory.id)}
                  disabled={updating[memory.id]}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {updating[memory.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{memory.content}</p>
            {memory.image_url && (
              <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image
                  src={memory.image_url}
                  alt={memory.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex items-center mt-3 text-sm text-muted-foreground">
              <span>{memory.likes_count} likes</span>
              <span className="mx-2">•</span>
              <span>{memory.comments_count} comments</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
