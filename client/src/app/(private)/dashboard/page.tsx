"use client";

import { customerService } from "@/src/services/customer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

type Customer = {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

type Stats = {
  total: number;
  counts: { _id: string; count: number }[];
  customers: Customer[];
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Active":
      return "text-green-700";
    case "Lead":
      return "text-blue-700";
    case "Inactive":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) setUser(JSON.parse(storedUser));

        const [dashboardRes, activityRes] = await Promise.all([
          customerService.getDashboarData(),
          customerService.getCustomerAtivity(),
        ]);

        setStats(dashboardRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  const statusMap: Record<string, number> =
    stats?.counts?.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  const getPercent = (value: number) => {
    if (!stats?.total) return 0;
    return Math.round((value / stats.total) * 100);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"></h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/customers-list")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Customers
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/signin");
            }}
            className="border border-red-500 text-red-500 px-4 py-1 hover:bg-red-50 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="p-8 rounded-2xl bg-gray-100 shadow-xs mb-6">
        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
      </div>

      <div className="mb-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500 pt-2">Total Customers</h3>
            <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500 pt-2">Active Customers</h3>
            <p className="text-2xl font-bold">{statusMap.Active ?? 0}</p>
            <p className="text-sm text-gray-400">
              {getPercent(statusMap.Active)}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className=" text-gray-500">Leads Count</h3>
            <p className="text-2xl font-bold pt-2">{statusMap.Lead ?? 0}</p>
            <p className="text-sm text-gray-400">
              {getPercent(statusMap.Lead)}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className=" text-gray-500">Inactive Count</h3>
            <p className="text-2xl font-bold pt-2">{statusMap.Inactive ?? 0}</p>
            <p className="text-sm text-gray-400">
              {getPercent(statusMap.Inactive)}%
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200">
            <h3 className="font-semibold py-2">Recent Customers</h3>
            <button
              onClick={() => router.push("/customers-list")}
              className="text-sm text-blue-600"
            >
              View All
            </button>
          </div>

          {stats?.customers?.length === 0 ? (
            <p className="text-gray-400 text-sm">No customers</p>
          ) : (
            stats?.customers?.map((c) => (
              <div
                key={c._id}
                className="flex justify-between py-2 border-b border-gray-100 text-sm"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-gray-500 text-xs">{c.email}</p>
                </div>
               
                  <span
                    className={`font-semibold ${getStatusStyle(
                      c.status,
                    )}`}
                  >
                    {c.status}
                  </span>
          
              </div>
            ))
          )}
        </div>

        {/* Activity */}
        <div className="bg-white p-6 max-h-96 overflow-y-auto rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200">
            <h3 className="font-semibold mb-4">Activity</h3>
          </div>
          
          {activity.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity</p>
          ) : (
            activity.map((a, i) => (
              <div key={i} className="text-sm py-2 border-b border-gray-100">
                <p>
                  <span className="font-medium">{a.user}</span> {a.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(a.time).toLocaleString()}
                </p>
              </div>
            ))
          )}
          </div>
      </div>
    </div>
  );
}
