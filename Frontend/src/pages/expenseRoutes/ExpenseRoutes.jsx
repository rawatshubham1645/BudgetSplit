import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Expenses = lazy(() => import("../../components/home/expenses/Expenses"));

function ExpenseRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<Expenses />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Suspense>
  );
}

export default ExpenseRoutes;
