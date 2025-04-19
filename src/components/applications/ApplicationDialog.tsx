
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ApplicationForm from './ApplicationForm';

interface ApplicationDialogProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDialog = ({ jobId, isOpen, onClose }: ApplicationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit Application</DialogTitle>
        </DialogHeader>
        <ApplicationForm
          jobId={jobId}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
