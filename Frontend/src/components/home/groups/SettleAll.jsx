import React, { useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, } from 'lucide-react';
import { motion } from 'framer-motion';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useMutation from '@/hooks/useMutation';

export default function SettleAll({ isOpen, onClose, refetch, refetchExpenses, groupData }) {
  const { mutate, loading } = useMutation();

  const onSubmit = async () => {
    const response = await mutate({ url: `api/expenses/group/settlement?groupId=${groupData?.id}`, method: 'POST', data: {} });
        if (response.success) {
          onClose();
          refetch();
          refetchExpenses()
        }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Settle All From ${groupData?.groupName}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='my-5'>
            Do you want to settle all in {groupData?.groupName}?. Once settled it can't be reverted.
          </div>
          <Button onClick={() => onSubmit()} loading={loading} className="w-full py-3 font-semibold rounded-lg">
            Settle All
          </Button>
      </motion.div>
    </Modal>
  );
}
