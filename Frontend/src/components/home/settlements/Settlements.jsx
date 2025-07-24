import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Trash } from 'lucide-react';
import { format } from 'date-fns';
import useQuery from '@/hooks/useQuery';

export default function Settlements() {

  const { data } = useQuery(`api/expenses/settlement/${2}`);

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Settlements</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.data?.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp?.paidBy?.firstName} {exp?.paidBy?.lastName}</TableCell>
                <TableCell>{exp.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(exp.date), 'dd MMM yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
