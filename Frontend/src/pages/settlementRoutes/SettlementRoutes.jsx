import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Settlements = lazy(() => import("../../components/home/settlements/Settlements"));

function SettlementRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<Settlements />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Suspense>
  );
}

export default SettlementRoutes;
