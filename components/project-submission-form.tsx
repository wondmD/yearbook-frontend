'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Project } from '@/lib/api/projects';
import { createProject } from '@/lib/api/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ProjectSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectSubmissionForm({ onSuccess, onCancel }: ProjectSubmissionFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    code_url: '',
    live_url: '',
    technologies: [] as string[],
    features: [] as string[],
    team_members: [] as string[],
    completion_date: '',
    category: 'Other',
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInput = (input: string, setInput: (value: string) => void, field: keyof typeof formData) => {
    const values = input
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a project',
        variant: 'destructive',
      });
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || formData.technologies.length === 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields (title, description, and at least one technology)',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create form data for the API request
      const projectData = {
        ...formData,
        image: imageFile,
      };
      
      // The API utility will handle the file upload
      await createProject(projectData);
      
      toast({
        title: 'Project submitted!',
        description: 'Your project has been submitted for review. It will be visible to others once approved by an admin.',
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter project title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="Game Development">Game Development</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code_url">Repository URL</Label>
          <Input
            id="code_url"
            name="code_url"
            type="url"
            value={formData.code_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="live_url">Live Demo URL</Label>
          <Input
            id="live_url"
            name="live_url"
            type="url"
            value={formData.live_url}
            onChange={handleChange}
            placeholder="https://your-project.vercel.app"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Project Image</Label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="image-upload"
              className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Choose File
              <input
                id="image-upload"
                name="image"
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            <span className="ml-2 text-sm text-gray-500">
              {imageFile ? imageFile.name : 'No file chosen'}
            </span>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Image preview
              </p>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Upload a high-quality image that represents your project (JPG, PNG, or GIF).
            Max file size: 5MB.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion_date">Completion Date</Label>
          <Input
            id="completion_date"
            name="completion_date"
            type="text"
            value={formData.completion_date}
            onChange={handleChange}
            placeholder="e.g., May 2025"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="A brief description of your project (max 200 characters)"
          maxLength={200}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="long_description">Detailed Description</Label>
        <Textarea
          id="long_description"
          name="long_description"
          value={formData.long_description}
          onChange={handleChange}
          placeholder="Provide more details about your project, including the problem it solves, how it works, etc."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies">Technologies Used (comma-separated)</Label>
        <Input
          id="technologies"
          value={technologiesInput}
          onChange={(e) => {
            setTechnologiesInput(e.target.value);
            handleArrayInput(e.target.value, setTechnologiesInput, 'technologies');
          }}
          placeholder="e.g., React, Node.js, Python, MongoDB"
        />
        <p className="text-sm text-muted-foreground">
          {formData.technologies.length} technologies added
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Key Features (comma-separated)</Label>
        <Input
          id="features"
          value={featuresInput}
          onChange={(e) => {
            setFeaturesInput(e.target.value);
            handleArrayInput(e.target.value, setFeaturesInput, 'features');
          }}
          placeholder="e.g., User authentication, Real-time updates, Responsive design"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team_members">Team Members (comma-separated)</Label>
        <Input
          id="team_members"
          value={teamMembersInput}
          onChange={(e) => {
            setTeamMembersInput(e.target.value);
            handleArrayInput(e.target.value, setTeamMembersInput, 'team_members');
          }}
          placeholder="e.g., John Doe, Jane Smith"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Project'}
        </Button>
      </div>
    </form>
  );
}
