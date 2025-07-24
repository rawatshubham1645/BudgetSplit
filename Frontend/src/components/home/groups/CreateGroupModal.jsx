import React, { useEffect } from "react";
import Modal from "@/components/common/Modal";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useMutation from "@/hooks/useMutation";

export default function CreateGroupModal({ isOpen, onClose, refetch }) {
  const { mutate, loading } = useMutation();
  const groupSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Group Name must be at least 2 characters")
      .max(50, "Group Name must be less than 50 characters")
      .required("Group Name is required"),
    baseCurrency: yup
      .string()
      .min(2, "Group Name must be at least 2 characters")
      .max(50, "Group Name must be less than 50 characters")
      .required("Group Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
    defaultValues: { name: "", baseCurrency: "" },
  });

  useEffect(() => {
    document.querySelector("[data-group-name-input]")?.focus();
  }, [isOpen]);

  const onSubmit = async (data) => {
    const response = await mutate({
      url: "api/groups/create",
      method: "POST",
      data,
    });
    if (response.success) {
      onClose();
      refetch();
    }
  };

  const inputClasses = `col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Name */}
          <div>
            <Label htmlFor="name">Group Name</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="name"
                type="text"
                {...register("name", { required: "Group name is required" })}
                data-group-name-input
                className={`${inputClasses} ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="e.g. Weekend Trip"
              />
              <Users
                aria-hidden
                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Base Currency */}
          <div>
            <Label htmlFor="groupId">Select Base Currency</Label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="baseCurrency"
                {...register("baseCurrency")}
                className={`block w-full rounded-md bg-white dark:bg-gray-700 py-2 px-3 border ${
                  errors.groupId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
              >
                <option value="">-- Select Base Currency --</option>
                {[
                  { label: "INR", value: "INR" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                  { label: "GBP", value: "GBP" },
                ].map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.groupId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.groupId.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 font-semibold rounded-lg"
          >
            Create Group
          </Button>
        </form>
      </motion.div>
    </Modal>
  );
}
