'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectSubmissionForm } from './project-submission-form';

interface ProjectSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProjectSubmissionModal({ open, onOpenChange, onSuccess }: ProjectSubmissionModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Submit Your Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Submit a New Project</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share your project with the community. All submissions will be reviewed before being published.
          </p>
        </DialogHeader>
        <div className="py-4">
          <ProjectSubmissionForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
