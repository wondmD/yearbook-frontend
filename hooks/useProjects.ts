import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/lib/api/projects';
import { getProjects as fetchProjects } from '@/lib/api/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getProjects = useCallback(async () => {
    try {
      console.log('useProjects: Fetching projects...');
      setLoading(true);
      setError(null);
      
      const data = await fetchProjects();
      console.log('useProjects: Received data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected an array of projects');
      }
      
      setProjects(data);
      console.log('useProjects: Projects set in state');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      console.error('useProjects: Error fetching projects:', errorMessage, err);
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useProjects: Component mounted or getProjects changed');
    getProjects();
  }, [getProjects]);

  const refetch = useCallback(async () => {
    console.log('useProjects: Refetching projects...');
    try {
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('useProjects: Error refetching projects:', err);
      throw err;
    }
  }, []);

  console.log('useProjects: Returning state:', { projects, loading, error });
  return {
    projects,
    loading,
    error,
    refetch,
  };
}
