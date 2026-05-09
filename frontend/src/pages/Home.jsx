import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Layout from "../components/Layout.jsx";

export default function Home() {
  return (
    <Layout>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel relative overflow-hidden rounded-[32px] p-10 shadow-xl"
        >
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-200/70 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              SupportPilot AI
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-6xl">
              Modern customer support, orchestrated by AI
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Bring together WhatsApp, knowledge bases, and human escalation
              into one intelligent console. SupportPilot AI turns every
              conversation into a fast, empathetic resolution.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/chat"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
              >
                Open Live Console
              </Link>
              <Link
                to="/dashboard"
                className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-slate-700"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Unified channels",
              body: "Connect WhatsApp, web chat, and email with a single orchestration brain.",
            },
            {
              title: "Adaptive escalation",
              body: "Route sensitive issues to humans automatically with confidence-aware guardrails.",
            },
            {
              title: "Knowledge that learns",
              body: "Feed PDFs and internal docs into a RAG pipeline that stays fresh.",
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{card.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel grid gap-6 rounded-3xl p-8 md:grid-cols-3">
          {[
            { label: "Avg. response", value: "38 sec" },
            { label: "Deflection rate", value: "72%" },
            { label: "CSAT uplift", value: "+18%" },
          ].map((metric) => (
            <div key={metric.label}>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
