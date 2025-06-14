'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X, FileText, User, Calendar, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"

interface Content {
  id: string;
  title: string;
  type: 'post' | 'comment' | 'media';
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ContentApprovalTab() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [rejecting, setRejecting] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content/pending', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending content');
      }
      
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching pending content:', error);
      toast.error('Failed to load pending content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId: string) => {
    try {
      setApproving(prev => ({ ...prev, [contentId]: true }));
      
      const response = await fetch(`/api/admin/content/${contentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve content');
      }
      
      toast.success('Content approved successfully');
      // Refresh the list
      await fetchPendingContent();
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Failed to approve content');
    } finally {
      setApproving(prev => ({ ...prev, [contentId]: false }));
    }
  };

  const handleReject = async (contentId: string) => {
    try {
      setRejecting(prev => ({ ...prev, [contentId]: true }));
      
      const response = await fetch(`/api/admin/content/${contentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject content');
      }
      
      toast.success('Content rejected successfully');
      // Refresh the list
      await fetchPendingContent();
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Failed to reject content');
    } finally {
      setRejecting(prev => ({ ...prev, [contentId]: false }));
    }
  };

  const getContentTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: string }> = {
      post: { label: 'Post', variant: 'outline' },
      comment: { label: 'Comment', variant: 'secondary' },
      media: { label: 'Media', variant: 'default' },
    };
    
    const { label, variant } = typeMap[type] || { label: type, variant: 'outline' };
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-muted/50 rounded-lg">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium">No content pending approval</h3>
        <p className="text-sm text-muted-foreground mt-1">
          All content has been reviewed and approved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border divide-y divide-gray-200 dark:divide-gray-700">
        {content.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getContentTypeBadge(item.type)}
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {item.author.name} (@{item.author.username})
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(item.id)}
                  disabled={rejecting[item.id] || approving[item.id]}
                >
                  {rejecting[item.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  disabled={approving[item.id] || rejecting[item.id]}
                >
                  {approving[item.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Found {content.length} item{content.length !== 1 ? 's' : ''} pending approval
      </p>
    </div>
  );
}
