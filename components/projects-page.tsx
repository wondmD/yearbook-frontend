"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { useState, useEffect, useMemo } from 'react'
import { Project } from '@/lib/api/projects'
import { ProjectSubmissionModal } from './project-submission-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Clock, Calendar, ExternalLink, Github, Users, Search, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProjectsPageProps {
  onAddProject: () => Promise<void>;
  projects: Project[];
  error?: string;
}

interface ProjectCardProps {
  project: Project;
  isPending: boolean;
  isOwner: boolean;
}

function ProjectCard({ project, isPending, isOwner }: ProjectCardProps) {
  // Ensure all arrays are defined and have the correct type
  const teamMembers = project.team_members || [];
  const technologies = project.technologies || [];
  const features = project.features || [];
  const isProjectPending = !project.is_approved;

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card overflow-hidden border-2 ${
        isProjectPending ? 'border-amber-200' : 'border-transparent hover:border-border'
      }`}
    >
      {isProjectPending && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 text-sm font-medium px-4 py-2 border-b border-amber-200 flex items-center">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="font-semibold">Pending Approval</span>
          {isOwner ? (
            <Badge variant="outline" className="ml-auto bg-white/80 text-amber-700 border-amber-300 shadow-sm">
              Your Submission
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto bg-white/80 text-amber-700 border-amber-300 text-xs">
              Under Review
            </Badge>
          )}
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image || project.image_url || "/placeholder.svg"}
          alt={project.title || 'Project image'}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            isProjectPending ? 'opacity-80' : ''
          }`}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
            {project.category || 'Project'}
          </Badge>
          {isOwner && !isProjectPending && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              Your Project
            </Badge>
          )}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.title || 'Untitled Project'}
        </CardTitle>
        <p className="text-gray-600 line-clamp-2">
          {project.description || 'No description provided.'}
        </p>
      </CardHeader>
      <CardContent>
        {teamMembers.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team Members:
            </h4>
            <div className="flex flex-wrap gap-1">
              {teamMembers.map((member, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {member}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-1">
              {technologies.map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-blue-100 text-blue-700"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {features.map((feature, index) => (
                <li key={index} className="truncate">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.completion_date && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.completion_date).toLocaleDateString()}
          </div>
        )}

        <div className="flex space-x-3 mt-6">
          {project.code_url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a 
                href={project.code_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Github className="h-4 w-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {project.live_url && (
            <Button size="sm" className="flex-1" asChild>
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectsPage({ 
  onAddProject, 
  projects: initialProjects = [],
  error: propError 
}: ProjectsPageProps) {
  const { data: session, status } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isClient, setIsClient] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  
  // Use propError if available, otherwise use localError
  const error = propError || localError
  const router = useRouter()
  const isLoading = status === 'loading'
  
  // Track if we're on the client to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
    
    // Debug: Log projects and session info
    console.log('Initial projects:', initialProjects);
    console.log('Session:', session);
    
    // Log each project's visibility info
    initialProjects.forEach(project => {
      if (project) {
        const userId = session?.user?.id;
        const projectCreatorId = project.created_by?.id;
        // Convert both IDs to strings for comparison to handle number/string mismatches
        const isOwner = userId && projectCreatorId && String(userId) === String(projectCreatorId);
        
        console.log('Project visibility check:', {
          id: project.id,
          title: project.title,
          is_approved: project.is_approved,
          userId,
          projectCreatorId,
          isOwner,
          shouldBeVisible: project.is_approved || isOwner
        });
      }
    });
  }, [initialProjects, session])

  // Get unique categories from projects
  const categories = useMemo(() => {
    try {
      if (!Array.isArray(initialProjects)) {
        console.warn('initialProjects is not an array');
        return ['all'];
      }
      
      const validProjects = initialProjects.filter((p): p is Project => 
        p && typeof p === 'object' && 'category' in p
      );
      
      const cats = new Set(
        validProjects
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat))
      );
      
      return ['all', ...Array.from(cats)].sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['all'];
    }
  }, [initialProjects]);

  // Filter projects based on search term, category, and approval status
  const filteredProjects = useMemo(() => {
    try {
      if (!Array.isArray(initialProjects)) {
        console.warn('Projects is not an array:', initialProjects);
        return [];
      }
      
      console.log('Filtering projects:', { 
        total: initialProjects.length, 
        searchTerm, 
        categoryFilter,
        sessionId: session?.user?.id 
      });
      
      const result = initialProjects.filter((project): project is Project => {
        try {
          // Ensure project has required fields
          if (!project || typeof project !== 'object' || !('id' in project) || !('title' in project)) {
            console.warn('Invalid project structure:', project);
            return false;
          }
          
          // Type guard to ensure project has required properties
          const validProject = project as Project;
          const userId = session?.user?.id;
          const projectCreatorId = validProject.created_by?.id;
          
          // Check if the project is approved
          const isApproved = Boolean(validProject.is_approved);
          // Check if the current user is the creator of the project (handle both string and number IDs)
          const isOwner = userId && projectCreatorId && String(userId) === String(projectCreatorId);
          
          // Show all approved projects to everyone
          // Show unapproved projects only to their creators
          const isVisible = isApproved || isOwner;
          
          if (!isVisible) {
            console.log('Project not visible:', validProject.id, { 
              isApproved, 
              isOwner,
              userId,
              projectCreatorId,
              project: {
                id: validProject.id,
                title: validProject.title,
                is_approved: validProject.is_approved,
                created_by: validProject.created_by
              }
            });
            return false;
          }
          
          // Handle search
          const searchLower = searchTerm.trim().toLowerCase();
          const hasSearchTerm = searchLower.length > 0;
          
          const matchesSearch = !hasSearchTerm || [
            validProject.title?.toLowerCase(),
            validProject.description?.toLowerCase(),
            ...(Array.isArray(validProject.technologies) 
              ? validProject.technologies.map(t => t?.toLowerCase())
              : [])
          ].some(field => field?.includes(searchLower));
          
          // Handle category filter
          const matchesCategory = 
            categoryFilter === 'all' || 
            validProject.category === categoryFilter;
          
          const isIncluded = matchesSearch && matchesCategory;
          
          if (isIncluded) {
            console.log('Including project:', { 
              id: validProject.id, 
              title: validProject.title,
              isApproved,
              isOwner,
              matchesSearch, 
              matchesCategory 
            });
          }
          
          return isIncluded;
        } catch (error) {
          console.error('Error filtering project:', error, project);
          return false;
        }
      });
      
      console.log(`Filtered ${result.length} of ${initialProjects.length} projects`);
      return result;
    } catch (error) {
      console.error('Error in project filtering:', error);
      setLocalError('Error filtering projects. Please try again.');
      return [];
    }
  }, [initialProjects, searchTerm, categoryFilter, session?.user?.id]);

  const handleAddProjectClick = async () => {
    if (!session) {
      await signIn('keycloak', { callbackUrl: '/projects' });
      return;
    }
    setIsModalOpen(true);
  };

  const handleProjectCreated = () => {
    setIsModalOpen(false);
    toast({
      title: 'Project submitted!',
      description: 'Your project has been submitted for review.',
    });
    if (onAddProject) {
      onAddProject();
    }
  };

  // Show loading state only on initial load
  if (status === 'loading' && !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if there was an error and no projects to display
  if (error && (!Array.isArray(initialProjects) || initialProjects.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="default"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6 md:p-10 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">🎨 Project Showcase</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover amazing projects built by our talented community members. From web apps to machine
            learning models, there's something for everyone!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleAddProjectClick}
              className="px-6 py-6 text-base font-medium h-auto"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              {session ? 'Add Your Project' : 'Sign In to Submit'}
            </Button>
            
            {!session && (
              <Button 
                variant="outline" 
                className="px-6 py-6 text-base h-auto"
                size="lg"
                onClick={() => signIn('keycloak', { callbackUrl: '/projects' })}
              >
                <Users className="mr-2 h-5 w-5" />
                Join Our Community
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by title, description, or tech..."
                className="w-full pl-10 pr-4 py-6 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[250px] h-auto py-6 text-base">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(cat => cat !== 'all').map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              isPending={!project.is_approved}
              isOwner={session?.user?.id === project.created_by?.id}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 px-4">
            <div className="text-muted-foreground text-lg mb-6">
              {searchTerm || categoryFilter !== 'all' ? (
                <>
                  <p className="text-2xl font-medium text-foreground mb-2">No projects found</p>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-medium text-foreground mb-2">No projects yet</p>
                  <p>Be the first to share your project with the community!</p>
                </>
              )}
            </div>
            {(searchTerm || categoryFilter !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Project Submission Modal */}
      <ProjectSubmissionModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}


