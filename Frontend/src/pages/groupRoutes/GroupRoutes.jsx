import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const GroupList = lazy(() => import("../../components/home/groups/GroupList"));
const GroupDetails = lazy(() => import("../../components/home/groups/GroupDetails"));

function GroupRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<GroupList />} />
        <Route path=":groupId" element={<GroupDetails />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Suspense>
  );
}

export default GroupRoutes;
