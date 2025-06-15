'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X, Calendar, MapPin, User, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminApiUrl, authGet, authPatch } from "@/lib/api"

export interface PendingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  highlights: string[];
  cover_image_url: string | null;
  created_at: string;
  created_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}

export function PendingEvents() {
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const data = await authGet(getAdminApiUrl('pending-events'));
      setEvents(data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
      toast.error('Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [eventId]: true }));
      
      await authPatch(getAdminApiUrl(`events/${eventId}/approve`), {});
      toast.success('Event approved successfully');
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('Failed to approve event');
    } finally {
      setUpdating(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleReject = async (eventId: number) => {
    if (!confirm('Are you sure you want to reject this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdating(prev => ({ ...prev, [eventId]: true }));
      
      await authPatch(getAdminApiUrl(`events/${eventId}/reject`), {});
      toast.success('Event rejected successfully');
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast.error('Failed to reject event');
    } finally {
      setUpdating(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No pending events to review.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="md:flex">
            {event.cover_image_url && (
              <div className="md:w-1/3 h-48 md:h-auto">
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {event.category.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <User className="h-4 w-4 mr-1" />
                  Created by {event.created_by.first_name} {event.created_by.last_name} (@{event.created_by.username})
                </div>
              </CardHeader>
              
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {event.location}
                  </div>
                </div>
                
                <p className="text-gray-700">{event.description}</p>
                
                {event.highlights && event.highlights.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Highlights:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(event.id)}
                    disabled={!!updating[event.id]}
                  >
                    {updating[event.id] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(event.id)}
                    disabled={!!updating[event.id]}
                  >
                    {updating[event.id] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
