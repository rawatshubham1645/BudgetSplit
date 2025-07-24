import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Clock, ArrowRight, FileDown } from "lucide-react";
import useQuery from "@/hooks/useQuery";
import BACKEND_URL from "@/imports/baseUrl";
import { getToken } from "@/imports/localStorage";

const COLORS = ["#4F46E5", "#10B981"];

export default function Dashboard() {
  const token = getToken();

  const [pieData, setPieData] = useState([]);

  const { data: groupCount } = useQuery(`api/dashboard/group-count`);
  const { data: recentActivities } = useQuery(`api/dashboard/logs/recent`);
  const { data: dailySummary, loading: dailySummaryLoading } = useQuery(
    `api/dashboard/daily-summary`
  );
  const { data: balance, loading: balanceLoading } = useQuery(
    `api/dashboard/balance`
  );

  const convertGraphData = (rawData) => {
    // Create a map from the raw data for quick lookup
    // Step 1: Create a map for quick lookup
    const dataMap = new Map(
      rawData.map((item) => [item.date, item.totalSpent])
    );

    // Step 2: Generate last 7 days
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
      const formattedDate = isoDate.split("-").reverse().join("-"); // DD-MM-YYYY

      result.push({
        date: formattedDate,
        amount: dataMap.get(isoDate) || 0,
      });
    }
    return result;
  };

  const barChartData = convertGraphData(dailySummary?.data || []);

  useEffect(() => {
    if (!balanceLoading && balance?.data) {
      const pieChartData = [
        {
          name: "Owe",
          value: Math.abs(Number(balance.data.amountOwedToUser) || 0),
        },
        { name: "Owed", value: Math.abs(Number(balance.data.amountOwed) || 0) },
      ];
      setPieData(pieChartData);
    }
  }, [balance, balanceLoading]);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}api/dashboard/export-recent-logs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // Optional: use a custom filename
      a.download = "export-settlements.xlsx"; // or .csv, .pdf depending on content
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8"
      >
        Welcome Back!
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="flex flex-col gap-3">
          <motion.div
            whileHover={{ y: -4 }}
            className="flex bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="w-14 h-14 p-4 bg-indigo-50 dark:bg-indigo-700 rounded-full">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-200" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Groups
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {groupCount?.data?.data?.groupCount}
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -4 }}
            className="flex flex-col gap-4 items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-md mx-auto"
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Balance Breakdown
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 mt-4">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    ></span>
                    <span className="capitalize">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-48">
              {pieData?.length === 0 ? (
                ""
              ) : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      cornerRadius={8}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff", // Tailwind gray-800
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    {/* Optional Legend */}
                    {/* <Legend verticalAlign="bottom" height={36}/> */}
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition col-span-1 md:col-span-2"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Balance Over Time
          </p>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="ml-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Recent Activity
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleDownload()}
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" /> Export
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivities?.data?.data?.map((act) => (
              <li key={act.id} className="py-3">
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  {act?.logDetail || ""}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {act?.time || "2h ago"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
