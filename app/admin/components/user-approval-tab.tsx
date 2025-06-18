'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, X } from "lucide-react"
import { useSession } from "next-auth/react"

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  profile: number;
}

export function UserApprovalTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [rejecting, setRejecting] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  useEffect(() => {
    fetchUnapprovedUsers();
  }, []);

  const fetchUnapprovedUsers = async () => {
    try {
      setLoading(true);
      console.log('[UserApprovalTab] Fetching unapproved users...');
      
      const baseUrl = 'https://yearbook.ethioace.com';
      const apiUrl = `${baseUrl}/api/auth/admin/users/unapproved/`;
      console.log('[UserApprovalTab] Making request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        credentials: 'include',
        cache: 'no-store',
      });
      
      console.log('[UserApprovalTab] Response status:', response.status);
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
          console.error('[UserApprovalTab] Error response data:', errorData);
        } catch (e) {
          console.error('[UserApprovalTab] Failed to parse error response');
        }
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[UserApprovalTab] Received response:', data);
      
      // Extract users array from the response
      const users = data.users || [];
      console.log('[UserApprovalTab] Extracted users:', users);
      
      // Ensure we have an array of users
      if (!Array.isArray(users)) {
        console.warn('[UserApprovalTab] Expected array but got:', typeof users, users);
        setUsers([]);
        return;
      }
      
      // Transform the data to match our User interface
      const usersData = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_active: user.is_active,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        date_joined: user.date_joined,
        profile: user.profile,
      }));
      
      console.log(`[UserApprovalTab] Setting ${usersData.length} users to state`);
      setUsers(usersData);
      
    } catch (error) {
      console.error('[UserApprovalTab] Error in fetchUnapprovedUsers:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load unapproved users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      setApproving(prev => ({ ...prev, [userId]: true }));
      const baseUrl = 'https://yearbook.ethioace.com';
      const response = await fetch(`${baseUrl}/api/auth/admin/users/${userId}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      
      toast.success('User approved successfully');
      // Refresh the list
      await fetchUnapprovedUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    } finally {
      setApproving(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId: number) => {
    try {
      setRejecting(prev => ({ ...prev, [userId]: true }));
      const baseUrl = 'https://yearbook.ethioace.com';
      const response = await fetch(`${baseUrl}/api/auth/admin/users/${userId}/reject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject user');
      }
      
      toast.success('User rejected successfully');
      // Refresh the list
      await fetchUnapprovedUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    } finally {
      setRejecting(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-muted/50 rounded-lg">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">No pending approvals</h3>
          <p className="text-sm text-muted-foreground mt-1">
            All users have been reviewed and approved.
          </p>
        </div>
        
        {/* Debug Info */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Information</h4>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <p>Users in state: {users.length}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Last fetch time: {new Date().toLocaleTimeString()}</p>
            <button 
              onClick={fetchUnapprovedUsers}
              className="mt-2 px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
            >
              Refetch Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage 
                    src={`/api/avatar/${user.id}`} 
                    alt={`${user.first_name} ${user.last_name}`} 
                  />
                  <AvatarFallback>
                    {user.first_name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{user.username}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(user.id)}
                  disabled={rejecting[user.id] || approving[user.id]}
                >
                  {rejecting[user.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(user.id)}
                  disabled={approving[user.id] || rejecting[user.id]}
                >
                  {approving[user.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Found {users.length} user{users.length !== 1 ? 's' : ''} pending approval
      </p>
    </div>
  );
}
