import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import BarChart from "../components/BarChart.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DonutChart from "../components/DonutChart.jsx";
import StatCard from "../components/StatCard.jsx";
import { insightCards, sentimentBreakdown } from "../data/analyticsData.js";
import api from "../services/api.js";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_conversations: 0,
    total_tickets: 0,
    escalation_rate: 0,
    avg_confidence: 0.74,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/api/analytics");
        setSummary(response.data);
      } catch (error) {
        setSummary((prev) => prev);
      }
    };
    loadAnalytics();
  }, []);

  const stats = [
    {
      label: "Conversations",
      value: summary.total_conversations.toLocaleString(),
      trend: "+12%",
    },
    {
      label: "Tickets",
      value: summary.total_tickets.toLocaleString(),
      trend: "+6%",
    },
    {
      label: "Escalation rate",
      value: `${Math.round(summary.escalation_rate * 100)}%`,
      trend: "-3%",
    },
    {
      label: "Avg. confidence",
      value: `${Math.round(summary.avg_confidence * 100)}%`,
      trend: "+4%",
    },
  ];

  return (
    <AppShell title="Operations Dashboard" subtitle="Realtime intelligence">
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Resolution velocity"
            subtitle="Last 12 hours"
            value="92%"
          />
          <ChartCard
            title="Sentiment trend"
            subtitle="Customer mood"
            value="+0.42"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <BarChart title="Volume by hour" subtitle="Inbound load" />
          <div className="grid gap-4">
            {sentimentBreakdown.map((item) => (
              <DonutChart
                key={item.label}
                value={item.value}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel grid gap-6 rounded-3xl p-6 lg:grid-cols-3"
        >
          {[
            { title: "Top intent", value: "Billing adjustments" },
            { title: "Peak channel", value: "WhatsApp 62%" },
            { title: "Knowledge coverage", value: "86% indexed" },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {item.title}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {insightCards.map((card) => (
            <div key={card.label} className="glass-panel rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {card.label}
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
