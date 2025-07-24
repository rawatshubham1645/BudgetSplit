import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import AddExpenseModal from "./AddExpenseModal";
import useQuery from "@/hooks/useQuery";
import AddExpenseModal from "../expenses/AddExpenseModal";

export default function AddExpense() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: groups } = useQuery("api/groups/my");

  const handleAdd = (newExpense) => {
    setExpenses((prev) => [...prev, { ...newExpense, id: Date.now() }]);
    setModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex"
        onClick={() => setModalOpen(true)}
      >
        + Add Expense
      </Button>

      <AddExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        showGroupSelect={true}
        groupOptions={groups?.data?.data || []}
      />
    </>
  );
}
