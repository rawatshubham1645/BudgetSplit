import React, { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "../components/ui/suspense";
import Topbar from "../components/home/Topbar";
import NavigationBar from "../components/home/NavigationBar";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Home = lazy(() => import("../components/home/dashboard/Home"));
const Dashboard = lazy(() => import("../components/home/dashboard/dashboard"));
const GroupsRoutes = lazy(() => import("./groupRoutes/GroupRoutes"));
const ExpensesRoutes = lazy(() => import("./expenseRoutes/ExpenseRoutes"));
const SettlementRoutes = lazy(() => import("./settlementRoutes/SettlementRoutes"));
const HistoryRoutes = lazy(() => import("./historyRoutes/HistoryRoutes"));
  const Profile = lazy(() => import("../components/home/profile/Profile"));
function HomeRoutes() {
  return (
    <ProtectedRoute>
      <Suspense>
        <div className="min-h-screen bg-background">
          <NavigationBar />
          <div className="lg:pl-72">
            <Topbar />
            <main className="container mx-auto py-6 px-4 lg:px-6">
              <Routes>
                <Route path="" element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="groups/*" element={<GroupsRoutes />} />
                <Route path="expenses/*" element={<ExpensesRoutes />} />
                <Route path="settlements/*" element={<SettlementRoutes />} />
                <Route path="history/*" element={<HistoryRoutes />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate replace to="/404" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}

export default HomeRoutes;
