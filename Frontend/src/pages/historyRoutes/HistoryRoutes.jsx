import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const History = lazy(() => import("../../components/home/history/History"));

function HistoryRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<History />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Suspense>
  );
}

export default HistoryRoutes;
