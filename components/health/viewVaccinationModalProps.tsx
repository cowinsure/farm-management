
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Syringe, MapPin, FileText } from 'lucide-react';

interface ViewVaccinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: {
    id: string;
    animalId: string;
    animalName: string;
    vaccine: string;
    dueDate: string;
    status: string;
    notes?: string;
  } | null;
}

const ViewVaccinationModal = ({ open, onOpenChange, schedule }: ViewVaccinationModalProps) => {
  if (!schedule) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Due': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Syringe className="w-5 h-5 text-blue-600" />
            </div>
            Vaccination Schedule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Schedule ID</p>
                  <p className="font-semibold">{schedule.id}</p>
                </div>
                <Badge className={getStatusColor(schedule.status)}>
                  {schedule.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">🐄</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Animal</p>
                  <p className="font-semibold">{schedule.animalName} ({schedule.animalId})</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Syringe className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vaccine</p>
                  <p className="font-semibold">{schedule.vaccine}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold">{schedule.dueDate}</p>
                </div>
              </CardContent>
            </Card>

            {schedule.notes && (
              <Card>
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-semibold">{schedule.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVaccinationModal;
