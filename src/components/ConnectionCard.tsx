import React, { useState } from "react";
import { Connection } from "../types/Connection";
import {
  Trash2,
  Database,
  Edit3,
  User,
  Network,
  Key,
  Grip,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ConnectionCardProps {
  connection: Connection;
  onDelete: (id: string) => void;
  onEdit: (connection: Connection) => void;
  onUpdatePassword: (connection: Connection) => void;
}

const environmentConfig = {
  dev: {
    icon: "🔧",
    class: "env-dev",
  },
  qa: {
    icon: "🧪",
    class: "env-qa",
  },
  staging: {
    icon: "🎭",
    class: "env-staging",
  },
  uat: {
    icon: "👥",
    class: "env-uat",
  },
  prod: {
    icon: "🚀",
    class: "env-prod",
  },
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onDelete,
  onEdit,
  onUpdatePassword,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: connection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const envConfig = environmentConfig[connection.environment];

  const handleDeleteConfirmed = () => {
    onDelete(connection.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group relative card p-4 hover:shadow-[0_8px_25px_var(--shadow-medium)]
          ${isDragging ? "opacity-60 scale-[1.02]" : "hover:scale-[1.01]"}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-md">
              <Database className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {connection.connectionName}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              {...attributes}
              {...listeners}
              className="p-1 rounded cursor-grab active:cursor-grabbing bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]"
              title="Drag to reorder"
            >
              <Grip className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <button
              onClick={() => onUpdatePassword(connection)}
              className="p-1 rounded hover:bg-[var(--synchrony-teal)]/10 text-[var(--synchrony-teal)]"
              title="Update password"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(connection)}
              className="p-1 rounded hover:bg-[var(--synchrony-blue)]/10 text-[var(--synchrony-blue)]"
              title="Edit connection"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
              title="Delete connection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-[var(--text-primary)]">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="truncate">{connection.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="truncate">
              {connection.host}:{connection.port}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 pt-2 border-t border-[var(--border-primary)] flex gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--synchrony-blue)] text-white">
            {connection.type}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${envConfig.class}`}>
            {envConfig.icon}
            <span className="ml-1 uppercase">{connection.environment}</span>
          </span>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="card max-w-sm w-full p-6 relative animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-[var(--text-primary)]">{connection.connectionName}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};