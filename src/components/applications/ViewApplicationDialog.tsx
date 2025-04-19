
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Application } from '@/redux/slices/applicationsSlice';

interface ViewApplicationDialogProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewApplicationDialog = ({ application, isOpen, onClose }: ViewApplicationDialogProps) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Position</h3>
            <p className="mt-1">{application.jobTitle}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Company</h3>
            <p className="mt-1">{application.company}</p>
          </div>
          {application.coverLetter && (
            <div>
              <h3 className="font-medium text-gray-900">Cover Letter</h3>
              <p className="mt-1 whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">Status</h3>
            <p className="mt-1 capitalize">{application.status}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
