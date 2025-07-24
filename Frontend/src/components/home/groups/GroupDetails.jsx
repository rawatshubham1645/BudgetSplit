import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, DollarSign, Repeat, FileText } from 'lucide-react';
import AddExpenseModal from '../expenses/AddExpenseModal';
import Invite from './Invite';
import useQuery from '@/hooks/useQuery';
import SettleAll from './SettleAll';
import BACKEND_URL from '@/imports/baseUrl';
import { getToken } from '@/imports/localStorage';

// Mock fetch
// const fetchGroupDetail = async (id) => ({
//   name: 'Weekend Trip',
//   inviteCode: 'ABCD1234',
//   members: [
//     { id:1, name:'Alice', avatar:'/avatars/alice.png', balance:200 },
//     { id:2, name:'Bob', avatar:'/avatars/bob.png', balance:-150 },
//     { id:3, name:'Charlie', avatar:'/avatars/charlie.png', balance:-50 }
//   ],
//   expenses: [
//     { id:1, description:'Dinner', payer:'Alice', amount:600, date:'2025-05-01' },
//     { id:2, description:'Gas', payer:'Bob', amount:300, date:'2025-05-02' }
//   ],
//   settlements: [
//     { from:'Bob', to:'Alice', amount:150 },
//     { from:'Charlie', to:'Alice', amount:50 }
//   ]
// });

const COLORS = ['#4F46E5','#EF4444','#10B981'];

export default function GroupDetail() {
  const token = getToken();
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isSettleAllModalOpen, setSettleAllModalOpen] = useState(false);


  const { state } = useLocation();
console.log(state, "s11111111111");

const { data: groups } = useQuery("api/groups/my");

const {data: expenses, refetch} = useQuery(`api/expenses/group/${state?.id}`)

const {data: settlements, refetch: refetchExpenses} = useQuery(`api/expenses/settlement/${state?.id}`)

const allRefetch = () => {
  refetch();
  refetchExpenses()
}

const handleDownload = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}api/dashboard/group/export-settlements?groupId=${state.id}`, {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
    {state?.groupName || ""}
  </h1>

  <div className="flex flex-wrap items-center gap-2">
    <span className="inline-flex items-center px-2 py-1 text-sm bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 rounded">
      Invite Code: {state?.inviteCode || ""}
    </span>
    <Button onClick={() => handleDownload()}>Export Settlement History</Button>
    <Button onClick={() => setSettleAllModalOpen(true)}>Settle All</Button>
    <Button onClick={() => setExpenseModalOpen(true)}>Add Expense</Button>
    <Button onClick={() => setInviteModalOpen(true)}>Invite</Button>
  </div>
</div>

      {/* Summary */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Members count */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-indigo-600" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Members</span>
          </div>
          <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{state?.usersList?.length || 0}</div>
        </div>

        {/* Net balances pie */}
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <span className="text-gray-700 dark:text-gray-300">Balance Distribution</span>
          <div className="mt-4 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Settlement recommendations */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow col-span-1 md:col-span-2">
          <div className="flex items-center mb-2">
            <Repeat className="w-6 h-6 text-green-500" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Settlements</span>
          </div>
          {
            settlements?.data?.data?.length > 0 ? <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
            {settlements?.data?.data?.map((s,i) => (
              <li key={i}><span className="ml-2 text-red-600 dark:text-red-300 font-medium">{s?.fromUser?.firstName} {s?.fromUser?.lastName}</span> owes <span className="ml-1 text-green-600 dark:text-green-300 font-medium">{s?.toUser?.firstName} {s?.toUser?.lastName}</span>: <span className='font-medium'>{s.amount}</span> ({state?.baseCurrency})</li>
            ))}
          </ul> : <div className='h-14 flex justify-center items-center'>There are no pending settlements in this group</div>
          }
          
        </div>
      </motion.div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            <h2 className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">Expenses</h2>
          </div>
        </div>
        {expenses?.data?.data?.length > 0 ?
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses?.data?.data?.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e?.paidBy?.firstName} {e?.paidBy?.lastName}</TableCell>
                <TableCell>{e.amount} ({e.currency})</TableCell>
                <TableCell>{e.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : <div className='h-60 flex justify-center items-center'>No Data Found </div>
        }

      </div>

      {/* AddExpenseModal (imported) */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onAdd={(expense) => console.log(expense)}
        showGroupSelect={true}
        groupOptions={groups?.data?.data || []}
        initGroupId={state?.id || ""}
        refetch={allRefetch}
    />

    <Invite
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onAdd={(expense) => console.log(expense)}
        groupData={state}
    />

    <SettleAll
        isOpen={isSettleAllModalOpen}
        onClose={() => setSettleAllModalOpen(false)}
        groupData={state}
        refetch={refetch}
        refetchExpenses={refetchExpenses}
    />
    </div>
  );
}