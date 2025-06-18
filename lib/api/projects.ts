import { api, getAuthToken } from './api';

export interface ProjectUser {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  [key: string]: any; // Allow additional properties
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  team_members?: string[];
  technologies: string[];
  image?: string | null;
  image_url?: string | null; // For backward compatibility
  code_url?: string | null;
  live_url?: string | null;
  completion_date?: string | null;
  category?: string | null;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  is_approved: boolean;
  created_by?: ProjectUser | null;
  is_featured?: boolean;
  [key: string]: any; // Allow additional properties
}

export interface CreateProjectData {
  title: string;
  description: string;
  long_description?: string;
  team_members?: string[];
  technologies: string[];
  image?: File | null;
  code_url?: string | null;
  live_url?: string | null;
  completion_date?: string | null;
  category?: string | null;
  features?: string[];
  is_featured?: boolean;
}

/**
 * Fetches projects from the API with proper type safety and error handling
 */
export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getProjects(requireAuth = false): Promise<Project[]> {
  const endpoint = '/projects/';
  
  try {
    console.log('🔍 Fetching projects from:', endpoint);
    // Add skipAuth option to bypass authentication for public access
    const options = requireAuth ? {} : { headers: { 'skip-auth': 'true' } };
    const response = await api.get<Project[] | PaginatedResponse<Project>>(endpoint, options);
    
    // Log the raw response for debugging
    console.log('📦 Raw API response:', response);
    
    // Handle both array and paginated response formats
    let projects: Project[] = [];
    
    if (Array.isArray(response)) {
      // Direct array response
      projects = response;
    } else if (response && typeof response === 'object' && 'results' in response) {
      // Paginated response with results array
      projects = response.results || [];
      console.log(`📊 Received paginated response with ${projects.length} projects out of ${response.count}`);
    } else {
      // Unexpected response format
      const errorMessage = `Expected array or paginated response but got ${typeof response}`;
      console.error('❌ Unexpected response format:', errorMessage, response);
      throw new Error(`Server returned unexpected format: ${errorMessage}`);
    }
    
    // Process each project to ensure it matches our interface
    const processedProjects = projects.map(project => {
      try {
        // Ensure required fields have default values
        const processedProject: Project = {
          id: String(project.id || ''),
          title: project.title || 'Untitled Project',
          description: project.description || '',
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          features: Array.isArray(project.features) ? project.features : [],
          team_members: Array.isArray(project.team_members) ? project.team_members : [],
          is_approved: Boolean(project.is_approved),
          // Optional fields with null checks
          ...(project.image_url && { image_url: project.image_url }),
          ...(project.code_url && { code_url: project.code_url }),
          ...(project.live_url && { live_url: project.live_url }),
          ...(project.completion_date && { completion_date: project.completion_date }),
          ...(project.category && { category: project.category }),
          ...(project.is_featured !== undefined && { is_featured: project.is_featured }),
          // Handle created_by safely
          created_by: project.created_by ? {
            id: String(project.created_by.id || ''),
            username: project.created_by.username || '',
            ...(project.created_by.first_name && { first_name: project.created_by.first_name }),
            ...(project.created_by.last_name && { last_name: project.created_by.last_name }),
            ...(project.created_by.email && { email: project.created_by.email })
          } : null
        };
        
        return processedProject;
      } catch (processError) {
        console.error('⚠️ Error processing project:', processError, project);
        // Return a minimal valid project object to prevent breaking the UI
        return {
          id: String(project.id || 'error'),
          title: 'Error loading project',
          description: 'There was an error loading this project.',
          technologies: [],
          features: [],
          team_members: [],
          is_approved: false,
          created_by: null
        };
      }
    });
    
    console.log(`✅ Successfully processed ${processedProjects.length} projects`);
    return processedProjects;
    
  } catch (error) {
    console.error('❌ Error in getProjects:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // Just show first few lines of stack
      });
    }
    
    // Re-throw with more context
    throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createProject(projectData: CreateProjectData): Promise<Project> {
  try {
    console.log('Creating project with data:', projectData);
    const formData = new FormData();
    
    // Add all project data to formData
    Object.entries(projectData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        // Handle file upload - don't append if no file was selected
        formData.append('image', value);
        console.log('Added image file to form data');
      } else if (Array.isArray(value)) {
        // Handle arrays by joining with commas
        formData.append(key, value.join(','));
      } else if (value !== null && value !== undefined) {
        // Handle other values
        formData.append(key, String(value));
      }
    });
    
    // Get the auth token manually to ensure it's included
    const token = await getAuthToken();
    console.log('Auth token exists:', !!token);
    
    if (!token) {
      throw new Error('No authentication token found. Please sign in again.');
    }
    
    // Create headers object
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    // Don't set Content-Type when using FormData, let the browser set it with the correct boundary
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Use the deployed backend URL
    const baseUrl = 'https://yearbook.ethioace.com';
    const apiUrl = `${baseUrl}/api/projects/`;
    console.log('Sending request to:', apiUrl);
    
    // Use fetch directly to have more control over the request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('API error response:', errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorData = { message: 'Failed to parse error response' };
      }
      
      // Log response headers for debugging
      console.log('Response headers:');
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
      
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
    
    const data = await response.json();
    console.log('Project created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Using the exported PaginatedResponse interface from above

export async function getPendingProjects(): Promise<Project[]> {
  const endpoint = '/api/projects/pending/';
  try {
    console.log('🔍 Fetching pending projects from:', endpoint);
    const response = await api.get<Project[] | PaginatedResponse<Project>>(endpoint);
    console.log('📦 Pending projects response:', response);
    
    // Handle both array and paginated response formats
    let projects: Project[] = [];
    
    if (Array.isArray(response)) {
      // Direct array response
      projects = response;
    } else if (response && typeof response === 'object' && 'results' in response) {
      // Paginated response with results array
      projects = response.results || [];
      console.log(`📊 Received paginated pending projects: ${projects.length} out of ${response.count}`);
    } else {
      // Unexpected response format
      const errorMessage = `Expected array or paginated response but got ${typeof response}`;
      console.error('❌ Unexpected pending projects response format:', errorMessage, response);
      throw new Error(`Server returned unexpected format: ${errorMessage}`);
    }
    
    // Process projects to ensure they match our interface
    const processedProjects = projects.map(project => {
      try {
        return {
          id: String(project.id || ''),
          title: project.title || 'Untitled Project',
          description: project.description || '',
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          features: Array.isArray(project.features) ? project.features : [],
          team_members: Array.isArray(project.team_members) ? project.team_members : [],
          is_approved: Boolean(project.is_approved),
          ...(project.image_url && { image_url: project.image_url }),
          ...(project.code_url && { code_url: project.code_url }),
          ...(project.live_url && { live_url: project.live_url }),
          ...(project.completion_date && { completion_date: project.completion_date }),
          ...(project.category && { category: project.category }),
          ...(project.is_featured !== undefined && { is_featured: project.is_featured }),
          created_by: project.created_by ? {
            id: String(project.created_by.id || ''),
            username: project.created_by.username || '',
            ...(project.created_by.first_name && { first_name: project.created_by.first_name }),
            ...(project.created_by.last_name && { last_name: project.created_by.last_name }),
            ...(project.created_by.email && { email: project.created_by.email })
          } : null
        };
      } catch (error) {
        console.error('⚠️ Error processing project:', error, project);
        // Return a minimal valid project object to prevent breaking the UI
        return {
          id: String(project.id || 'error'),
          title: 'Error loading project',
          description: 'There was an error loading this project.',
          technologies: [],
          features: [],
          team_members: [],
          is_approved: false,
          created_by: null
        };
      }
    });
    
    console.log(`✅ Successfully processed ${processedProjects.length} pending projects`);
    return processedProjects;
  } catch (error) {
    console.error('❌ Error in getPendingProjects:', error);
    throw new Error(`Failed to fetch pending projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export interface ProjectActionResponse {
  success: boolean;
  message?: string;
  project?: Project;
}

export async function approveProject(projectId: string): Promise<ProjectActionResponse> {
  const endpoint = `/api/projects/${projectId}/approve/`;
  try {
    console.log(`🔄 Approving project ${projectId}...`);
    const response = await api.post<ProjectActionResponse>(endpoint, {});
    console.log(`✅ Project ${projectId} approved successfully`);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error approving project ${projectId}:`, errorMessage);
    return {
      success: false,
      message: `Failed to approve project: ${errorMessage}`
    };
  }
}

export async function rejectProject(projectId: string): Promise<ProjectActionResponse> {
  const endpoint = `/api/projects/${projectId}/reject/`;
  try {
    console.log(`🔄 Rejecting project ${projectId}...`);
    const response = await api.post<ProjectActionResponse>(endpoint, {});
    console.log(`✅ Project ${projectId} rejected successfully`);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error rejecting project ${projectId}:`, errorMessage);
    return {
      success: false,
      message: `Failed to reject project: ${errorMessage}`
    };
  }
}
