// src/app/admin/pages/[id]/edit/OutlineSidebar.js
"use client";

import { usePuck } from "@measured/puck";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

const CLIPBOARD_MARKER = "__ielts7_puck_node__";
const EMPTY_SUFFIX = "::__empty__";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function labelFor(item) {
  if (!item) return "Unknown";
  const p = item.props || {};
  const textish = p.text || p.heading || p.placeholder || "";
  return textish ? `${item.type} — ${String(textish).slice(0, 24)}` : item.type;
}

function buildTree(data) {
  const containers = { root: (data.content || []).map((c) => c.props.id) };
  const itemsById = {};
  (data.content || []).forEach((c) => (itemsById[c.props.id] = c));
  Object.entries(data.zones || {}).forEach(([zoneKey, items]) => {
    containers[zoneKey] = items.map((c) => c.props.id);
    items.forEach((c) => (itemsById[c.props.id] = c));
  });
  return { containers, itemsById };
}

function childZonesOf(containers, ownerId) {
  return Object.keys(containers).filter((k) => k.startsWith(`${ownerId}:`));
}

function collectSubtree(data, componentId) {
  const zones = {};
  function walk(id) {
    Object.entries(data.zones || {}).forEach(([zoneKey, items]) => {
      if (zoneKey.startsWith(`${id}:`)) {
        zones[zoneKey] = items;
        items.forEach((child) => walk(child.props.id));
      }
    });
  }
  walk(componentId);
  return zones;
}

function regenerateIds(item, zones) {
  const idMap = { [item.props.id]: newId() };
  Object.values(zones).forEach((items) => {
    items.forEach((child) => {
      if (!idMap[child.props.id]) idMap[child.props.id] = newId();
    });
  });
  const newItem = {
    ...item,
    props: { ...item.props, id: idMap[item.props.id] },
  };
  const newZones = {};
  Object.entries(zones).forEach(([zoneKey, items]) => {
    const [ownerId, zoneName] = zoneKey.split(":");
    const newZoneKey = `${idMap[ownerId] || ownerId}:${zoneName}`;
    newZones[newZoneKey] = items.map((child) => ({
      ...child,
      props: { ...child.props, id: idMap[child.props.id] || child.props.id },
    }));
  });
  return { item: newItem, zones: newZones };
}

function findContainerOf(containers, itemId) {
  return Object.keys(containers).find((key) =>
    containers[key].includes(itemId),
  );
}

// Reverse of Puck's own itemSelector -> figures out which component id
// is currently selected on the canvas, so the outline can highlight it.
function selectedIdFromSelector(containers, itemsById, itemSelector) {
  if (!itemSelector) return null;
  const zone = itemSelector.zone || "root";
  const id = containers[zone]?.[itemSelector.index];
  return id && itemsById[id] ? id : null;
}

// Forward direction -> given an id, build the { index, zone } shape Puck
// expects for dispatch({ type: "setUi", ui: { itemSelector } }).
function selectorForId(containers, id) {
  const zoneKey = findContainerOf(containers, id);
  if (!zoneKey) return null;
  return {
    index: containers[zoneKey].indexOf(id),
    zone: zoneKey === "root" ? undefined : zoneKey,
  };
}

// Every ancestor zone key that must be expanded for `id` to be visible
// in the tree (e.g. selecting a Heading inside a Section's col-0).
function ancestorZonesOf(containers, itemsById, id) {
  const chain = [];
  let current = id;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const zoneKey = findContainerOf(containers, current);
    if (!zoneKey || zoneKey === "root") break;
    const ownerId = zoneKey.split(":")[0];
    chain.push(ownerId);
    current = ownerId;
  }
  return chain;
}

function Row({
  id,
  item,
  depth,
  hasChildren,
  expanded,
  isSelected,
  onToggle,
  onCopy,
  onSelect,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    paddingLeft: 8 + depth * 16,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-1.5 pr-2 py-1.5 border-b text-sm cursor-pointer ${
        isSelected
          ? "bg-blue-50 border-l-2 border-l-blue-500 border-b-blue-100"
          : "bg-white border-gray-100 hover:bg-gray-50"
      }`}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="text-gray-400 w-3 shrink-0 text-xs cursor-pointer"
        >
          {expanded ? "▾" : "▸"}
        </button>
      ) : (
        <span className="w-3 shrink-0" />
      )}
      <button
        {...attributes}
        {...listeners}
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab text-gray-400 hover:text-gray-600 shrink-0"
        title="Drag to reorder or move"
      >
        ⠿
      </button>
      <span
        className={`flex-1 truncate ${isSelected ? "text-blue-700 font-medium" : "text-gray-700"}`}
      >
        {labelFor(item)}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
        className="text-gray-400 hover:text-blue-600 shrink-0 cursor-pointer"
        title="Copy"
      >
        <i className="ti ti-copy text-sm" />
      </button>
    </div>
  );
}

function ZoneDropTarget({ containerId }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${containerId}${EMPTY_SUFFIX}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={`ml-2 my-0.5 h-6 rounded border border-dashed text-[10px] flex items-center justify-center ${
        isOver
          ? "border-blue-400 bg-blue-50 text-blue-500"
          : "border-gray-200 text-gray-300"
      }`}
    >
      Drop here
    </div>
  );
}

export default function OutlineSidebar() {
  const { appState, dispatch } = usePuck();
  const [tree, setTree] = useState(() => buildTree(appState.data));
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (activeId) return;
    setTree(buildTree(appState.data));
  }, [appState.data, activeId]);

  const selectedId = selectedIdFromSelector(
    tree.containers,
    tree.itemsById,
    appState.ui?.itemSelector,
  );

  // When selection changes (e.g. clicked on canvas), auto-expand every
  // ancestor zone so the selected row is actually visible in the tree.
  useEffect(() => {
    if (!selectedId) return;
    const ancestors = ancestorZonesOf(
      tree.containers,
      tree.itemsById,
      selectedId,
    );
    if (ancestors.length === 0) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      ancestors.forEach((a) => next.add(a));
      return next;
    });
  }, [selectedId, tree.containers, tree.itemsById]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function flash(msg, ms = 1800) {
    setStatus(msg);
    setTimeout(() => setStatus(""), ms);
  }

  function toggle(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSelect(id) {
    const selector = selectorForId(tree.containers, id);
    if (!selector) return;
    dispatch({ type: "setUi", ui: { itemSelector: selector } });
  }

  async function handleCopy(id) {
    const item = tree.itemsById[id];
    if (!item) return;
    const zones = collectSubtree(appState.data, id);
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ marker: CLIPBOARD_MARKER, item, zones }),
      );
      flash(`Copied "${item.type}" — paste it anywhere`);
    } catch {
      flash("Copy blocked by browser clipboard permissions");
    }
  }

  async function handlePasteInto(containerId) {
    try {
      const text = await navigator.clipboard.readText();
      const payload = JSON.parse(text);
      if (payload.marker !== CLIPBOARD_MARKER) {
        flash("Clipboard doesn't contain a copied element");
        return;
      }
      const { item, zones } = regenerateIds(payload.item, payload.zones || {});
      dispatch({
        type: "setData",
        data: (prev) => {
          const next = { ...prev, zones: { ...(prev.zones || {}), ...zones } };
          if (containerId === "root") {
            next.content = [...(prev.content || []), item];
          } else {
            next.zones = {
              ...next.zones,
              [containerId]: [...(prev.zones?.[containerId] || []), item],
            };
          }
          return next;
        },
      });
      flash("Pasted");
    } catch (err) {
      flash(`Paste failed: ${err.message}`, 3000);
    }
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainerOf(tree.containers, active.id);
    const overId = String(over.id);
    const overContainer = overId.endsWith(EMPTY_SUFFIX)
      ? overId.replace(EMPTY_SUFFIX, "")
      : findContainerOf(tree.containers, over.id) || overId;

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    setTree((prev) => {
      const activeItems = prev.containers[activeContainer].filter(
        (id) => id !== active.id,
      );
      const overItems = prev.containers[overContainer] || [];
      const overIndex = overItems.indexOf(over.id);
      const insertAt = overIndex >= 0 ? overIndex : overItems.length;
      return {
        ...prev,
        containers: {
          ...prev.containers,
          [activeContainer]: activeItems,
          [overContainer]: [
            ...overItems.slice(0, insertAt),
            active.id,
            ...overItems.slice(insertAt),
          ],
        },
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const finalContainer = findContainerOf(tree.containers, active.id);
    if (!finalContainer) return;

    const overId = String(over.id);
    const overContainer = overId.endsWith(EMPTY_SUFFIX)
      ? overId.replace(EMPTY_SUFFIX, "")
      : findContainerOf(tree.containers, over.id);

    let finalContainers = tree.containers;
    if (overContainer === finalContainer) {
      const items = tree.containers[finalContainer];
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        finalContainers = {
          ...tree.containers,
          [finalContainer]: arrayMove(items, oldIndex, newIndex),
        };
        setTree((prev) => ({ ...prev, containers: finalContainers }));
      }
    }

    dispatch({
      type: "setData",
      data: (prev) => {
        const next = { ...prev, zones: { ...(prev.zones || {}) } };
        next.content = finalContainers.root
          .map((id) => tree.itemsById[id])
          .filter(Boolean);
        Object.entries(finalContainers).forEach(([key, ids]) => {
          if (key === "root") return;
          next.zones[key] = ids.map((id) => tree.itemsById[id]).filter(Boolean);
        });
        return next;
      },
    });
  }

  function renderContainer(containerId, depth) {
    const ids = tree.containers[containerId] || [];
    return (
      <SortableContext
        key={containerId}
        items={ids}
        strategy={verticalListSortingStrategy}
      >
        {ids.map((id) => {
          const item = tree.itemsById[id];
          if (!item) return null;
          const zoneKeys = childZonesOf(tree.containers, id);
          const hasChildren = zoneKeys.length > 0;
          const expanded = expandedIds.has(id);
          return (
            <div key={id}>
              <Row
                id={id}
                item={item}
                depth={depth}
                hasChildren={hasChildren}
                expanded={expanded}
                isSelected={id === selectedId}
                onToggle={() => toggle(id)}
                onCopy={() => handleCopy(id)}
                onSelect={() => handleSelect(id)}
              />
              {hasChildren && expanded && (
                <div>
                  {zoneKeys.map((zoneKey) => (
                    <div
                      key={zoneKey}
                      style={{ paddingLeft: (depth + 1) * 16 }}
                    >
                      <div className="flex items-center justify-between pr-2">
                        <span className="text-[10px] text-gray-400 uppercase">
                          {zoneKey.split(":")[1]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePasteInto(zoneKey)}
                          className="text-gray-400 hover:text-blue-600 cursor-pointer"
                          title="Paste here"
                        >
                          <i className="ti ti-clipboard text-xs" />
                        </button>
                      </div>
                      {renderContainer(zoneKey, depth + 1)}
                      {(tree.containers[zoneKey] || []).length === 0 && (
                        <ZoneDropTarget containerId={zoneKey} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </SortableContext>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Sections ({tree.containers.root.length})
        </span>
        <button
          type="button"
          onClick={() => handlePasteInto("root")}
          className="text-gray-400 hover:text-blue-600 cursor-pointer"
          title="Paste at the end of this page"
        >
          <i className="ti ti-clipboard text-sm" />
        </button>
      </div>
      {status && (
        <div className="px-2 py-1 text-xs text-gray-600 bg-amber-50 border-b border-amber-100">
          {status}
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {renderContainer("root", 0)}
      </DndContext>
      {tree.containers.root.length === 0 && (
        <div className="px-2 py-4 text-xs text-gray-400 text-center">
          No sections on this page yet
        </div>
      )}
    </div>
  );
}
