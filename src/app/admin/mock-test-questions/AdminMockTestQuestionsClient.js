"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteQuestionButton from "./DeleteQuestionButton";
import { useSearchParams, useRouter } from "next/navigation";
import AudioUpload from "../AudioUpload";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const moduleConfig = {
  listening: {
    icon: "ti ti-headphones",
    color: "text-sky-600",
    bg: "bg-sky-50",
    activeBg: "bg-sky-500",
    border: "border-sky-500",
  },
  reading: {
    icon: "ti ti-book",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    activeBg: "bg-indigo-500",
    border: "border-indigo-500",
  },
  writing: {
    icon: "ti ti-pencil",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-500",
    border: "border-emerald-500",
  },
  speaking: {
    icon: "ti ti-microphone",
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBg: "bg-amber-500",
    border: "border-amber-500",
  },
};

const typeColors = {
  mcq: "bg-blue-50 text-blue-600",
  "multi-select": "bg-blue-100 text-blue-700",
  passage: "bg-violet-50 text-violet-600",
  task: "bg-rose-50 text-rose-600",
  part: "bg-orange-50 text-orange-600",
  "form-completion": "bg-teal-50 text-teal-600",
  "table-completion": "bg-stone-100 text-stone-600",
  "sentence-completion": "bg-emerald-50 text-emerald-600",
  "short-answer": "bg-amber-50 text-amber-600",
  matching: "bg-pink-50 text-pink-600",
  "map-labelling": "bg-indigo-50 text-indigo-600",
  "true-false-ng": "bg-cyan-50 text-cyan-600",
  "yes-no-ng": "bg-sky-50 text-sky-600",
  "matching-headings": "bg-fuchsia-50 text-fuchsia-600",
  "matching-information": "bg-lime-50 text-lime-600",
  "matching-features": "bg-purple-50 text-purple-600",
  "summary-completion": "bg-yellow-50 text-yellow-700",
  "text-block": "bg-slate-100 text-slate-500",
};

const SECTION_COUNT = { listening: 4, reading: 3 };
const SECTION_LABEL = { listening: "Section", reading: "Passage" };
const SECTION_ICON = { listening: "ti-headphones", reading: "ti-book" };

// Types whose preview text is content.instruction — everything else has its
// own dedicated field (text/title/label/part).
const INSTRUCTION_PREVIEW_TYPES = [
  "matching",
  "form-completion",
  "table-completion",
  "sentence-completion",
  "short-answer",
  "map-labelling",
  "true-false-ng",
  "yes-no-ng",
  "matching-headings",
  "matching-information",
  "matching-features",
  "summary-completion",
];

function getPreviewText(type, content) {
  if (type === "mcq") return content.text;
  if (type === "multi-select") return content.questionText;
  if (type === "passage") return content.title;
  if (type === "task")
    return `Task ${content.taskNumber ?? "?"} — ${content.prompt || "(no prompt yet)"}`;
  if (type === "part") return content.part;
  if (type === "text-block") return content.text;
  if (INSTRUCTION_PREVIEW_TYPES.includes(type)) return content.instruction;
  return "";
}

function LockToggle({ label, checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
        checked
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div
        className={`w-8 h-4.5 rounded-full relative transition-all ${checked ? "bg-blue-600" : "bg-slate-200"}`}
        style={{ height: "18px" }}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${checked ? "translate-x-3.5" : "translate-x-0"}`}
        />
      </div>
      {label}
    </button>
  );
}

// Quick-add popup for Text Block — skips the full question form entirely.
function QuickTextBlockModal({
  activeModule,
  activeSection,
  nextOrder,
  testType,
  onClose,
  onCreated,
}) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("h3");
  const [align, setAlign] = useState("left");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!text.trim()) {
      setError("Text is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/mock-test-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: activeModule,
          type: "text-block",
          order: nextOrder,
          content: { text, tag, align },
          published: true,
          testType: testType || "both",
          section: activeSection,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      onCreated(created);
      onClose();
    } catch {
      setError("Failed to create. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <i className="ti ti-typography text-blue-600" /> Add Text Block
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all"
          >
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        <p className="text-xs text-slate-400 -mt-2">
          Adding to{" "}
          <span className="font-bold text-slate-600 capitalize">
            {activeModule}
          </span>{" "}
          — {SECTION_LABEL[activeModule]} {activeSection}. Drag it into position
          afterward.
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <i className="ti ti-alert-circle flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
            Text *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Questions 1–6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Style
            </label>
            <div className="relative">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-sm px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 appearance-none cursor-pointer"
              >
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
                <option value="p">Paragraph</option>
              </select>
              <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Alignment
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { v: "left", i: "ti-align-left" },
                { v: "center", i: "ti-align-center" },
                { v: "right", i: "ti-align-right" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setAlign(opt.v)}
                  className={`flex items-center justify-center py-2.5 rounded-lg border-2 transition-all ${
                    align === opt.v
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <i className={`ti ${opt.i}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-all mt-1"
        >
          {saving ? (
            <>
              <i className="ti ti-loader-2 animate-spin" /> Adding...
            </>
          ) : (
            <>
              <i className="ti ti-check" /> Add Text Block
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// One draggable compact preview card — key info only, not a full rendered
// preview (type, order, test type, a preview line, status, actions).
const MAX_INDENT_LEVEL = 4;

function QuestionCard({ question, activeModule, onIndentChange, position }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const preview = getPreviewText(question.type, question.content);
  const isTextBlock = question.type === "text-block";
  const indentLevel = Math.min(
    MAX_INDENT_LEVEL,
    Math.max(0, question.content?.indent || 0),
  );

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginLeft: indentLevel * 36 }}
      className="flex items-center gap-3 transition-all"
    >
      {indentLevel > 0 && (
        <i className="ti ti-corner-down-right text-slate-300 text-base flex-shrink-0 -mr-1" />
      )}
      <div
        className={`flex-1 min-w-0 bg-white rounded-xl border p-3.5 flex items-center gap-3 transition-shadow ${
          isTextBlock ? "border-slate-200 bg-slate-50/50" : "border-slate-200"
        } ${isDragging ? "shadow-lg" : "hover:shadow-sm"}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 flex-shrink-0 touch-none p-1"
          title="Drag to reorder"
        >
          <i className="ti ti-grip-vertical text-lg" />
        </button>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => onIndentChange(question, -1)}
            disabled={indentLevel === 0}
            title="Un-indent"
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <i className="ti ti-indent-decrease text-sm" />
          </button>
          <button
            onClick={() => onIndentChange(question, 1)}
            disabled={indentLevel >= MAX_INDENT_LEVEL}
            title="Indent one tab right"
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent ${
              indentLevel > 0
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
            }`}
          >
            <i className="ti ti-indent-increase text-sm" />
          </button>
          {indentLevel > 0 && (
            <span className="text-[10px] font-bold text-blue-500 w-3 text-center">
              {indentLevel}
            </span>
          )}
        </div>

        {!isTextBlock && (
          <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
            {position}
          </span>
        )}

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${typeColors[question.type] || "bg-slate-100 text-slate-600"}`}
        >
          {question.type.replace(/-/g, " ")}
        </span>

        {!isTextBlock && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 hidden sm:inline-block ${
              question.testType === "academic"
                ? "bg-blue-50 text-blue-600"
                : question.testType === "general"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-violet-50 text-violet-600"
            }`}
          >
            {question.testType === "both" ? "Both" : question.testType}
          </span>
        )}

        <p className="text-sm text-slate-600 truncate flex-1 min-w-0">
          {preview || (
            <span className="text-slate-300 italic">No preview text</span>
          )}
        </p>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 hidden md:inline-block ${question.published ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
        >
          {question.published ? "Published" : "Draft"}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Link
            href={`/admin/mock-test-questions/${question.id}?module=${activeModule}`}
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            <i className="ti ti-edit text-sm" />
          </Link>
          <DeleteQuestionButton id={question.id} />
        </div>
      </div>
    </div>
  );
}

export default function AdminMockTestQuestionsClient({
  questions: initialQuestions,
}) {
  const modules = ["listening", "reading", "writing", "speaking"];
  const router = useRouter();

  const searchParams = useSearchParams();
  const [activeModule, setActiveModule] = useState(
    searchParams.get("module") || "listening",
  );
  const [activeSection, setActiveSection] = useState(1);
  const [showTextBlockModal, setShowTextBlockModal] = useState(false);
  const [reorderError, setReorderError] = useState("");

  // Local editable copy so drag-reorder and quick-add feel instant without a
  // full page reload; router.refresh() still syncs server state in the background.
  const [questions, setQuestions] = useState(initialQuestions);
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Mock test settings (section lock, audio lock, per-section audio URLs)
  const [settings, setSettings] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    fetch("/api/mock-test-settings", { cache: "no-store" })
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettingsError("Failed to load listening settings."));
  }, []);

  const saveSettings = async (patch) => {
    if (!settings) return;
    const previous = settings;
    const updated = { ...settings, ...patch };
    setSettings(updated);
    setSavingSettings(true);
    setSettingsError("");
    try {
      const res = await fetch("/api/mock-test-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
    } catch {
      setSettingsError("Failed to save. Please try again.");
      setSettings(previous);
    } finally {
      setSavingSettings(false);
    }
  };

  // Count per module
  const counts = modules.reduce((acc, m) => {
    acc[m] = questions.filter((q) => q.module === m).length;
    return acc;
  }, {});

  // Count per listening section OR reading passage, depending on active module
  const sectionCount = SECTION_COUNT[activeModule] || 0;
  const sectionNumbers = Array.from({ length: sectionCount }, (_, i) => i + 1);
  const sectionCounts = sectionNumbers.reduce((acc, n) => {
    acc[n] = questions.filter(
      (q) => q.module === activeModule && (q.section || 1) === n,
    ).length;
    return acc;
  }, {});

  // Items for the active module (+ section, when the module has sections),
  // sorted by order — this is the list drag-and-drop reorders directly, for
  // every module (Listening, Reading, Writing, Speaking all use this).
  const sectionItems = questions
    .filter(
      (q) =>
        q.module === activeModule &&
        (sectionCount ? (q.section || 1) === activeSection : true),
    )
    .sort((a, b) => a.order - b.order);

  const handleModuleSelect = (m) => {
    setActiveModule(m);
    if (SECTION_COUNT[m]) setActiveSection(1);
  };

  const nextOrderForSection = () =>
    sectionItems.length > 0
      ? Math.max(...sectionItems.map((q) => q.order)) + 1
      : 0;

  const handleTextBlockCreated = (created) => {
    setQuestions((prev) => [...prev, created]);
    router.refresh();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionItems.findIndex((q) => q.id === active.id);
    const newIndex = sectionItems.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sectionItems, oldIndex, newIndex).map(
      (q, i) => ({ ...q, order: i }),
    );

    // Optimistic local update
    const reorderedIds = new Set(reordered.map((q) => q.id));
    setQuestions((prev) => [
      ...prev.filter((q) => !reorderedIds.has(q.id)),
      ...reordered,
    ]);
    setReorderError("");

    // Persist only the items whose order actually changed
    const changed = reordered.filter((q) => {
      const original = sectionItems.find((o) => o.id === q.id);
      return original.order !== q.order;
    });

    try {
      await Promise.all(
        changed.map((q) =>
          fetch(`/api/mock-test-questions/${q.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              module: q.module,
              type: q.type,
              order: q.order,
              content: q.content,
              published: q.published,
              testType: q.testType,
              section: q.section,
            }),
          }).then((res) => {
            if (!res.ok) throw new Error();
          }),
        ),
      );
      router.refresh();
    } catch {
      setReorderError(
        "Some changes couldn't be saved — refresh the page and try again.",
      );
    }
  };

  const handleIndentChange = async (question, delta) => {
    const currentLevel = Math.min(
      MAX_INDENT_LEVEL,
      Math.max(0, question.content?.indent || 0),
    );
    const nextLevel = Math.min(
      MAX_INDENT_LEVEL,
      Math.max(0, currentLevel + delta),
    );
    if (nextLevel === currentLevel) return;

    const updatedContent = { ...question.content, indent: nextLevel };

    // Optimistic local update
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, content: updatedContent } : q,
      ),
    );
    setReorderError("");

    try {
      const res = await fetch(`/api/mock-test-questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: question.module,
          type: question.type,
          order: question.order,
          content: updatedContent,
          published: question.published,
          testType: question.testType,
          section: question.section,
        }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // revert on failure
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? question : q)),
      );
      setReorderError("Failed to save indent change. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Mock Test Questions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage questions for all four modules.
          </p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((m) => {
          const cfg = moduleConfig[m];
          const isActive = activeModule === m;
          return (
            <button
              key={m}
              onClick={() => handleModuleSelect(m)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5
                ${
                  isActive
                    ? `${cfg.border} bg-white shadow-lg`
                    : "border-slate-100 bg-white hover:border-slate-200 shadow-sm"
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200
                ${isActive ? `${cfg.activeBg} text-white` : `${cfg.bg} ${cfg.color}`}`}
              >
                <i className={cfg.icon} />
              </div>
              <div>
                <p
                  className={`text-2xl font-extrabold transition-colors ${isActive ? cfg.color : "text-slate-800"}`}
                >
                  {counts[m]}
                </p>
                <p className="text-xs text-slate-400 capitalize">{m}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section/Passage tabs — Listening gets lock toggles + audio upload too */}
      {sectionCount > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {sectionNumbers.map((n) => {
                const isActive = activeSection === n;
                return (
                  <button
                    key={n}
                    onClick={() => setActiveSection(n)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                      isActive
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <i className={`ti ${SECTION_ICON[activeModule]} text-sm`} />
                    {SECTION_LABEL[activeModule]} {n}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-sky-500 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {sectionCounts[n]}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeModule === "listening" && settings && (
              <div className="flex items-center gap-2 flex-wrap">
                {savingSettings && (
                  <i className="ti ti-loader-2 animate-spin text-slate-300 text-sm" />
                )}
                <LockToggle
                  label="Lock Section Order"
                  checked={settings.sectionLocked}
                  onChange={() =>
                    saveSettings({ sectionLocked: !settings.sectionLocked })
                  }
                />
                <LockToggle
                  label="Lock Audio After Play"
                  checked={settings.audioLocked}
                  onChange={() =>
                    saveSettings({ audioLocked: !settings.audioLocked })
                  }
                />
                <LockToggle
                  label="Auto-Play Audio"
                  checked={settings.autoPlayAudio}
                  onChange={() =>
                    saveSettings({ autoPlayAudio: !settings.autoPlayAudio })
                  }
                />
                <LockToggle
                  label="No Pause / Rewind"
                  checked={settings.noPauseRewind}
                  onChange={() =>
                    saveSettings({ noPauseRewind: !settings.noPauseRewind })
                  }
                />
                <LockToggle
                  label="Auto-Advance Sections"
                  checked={settings.autoAdvanceSection}
                  onChange={() =>
                    saveSettings({
                      autoAdvanceSection: !settings.autoAdvanceSection,
                    })
                  }
                />
                <LockToggle
                  label="Reading Time Before Audio"
                  checked={settings.previewTimeEnabled}
                  onChange={() =>
                    saveSettings({
                      previewTimeEnabled: !settings.previewTimeEnabled,
                    })
                  }
                />
                {settings.previewTimeEnabled && (
                  <div className="flex items-center gap-1.5 bg-white border-2 border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-500">
                      Seconds:
                    </span>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={settings.previewSeconds ?? 30}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 30;
                        setSettings((s) => ({ ...s, previewSeconds: val }));
                      }}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value) || 30;
                        saveSettings({ previewSeconds: val });
                      }}
                      className="w-14 text-xs font-bold text-slate-700 outline-none bg-transparent"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {activeModule === "listening" && (
            <p className="text-xs text-slate-400 -mt-2">
              These control how strictly the Listening test matches the real
              IELTS exam — toggle any of them off for a more flexible practice
              mode.
            </p>
          )}

          {activeModule === "listening" && settingsError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
              <i className="ti ti-alert-circle flex-shrink-0" />
              {settingsError}
            </div>
          )}

          {/* Audio upload scoped to the active section — listening only */}
          {activeModule === "listening" && (
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              {settings ? (
                <AudioUpload
                  label={`Section ${activeSection} Audio`}
                  value={settings[`audioSection${activeSection}`] || ""}
                  onChange={(url) =>
                    saveSettings({ [`audioSection${activeSection}`]: url })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-6 justify-center">
                  <i className="ti ti-loader-2 animate-spin" />
                  Loading audio settings...
                </div>
              )}
            </div>
          )}

          {activeModule === "reading" && (
            <p className="text-xs text-slate-400">
              Add a "Reading Passage" type question to each passage tab for the
              passage text itself, then add the question types (True/False/NG,
              Matching Headings, etc.) tagged to the same passage.
            </p>
          )}
        </div>
      )}

      {activeModule === "speaking" && settings && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-slate-700">
              Show Question Text While Listening
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              When off, students only hear the question audio — no text shown,
              closer to the real exam.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savingSettings && (
              <i className="ti ti-loader-2 animate-spin text-slate-300 text-sm" />
            )}
            <LockToggle
              label={
                settings.speakingShowQuestionText ? "Text Shown" : "Text Hidden"
              }
              checked={settings.speakingShowQuestionText}
              onChange={() =>
                saveSettings({
                  speakingShowQuestionText: !settings.speakingShowQuestionText,
                })
              }
            />
          </div>
        </div>
      )}

      {/* Question / text-block list — same draggable card UI across all four modules */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${moduleConfig[activeModule].bg} ${moduleConfig[activeModule].color}`}
          >
            {activeModule}
            {sectionCount > 0 &&
              ` — ${SECTION_LABEL[activeModule]} ${activeSection}`}
          </span>
          <span className="text-xs text-slate-400">
            {sectionItems.length} item{sectionItems.length !== 1 ? "s" : ""} —
            drag <i className="ti ti-grip-vertical" /> to reorder
          </span>
        </div>

        {reorderError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i className="ti ti-alert-circle flex-shrink-0" />
            {reorderError}
          </div>
        )}

        {sectionItems.length > 0 ? (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionItems.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {(() => {
                    let questionCounter = 0;
                    return sectionItems.map((q) => {
                      const isTextBlock = q.type === "text-block";
                      if (!isTextBlock) questionCounter += 1;
                      return (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          activeModule={activeModule}
                          onIndentChange={handleIndentChange}
                          position={isTextBlock ? null : questionCounter}
                        />
                      );
                    });
                  })()}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex items-center justify-center gap-3 pt-3 mt-1 border-t border-slate-100">
              {sectionCount > 0 && (
                <button
                  onClick={() => setShowTextBlockModal(true)}
                  className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-600 text-sm font-bold px-5 py-3 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
                >
                  <i className="ti ti-typography text-base" />
                  Add Text Block
                </button>
              )}
              <Link
                href={`/admin/mock-test-questions/new?module=${activeModule}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
              >
                <i className="ti ti-plus text-base" />
                Add Question
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-14">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-file-off" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No items in {activeModule}
              {sectionCount > 0 &&
                ` — ${SECTION_LABEL[activeModule]} ${activeSection}`}{" "}
              yet
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Add a question{sectionCount > 0 ? " or a text block" : ""} to get
              started.
            </p>
            <div className="flex items-center justify-center gap-3">
              {sectionCount > 0 && (
                <button
                  onClick={() => setShowTextBlockModal(true)}
                  className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-600 text-sm font-bold px-5 py-3 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
                >
                  <i className="ti ti-typography" />
                  Add Text Block
                </button>
              )}
              <Link
                href={`/admin/mock-test-questions/new?module=${activeModule}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
              >
                <i className="ti ti-plus" />
                Add Question
              </Link>
            </div>
          </div>
        )}
      </div>

      {showTextBlockModal && (
        <QuickTextBlockModal
          activeModule={activeModule}
          activeSection={activeSection}
          nextOrder={nextOrderForSection()}
          testType={activeModule === "reading" ? "both" : undefined}
          onClose={() => setShowTextBlockModal(false)}
          onCreated={handleTextBlockCreated}
        />
      )}
    </div>
  );
}
