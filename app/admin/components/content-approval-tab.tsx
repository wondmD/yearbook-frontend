'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Calendar, Image as ImageIcon, AlertCircle } from "lucide-react"
import { PendingEvents } from './pending-events';
import { PendingPhotos } from './pending-photos';

export function ContentApprovalTab() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <PendingEvents />
        </TabsContent>
        
        <TabsContent value="posts" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No pending posts to review.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="mt-6">
          <PendingPhotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
