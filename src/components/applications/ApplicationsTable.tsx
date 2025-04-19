
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download, CheckCircle, XCircle } from 'lucide-react';
import { Application } from '@/redux/slices/applicationsSlice';
import { useAppSelector } from '@/redux/hooks';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationsTableProps {
  applications: Application[];
  onViewApplication?: (application: Application) => void;
  onUpdateStatus?: (applicationId: string, status: Application['status']) => void;
}

const ApplicationsTable = ({ applications, onViewApplication, onUpdateStatus }: ApplicationsTableProps) => {
  const { user } = useAppSelector(state => state.auth);
  const isEmployer = user?.role === 'employer';

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'reviewed':
        return 'text-blue-500';
      case 'interview':
        return 'text-purple-500';
      case 'hired':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.jobTitle}</TableCell>
              <TableCell>{application.company}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 ${getStatusColor(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApplication?.(application)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = application.resume;
                      link.download = `resume-${application.id}.pdf`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {isEmployer && onUpdateStatus && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500 hover:text-green-600"
                        onClick={() => onUpdateStatus(application.id, 'hired')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => onUpdateStatus(application.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
