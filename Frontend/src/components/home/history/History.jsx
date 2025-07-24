import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown } from 'lucide-react';
import { format, } from 'date-fns';
import useQuery from '@/hooks/useQuery';
import BACKEND_URL from '@/imports/baseUrl';
import { getToken } from '@/imports/localStorage';

export default function Expenses() {

  const token = getToken();

  const { data: groups } = useQuery("api/groups/my");
  console.log(groups)

  const { data } = useQuery("api/expenses/my/settlement/history");

  const handleDownload = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}api/dashboard/my/export-settlements`, {
      method: 'GET',
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    // Optional: use a custom filename
    a.download = 'export-settlements.xlsx'; // or .csv, .pdf depending on content
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
  }
};


  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Expenses</h1>
        <Button onClick={() => handleDownload()} className="flex items-center gap-2">
          <FileDown className="w-4 h-4" /> Export
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        {
          data?.data?.data?.length > 0 ? <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From User</TableHead>
              <TableHead>To User</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Settled At</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.data?.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.fromUser}</TableCell>
                <TableCell>{exp?.toUser}</TableCell>
                <TableCell>{exp.groupName}</TableCell>
                <TableCell>{exp.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    {format(new Date(exp.settledAt), 'dd-MM-yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  {exp.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : <div className='h-60 flex justify-center items-center'>No Data Found </div>
        }
        
      </div>
    </div>
  );
}
