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

export default function Invite({ isOpen, onClose, refetch, groupData }) {
  const { mutate, loading } = useMutation();
  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: '' }
  });

  useEffect(() => {
    document.querySelector('[data-group-name-input]')?.focus();
  }, [isOpen]);

  const onSubmit = async (data) => {
    console.log(data)
    const response = await mutate({ url: `api/groups/invite?email=${data?.email}&inviteCode=${groupData?.inviteCode}`, method: 'POST', data: {} });
        if (response.success) {
          onClose();
          refetch();
        }
  };

  const inputClasses = `col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite People">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Name */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="email"
                type="text"
                {...register('email', { required: 'Email is required' })}
                data-group-name-input
                className={`${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
                placeholder="e.g. hemant@example.com"
                />
                {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              <Users aria-hidden className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 font-semibold rounded-lg">
            Invite
          </Button>
        </form>
      </motion.div>
    </Modal>
  );
}
