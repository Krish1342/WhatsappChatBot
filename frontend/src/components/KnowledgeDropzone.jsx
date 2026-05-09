export default function KnowledgeDropzone({ onSelect, status }) {
  return (
    <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        PDF
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Drop knowledge PDFs
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Drag and drop or select files. We will chunk, embed, and index
          automatically.
        </p>
      </div>
      <button
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        onClick={onSelect}
        type="button"
      >
        {status === "Uploading" ? "Uploading..." : "Upload document"}
      </button>
      <button
        className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
        onClick={onSelect}
        type="button"
      >
        Choose PDF
      </button>
    </div>
  );
}
