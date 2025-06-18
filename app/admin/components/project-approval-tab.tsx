'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Project, getPendingProjects, approveProject, rejectProject } from '@/lib/api/projects';
import { format } from 'date-fns';

export function ProjectApprovalTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const fetchPendingProjects = async () => {
    console.log('Starting to fetch pending projects...');
    try {
      setLoading(true);
      console.log('Calling getPendingProjects...');
      const data = await getPendingProjects();
      console.log('Received projects data:', data);
      
      if (!data) {
        console.warn('No data received from getPendingProjects');
        setProjects([]);
        return;
      }
      
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error in fetchPendingProjects:', error);
      let errorMessage = 'Failed to load pending projects';
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Set empty array to prevent UI errors
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const handleApprove = async (projectId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [projectId]: true }));
      await approveProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: 'Success',
        description: 'Project approved successfully!',
      });
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve project',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleReject = async (projectId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [projectId]: true }));
      await rejectProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: 'Success',
        description: 'Project rejected successfully',
      });
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject project',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => ({ ...prev, [projectId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pending projects to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Project Approvals</h2>
        <p className="text-gray-600 mb-6">
          Review and approve or reject project submissions. Approved projects will be visible to all users.
        </p>
        
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No pending projects to review. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  {project.created_at && (
                    <CardDescription className="text-xs text-gray-500">
                      Submitted on {format(new Date(project.created_at), 'MMM d, yyyy')}
                    </CardDescription>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.category && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        {project.category}
                      </Badge>
                    )}
                    {project.technologies?.length > 0 && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {project.technologies.slice(0, 2).join(', ')}
                        {project.technologies.length > 2 ? '...' : ''}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.long_description && (
                    <details className="mb-4">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                        View more details
                      </summary>
                      <p className="mt-2 text-sm text-gray-600">
                        {project.long_description}
                      </p>
                    </details>
                  )}

                  {project.created_by && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Submitted by:</span> {project.created_by.username}
                      </p>
                      {project.created_by.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {project.created_by.email}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(project.id)}
                      disabled={updating[project.id]}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      {updating[project.id] ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(project.id)}
                      disabled={updating[project.id]}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {updating[project.id] ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
