// unchanged imports
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
    badge: "bg-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
  },
  qa: {
    icon: "🧪",
    badge: "bg-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  staging: {
    icon: "🎭",
    badge: "bg-yellow-600",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
  },
  uat: {
    icon: "👥",
    badge: "bg-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
  },
  prod: {
    icon: "🚀",
    badge: "bg-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
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
          group relative rounded-xl border ${envConfig.border} ${envConfig.bg}
          shadow-sm hover:shadow-md transition-all duration-200 p-4
          ${isDragging ? "opacity-60 scale-[1.02]" : "hover:scale-[1.01]"}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${envConfig.badge}`}>
              <Database className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {connection.connectionName}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              {...attributes}
              {...listeners}
              className="p-1 rounded cursor-grab active:cursor-grabbing bg-white hover:bg-gray-100 border border-gray-200"
              title="Drag to reorder"
            >
              <Grip className="w-4 h-4 text-gray-500" />
            </div>
            <button
              onClick={() => onUpdatePassword(connection)}
              className="p-1 rounded hover:bg-green-100 text-green-600"
              title="Update password"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(connection)}
              className="p-1 rounded hover:bg-blue-100 text-blue-600"
              title="Edit connection"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="p-1 rounded hover:bg-red-100 text-red-600"
              title="Delete connection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-gray-400" />
            <span className="truncate">{connection.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="truncate">
              {connection.host}:{connection.port}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className={`mt-3 pt-2 border-t ${envConfig.border} flex gap-3`}>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${envConfig.badge}`}
          >
            {connection.type}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${envConfig.badge}`}
          >
            {envConfig.icon}
            <span className="ml-1 uppercase">{connection.environment}</span>
          </span>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{connection.connectionName}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm text-white"
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
