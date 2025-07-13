
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { log } from 'console';

interface FinancialModalProps {
  type: 'income' | 'expense';
}

const FinancialModal = ({ type }: FinancialModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const { toast } = useToast();
  const [ledgerOptions, setLedgerOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingLedgers, setLoadingLedgers] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch ledger options when modal opens
  useEffect(() => {
    if (!open) return;
    setLoadingLedgers(true);
    setLedgerError(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const start_record = 1;
    const page_size = 10;
    const ledgerType = type === 'income' ? "I" : "E";
    console.log(`Fetching ledgers for type: ${ledgerType}`);
    
    const url = `http://127.0.0.1:8000/api/gls/ledger-service/?start_record=${start_record}&page_size=${page_size}&type=${ledgerType}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        
        if (data.status === 'success' && Array.isArray(data.data)) {
                 console.log(data.data)
          setLedgerOptions(
            data.data.map((ledger: any) => ({
       
              
              label: ledger.name_ledger,
              value: String(ledger.ledger_id),
            }))
          );
        } else {
          setLedgerOptions([]);
          setLedgerError('No ledgers found');
        }
      })
      .catch((error) => {
        console.error('Error fetching ledgers:', error);
        setLedgerOptions([]);
        setLedgerError('Failed to load ledgers');
      })
      .finally(() => setLoadingLedgers(false));
  }, [open, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ledger_id: Number(formData.category),
      amount: Number(formData.amount),
      txn_date: formData.date,
      description: formData.description,
      organization_id: 1,
      branch_id: 1,
      created_by: 99,
    };
    console.log('Submitting financial record:', payload);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const res = await fetch('http://127.0.0.1:8000/api/gls/income-expense-service/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast({
          title: 'Success',
          description: data.message || 'Voucher saved successfully',
        });
        setFormData({
          category: '',
          amount: '',
          date: '',
          description: ''
        });
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save voucher',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save voucher',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
          {type === 'income' ? <Plus className="w-4 h-4 mr-2" /> : <Receipt className="w-4 h-4 mr-2" />}
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record {type === 'income' ? 'Income' : 'Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder={loadingLedgers ? 'Loading...' : 'Select category'} />
              </SelectTrigger>
              <SelectContent>
                {loadingLedgers ? (
                  <div className="px-4 py-2 text-gray-500">Loading...</div>
                ) : ledgerError ? (
                  <div className="px-4 py-2 text-red-500">{ledgerError}</div>
                ) : ledgerOptions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No categories found</div>
                ) : (
                  ledgerOptions.map((ledger) => (
                    <SelectItem key={ledger.value} value={ledger.value}>{ledger.label}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className={type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled={submitting}>
              {submitting ? 'Saving...' : 'Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialModal;
