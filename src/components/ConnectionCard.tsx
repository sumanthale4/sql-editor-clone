import React, { useState } from 'react';
import { Connection } from '../types/Connection';
import { Trash2, Database, GripVertical, Edit3, Eye, EyeOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ConnectionCardProps {
  connection: Connection;
  onDelete: (id: string) => void;
  onEdit: (connection: Connection) => void;
}

const typeColors = {
  PostgreSQL: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    badge: 'bg-blue-600',
  },
  MySQL: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-orange-200',
    badge: 'bg-orange-600',
  },
  Oracle: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    border: 'border-red-200',
    badge: 'bg-red-600',
  },
};

const environmentConfig = {
  dev: { color: 'bg-green-100 text-green-800', icon: '🔧' },
  qa: { color: 'bg-blue-100 text-blue-800', icon: '🧪' },
  staging: { color: 'bg-yellow-100 text-yellow-800', icon: '🎭' },
  uat: { color: 'bg-purple-100 text-purple-800', icon: '👥' },
  prod: { color: 'bg-red-100 text-red-800', icon: '🚀' },
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onDelete,
  onEdit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
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

  const typeConfig = typeColors[connection.type];
  const envConfig = environmentConfig[connection.environment];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-xl border-2 shadow-md hover:shadow-lg 
        transition-all duration-200 overflow-hidden p-4
        ${typeConfig.border} ${typeConfig.bg}
        ${isDragging ? 'opacity-60 shadow-xl scale-105' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Header with Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${typeConfig.badge}`}>
            <Database className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {connection.connectionName}
            </h3>
            <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${envConfig.color}`}>
              <span>{envConfig.icon}</span>
              <span className="uppercase">{connection.environment}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            {...attributes}
            {...listeners}
            className="p-1 rounded cursor-grab active:cursor-grabbing bg-white/80 hover:bg-white"
          >
            <GripVertical className="w-3 h-3 text-gray-500" />
          </div>
          <button
            onClick={() => onEdit(connection)}
            className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
            title="Edit connection"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(connection.id)}
            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
            title="Delete connection"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Connection Info */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Host:</span>
          <span className="font-medium text-gray-900 truncate ml-2">
            {connection.host}:{connection.port}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">User:</span>
          <span className="font-medium text-gray-900 truncate ml-2">
            {connection.username}
          </span>
        </div>

        {connection.databaseName && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">DB:</span>
            <span className="font-medium text-gray-900 truncate ml-2">
              {connection.databaseName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Password:</span>
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-900">
              {showPassword ? connection.password || '••••••••' : '••••••••'}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Database Type Badge */}
      <div className="mt-3 pt-2 border-t border-white/50">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.badge} text-white`}>
          {connection.type}
        </div>
      </div>
    </div>
  );
};