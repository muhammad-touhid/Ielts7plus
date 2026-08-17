// src/lib/pageBuilder/carousel/GridShell.jsx
"use client";

const GRID_COLUMN_CLASSES = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function GridShell({ items, renderCard, getKey, columns = 3 }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-slate-400">
        Nothing to show yet.
      </div>
    );
  }
  const columnClass = GRID_COLUMN_CLASSES[columns] || GRID_COLUMN_CLASSES[3];
  return (
    <div className={`grid grid-cols-1 ${columnClass} gap-6`}>
      {items.map((item, i) => (
        <div key={getKey(item, i)}>{renderCard(item)}</div>
      ))}
    </div>
  );
}
