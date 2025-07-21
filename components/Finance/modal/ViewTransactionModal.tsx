
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar, FileText, Tag } from 'lucide-react';

interface ViewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    type: string;
    category: string;
    amount: number;
    date: string;
    description: string;
  } | null;
}

const ViewTransactionModal = ({ open, onOpenChange, transaction }: ViewTransactionModalProps) => {
  if (!transaction) return null;

  const getTypeColor = (type: string) => {
    return type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getAmountColor = (type: string) => {
    return type === 'Income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className={`w-10 h-10 ${transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              <div className={`text-center ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`} >
              ৳
              </div>
            </div>
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Amount and Type */}
          <Card className={`border-l-4 ${transaction.type === 'Income' ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold">{transaction.id}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getAmountColor(transaction.type)}`}>
                    {transaction.type === 'Income' ? '+' : '-'}৳{transaction.amount}
                  </p>
                  <Badge className={getTypeColor(transaction.type)}>
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{transaction.category}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{transaction.date}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold">{transaction.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionModal;
