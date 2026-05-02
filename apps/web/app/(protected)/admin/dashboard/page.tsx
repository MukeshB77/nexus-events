import { getDashboardStats, getDashboardChartData } from "@repo/db";
import { DashboardChart } from "./chart";
import { Users, Calendar, CheckCircle, Ticket } from "lucide-react";

export const revalidate = 0; // dynamic

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const chartData = await getDashboardChartData();

  const cards = [
    { title: "Total Members", value: stats.totalMembers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Active Events", value: stats.activeEvents, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Finished Events", value: stats.finishedEvents, icon: CheckCircle, color: "text-red-600", bg: "bg-red-100" },
    { title: "Attending", value: stats.attendingMembers, icon: Ticket, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-purple-950">Analytics Dashboard</h1>
        <p className="text-purple-600 mt-2 font-medium">Overview of your club members and event engagement.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-purple-600/80">{card.title}</p>
              <h3 className="text-3xl font-black text-purple-950 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 h-[450px] flex flex-col">
        <h3 className="text-xl font-bold text-purple-950 mb-6">Upcoming RSVPs</h3>
        <div className="flex-1 min-h-0">
          <DashboardChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
