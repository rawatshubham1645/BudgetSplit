import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import { format } from 'date-fns';
import useQuery from '@/hooks/useQuery';

export default function Expenses() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: groups } = useQuery("api/groups/my");

  const { data, refetch } = useQuery("api/expenses/my");

  const handleAdd = (newExpense) => {
    setExpenses(prev => [...prev, { ...newExpense, id: Date.now() }]);
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Expenses</h1>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        {
          data?.data?.data?.length > 0 ? <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.data?.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.expenseName}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp?.paidBy?.firstName} {exp?.paidBy?.lastName}</TableCell>
                <TableCell>{exp.amount} ({exp.currency})</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(exp.date), 'dd MMM yyyy')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : <div className='h-60 flex justify-center items-center'>No Data Found </div>
        }
        
      </div>

      <AddExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        showGroupSelect={true}
        groupOptions={groups?.data?.data || []}
        refetch={refetch}
      />
    </div>
  );
}
