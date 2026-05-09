import { motion } from "framer-motion";
import { useRef, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import KnowledgeDropzone from "../components/KnowledgeDropzone.jsx";
import api from "../services/api.js";

export default function Knowledge() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("Idle");
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }
    setStatus("Uploading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const payload = response.data;
      setDocuments((prev) => [
        {
          name: payload.filename,
          status: payload.stored ? "Indexed" : "Failed",
          updated: "Just now",
        },
        ...prev,
      ]);
      setStatus("Done");
    } catch (error) {
      setStatus("Failed");
    }
  };

  return (
    <AppShell title="Knowledge Studio" subtitle="RAG ingestion">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <KnowledgeDropzone
            onSelect={() => fileInputRef.current?.click()}
            status={status}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recent uploads</p>
          <div className="mt-6 flex flex-col gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.updated}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {doc.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
