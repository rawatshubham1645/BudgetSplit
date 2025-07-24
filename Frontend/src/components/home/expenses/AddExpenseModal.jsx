import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectUser } from "@/redux/features/user/userSlice";
import { useSelector } from "react-redux";
import useMutation from "@/hooks/useMutation";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: yup
    .date()
    .required("Date is required")
    .typeError("Please enter a valid date"),
  payer: yup.string().required("Payer is required"),
  currency: yup.string().required("Currency is required"),
  groupId: yup.string().when("$showGroupSelect", {
    is: true,
    then: yup.string().required("Group is required"),
  }),
});

export default function AddExpenseModal({
  isOpen,
  onClose,
  showGroupSelect = false,
  groupOptions = [],
  refetch,
  initGroupId,
}) {
  const currentUser = useSelector(selectUser);

  const { mutate, loading } = useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema, { context: { showGroupSelect } }),
    defaultValues: {
      name: "",
      description: "",
      currency: "",
      amount: "",
      payer: currentUser?.id || "",
      groupId: "",
      participants: [],
      date: new Date().toISOString().split("T")[0], // 👈 today's date in 'YYYY-MM-DD' format
    },
  });

  const [members, setMembers] = useState([]);

  const { fields, update, replace } = useFieldArray({
    control,
    name: "participants",
  });
  const watchedParticipants = watch("participants");
  const selectedGroupId = watch("groupId");

  useEffect(() => {
    if (initGroupId) {
      const tempMembers =
        groupOptions
          ?.find((el) => el.id == initGroupId)
          ?.usersList?.map((user) => {
            if (user.id == currentUser.id) {
              return {
                id: user.id,
                label: `${user.firstName} ${user.lastName} (You)`,
              };
            } else {
              return {
                id: user.id,
                label: `${user.firstName} ${user.lastName}`,
              };
            }
          }) || [];

      console.log(tempMembers, groupOptions, initGroupId, "ttt");

      setMembers(tempMembers);
      const parts = tempMembers.map((u) => ({
        userId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        include: false,
        percentage: 0,
      }));
      replace(parts);
      // set default payer to first member
      setValue("payer", currentUser?.id || "1");
      setValue("groupId", initGroupId || "");
    }
  }, [initGroupId, groupOptions]);

  // initialize participants whenever members change
  useEffect(() => {
    if (members.length) {
      const parts = members.map((u) => ({
        userId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        include: false,
        percentage: 0,
      }));
      replace(parts);
      // set default payer to first member
      setValue("payer", currentUser?.id || "1");
    }
  }, [members, replace, setValue]);

  useEffect(() => {
    console.log(selectedGroupId, groupOptions, "ssssssss");
    const tempMembers = showGroupSelect
      ? groupOptions
          ?.find((el) => el.id == selectedGroupId)
          ?.usersList?.map((user) => {
            if (user.id == currentUser.id) {
              return {
                id: user.id,
                label: `${user.firstName} ${user.lastName} (You)`,
              };
            } else {
              return {
                id: user.id,
                label: `${user.firstName} ${user.lastName}`,
              };
            }
          }) || []
      : [];

    console.log(tempMembers, "mmmmmm");
    setMembers(tempMembers);
  }, [selectedGroupId, showGroupSelect]);

  useEffect(() => {
    document.querySelector("[data-name-input]")?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (members.length) {
      const parts = members.map((u) => ({
        userId: u.id,
        name: `${u.label}`,
        include: false,
        percentage: 0,
      }));
      replace(parts);
    }
  }, [members, replace]);

  const handleSplitEqually = () => {
    const included = watchedParticipants.filter((p) => p.include);
    const share = included.length ? +(100 / included.length).toFixed(2) : 0;
    fields.forEach((_, idx) =>
      setValue(
        `participants.${idx}.percentage`,
        watchedParticipants[idx].include ? share : 0
      )
    );
  };

  const onSubmit = async (data) => {
    console.log(data, "ddddddddddd");
    const participants = data.participants.filter((p) => p.include);
    const response = await mutate({
      url: `api/expenses/add`,
      method: "POST",
      data: {
        amount: data?.amount || 0,
        name: data?.name || "",
        description: data?.description || "",
        currency: data?.currency || "INR",
        paidByUserId: data?.payer || "",
        groupId: data?.groupId || "",
        date: data?.date
          ? new Date(data.date).toISOString().slice(0, 10)
          : new Date().toISOString().split("T")[0],
        splits:
          participants?.map((el) => ({
            participantUserId: el?.userId || "",
            percentage: el?.percentage || "",
          })) || [],
      },
    });
    if (response.success) {
      onClose();
      if (refetch) {
        refetch();
      }
    }
    //     onAdd({ ...data, date: new Date().toISOString().split('T')[0], participants });
  };

  const inputClasses =
    "col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-h-[80vh] overflow-y-auto px-2"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Select */}
          {showGroupSelect && (
            <div>
              <Label htmlFor="groupId">Select Group</Label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="groupId"
                  {...register("groupId")}
                  className={`block w-full rounded-md bg-white dark:bg-gray-700 py-2 px-3 border ${
                    errors.groupId
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
                >
                  <option value="">-- Select Group --</option>
                  {groupOptions.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.groupName}
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
          )}

          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="name"
                type="text"
                {...register("name")}
                data-name-input
                className={`${inputClasses} ${
                  errors.name ? "border-red-500" : ""
                } pl-4 sm:pl-4 sm:leading-2`}
                placeholder="e.g. Lunch at cafe"
              />
              {/* <DollarSign className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" /> */}
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="description"
                type="text"
                {...register("description")}
                data-description-input
                className={`${inputClasses} ${
                  errors.description ? "border-red-500" : ""
                } pl-4 sm:pl-4 sm:leading-2`}
                placeholder="e.g. Lunch at cafe"
              />
              {/* <DollarSign className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" /> */}
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="groupId">Select Currency</Label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="currency"
                {...register("currency")}
                className={`block w-full rounded-md bg-white dark:bg-gray-700 py-2 px-3 border ${
                  errors.groupId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
              >
                <option value="">-- Select Currency --</option>
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
            {errors.currency && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currency.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="amount"
                type="number"
                {...register("amount")}
                className={`${inputClasses} ${
                  errors.amount ? "border-red-500" : ""
                } pl-4 sm:pl-4 sm:leading-2`}
                placeholder="e.g. 500"
              />
              {/* <DollarSign className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" /> */}
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="date"
                type="date"
                {...register("date")}
                className={`${inputClasses}`}
              />
              <Calendar className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" />
            </div>
          </div>

          {/* Payer */}
          <div>
            <Label htmlFor="payer">Payer</Label>
            <div className="mt-2 grid grid-cols-1">
              <select
                {...register("payer")}
                className="block w-full rounded-md bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              >
                <option value="">Select payer</option>
                {members.map((u) => (
                  <option key={u.id} value={u.id}>
                    {`${u.label}`}
                  </option>
                ))}
              </select>
            </div>
            {errors.payer && (
              <p className="mt-1 text-sm text-red-500">
                {errors.payer.message}
              </p>
            )}
          </div>

          {/* Participants Split */}
          <div>
            <Label>Participants</Label>
            <div className="mt-2 space-y-2">
              {fields.map((field, idx) => {
                const include = watchedParticipants[idx]?.include;
                return (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={include}
                      onChange={(e) =>
                        setValue(
                          `participants.${idx}.include`,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                      {field.name}
                    </span>
                    <Input
                      //   type="number"
                      {...register(`participants.${idx}.percentage`)}
                      className="w-24"
                      placeholder="%"
                      disabled={!include}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSplitEqually}
              >
                Auto Split Equally
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 font-semibold rounded-lg"
          >
            Add Expense
          </Button>
        </form>
      </motion.div>
    </Modal>
  );
}
