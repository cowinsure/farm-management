"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";

interface BreedingStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: any;
}

export function BreedingStatusUpdateDialog({
  open,
  onOpenChange,
  record
}: BreedingStatusUpdateDialogProps) {
  const [status, setStatus] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('');
  const [expectedCalvingDate, setExpectedCalvingDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const updatedRecord = {
      ...record,
      pregnancyStatus: status,
      confirmationDate,
      confirmationMethod,
      expectedCalvingDate,
      veterinarian,
      notes,
      updatedAt: new Date().toISOString()
    };

    // Get existing records
    const records = JSON.parse(localStorage.getItem('breedingLogs') || '[]');
    
    // Update the specific record
    const updatedRecords = records.map((r: any) => 
      r.cowId === record.cowId && r.breedingDate === record.breedingDate ? updatedRecord : r
    );

    // Save back to localStorage
    localStorage.setItem('breedingLogs', JSON.stringify(updatedRecords));

    // Trigger update event
    window.dispatchEvent(new Event('breedingLogUpdated'));

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Breeding Status</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {record?.cowId}
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Breeding Outcome</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pregnancy Confirmed">Pregnancy Confirmed</SelectItem>
                <SelectItem value="Breeding Failed">Breeding Failed</SelectItem>
                <SelectItem value="Birth Completed">Birth Completed</SelectItem>
                <SelectItem value="Under Monitoring">Under Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'Pregnancy Confirmed' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Confirmation Date *</label>
                  <Input
                    type="date"
                    value={confirmationDate}
                    onChange={e => setConfirmationDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmation Method</label>
                  <Select value={confirmationMethod} onValueChange={setConfirmationMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ultrasound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="Blood Test">Blood Test</SelectItem>
                      <SelectItem value="Visual">Visual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Calving Date</label>
                  <Input
                    type="date"
                    value={expectedCalvingDate}
                    onChange={e => setExpectedCalvingDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Veterinarian</label>
                  <Input
                    type="text"
                    value={veterinarian}
                    onChange={e => setVeterinarian(e.target.value)}
                    placeholder="Dr. Smith"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional observations..."
                />
              </div>
            </>
          )}

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}