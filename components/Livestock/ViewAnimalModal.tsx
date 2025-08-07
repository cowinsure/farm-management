
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Weight, Heart, User } from 'lucide-react';

interface ViewAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: string;
    weight: string;
    status: string;
    location: string;
  } | null;
}

const ViewAnimalModal = ({ open, onOpenChange, animal }: ViewAnimalModalProps) => {
  if (!animal) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Sick': return 'bg-red-100 text-red-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">🐄</span>
            </div>
            {animal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and ID Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Animal ID</p>
                  <p className="text-lg font-semibold">{animal.id}</p>
                </div>
                <Badge className={getStatusColor(animal.status)}>
                  {animal.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Breed</p>
                  <p className="font-semibold">{animal.breed}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold">{animal.gender}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{animal.age}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Weight className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold">{animal.weight}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Location</p>
                <p className="font-semibold">{animal.location}</p>
              </div>
            </CardContent>
          </Card> */}

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-xs text-gray-600">Health Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">1.2yr</p>
                <p className="text-xs text-gray-600">On Farm</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">8.5L</p>
                <p className="text-xs text-gray-600">Daily Avg</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAnimalModal;
