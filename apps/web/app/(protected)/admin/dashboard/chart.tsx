"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface ChartDataPoint {
  [key: string]: string | number;
}

export function DashboardChart({ data }: { data: ChartDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex bg-purple-50 justify-center items-center h-full text-purple-400 font-semibold rounded-2xl">
        No RSVPs found to plot.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9D5FF" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#6B21A8", fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#6B21A8", fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dx={-10}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: '#F3E8FF' }}
          contentStyle={{ borderRadius: '12px', border: '1px solid #E9D5FF', fontWeight: 600, color: '#4C1D95' }}
        />
        <Bar dataKey="attendees" fill="#9333EA" radius={[6, 6, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
