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

export default function JoinGroup({ isOpen, onClose, refetch, }) {
  const { mutate, loading } = useMutation();
  const inviteSchema = yup.object().shape({
    inviteCode: yup
      .string()
      .min(8, "Name must be at least 2 characters")
      .max(8, "Name must be less than 50 characters")
      .required("Name is required")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(inviteSchema),
    defaultValues: { inviteCode: '' }
  });

  useEffect(() => {
    document.querySelector('[data-group-name-input]')?.focus();
  }, [isOpen]);

  const onSubmit = async (data) => {
    console.log(data)
    const response = await mutate({ url: `api/groups/join`, method: 'POST', data });
        if (response.success) {
          onClose();
          refetch();
        }
  };

  const inputClasses = `col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Name */}
          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="inviteCode"
                type="text"
                {...register('inviteCode', { required: 'Email is required' })}
                data-group-name-input
                className={`${inputClasses} ${errors.inviteCode ? 'border-red-500' : ''}`}
                placeholder="e.g. hemant@example.com"
                />
                {errors.inviteCode && (
                <p className="mt-1 text-sm text-red-500">{errors.inviteCode.message}</p>
                )}
              <Users aria-hidden className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 font-semibold rounded-lg">
            Join
          </Button>
        </form>
      </motion.div>
    </Modal>
  );
}
