'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Image as ImageIcon, MessageSquare, AlertCircle } from "lucide-react"
import { PendingEvents } from './pending-events';
import { PendingPhotos } from './pending-photos';
import { PendingMemories } from './pending-memories';

export function ContentApprovalTab() {
  const [activeTab, setActiveTab] = useState('memories');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="memories" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Memories
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="mt-6">
          <PendingMemories />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <PendingEvents />
        </TabsContent>
        
        <TabsContent value="media" className="mt-6">
          <PendingPhotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
