import React, { useState, useEffect } from 'react';
import { Connection, DatabaseType, EnvironmentType } from '../types/Connection';
import { X, Eye, EyeOff, Database, Save } from 'lucide-react';

interface EditConnectionModalProps {
  isOpen: boolean;
  connection: Connection | null;
  onClose: () => void;
  onSave: (connection: Connection) => void;
}

const defaultPorts = {
  PostgreSQL: 5432,
  MySQL: 3306,
  Oracle: 1521,
};

const environmentOptions: { value: EnvironmentType; label: string; icon: string }[] = [
  { value: 'dev', label: 'Development', icon: '🔧' },
  { value: 'qa', label: 'QA', icon: '🧪' },
  { value: 'staging', label: 'Staging', icon: '🎭' },
  { value: 'uat', label: 'UAT', icon: '👥' },
  { value: 'prod', label: 'Production', icon: '🚀' },
];

export const EditConnectionModal: React.FC<EditConnectionModalProps> = ({
  isOpen,
  connection,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    type: 'PostgreSQL' as DatabaseType,
    connectionName: '',
    databaseName: '',
    host: 'localhost',
    port: defaultPorts.PostgreSQL,
    username: '',
    password: '',
    environment: 'dev' as EnvironmentType,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (connection) {
      setFormData({
        type: connection.type,
        connectionName: connection.connectionName,
        databaseName: connection.databaseName,
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: connection.password,
        environment: connection.environment,
      });
    }
  }, [connection]);

  const handleTypeChange = (type: DatabaseType) => {
    setFormData(prev => ({
      ...prev,
      type,
      port: defaultPorts[type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connection) {
      onSave({
        ...connection,
        ...formData,
        lastUsed: new Date().toISOString(),
      });
    }
    onClose();
  };

  if (!isOpen || !connection) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Edit Connection</h2>
              <p className="text-xs text-white/80">Update your database details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/90 p-2 rounded-md hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Database Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Database Type</label>
            <div className="flex gap-2">
              {(['PostgreSQL', 'MySQL', 'Oracle'] as DatabaseType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition
                    ${formData.type === type
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Environment</label>
            <div className="grid grid-cols-3 gap-2">
              {environmentOptions.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, environment: env.value }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition
                    ${formData.environment === env.value
                      ? 'bg-green-50 border-green-300 text-green-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-green-50'}
                  `}
                >
                  <span>{env.icon}</span>
                  <span>{env.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Connection Name *" value={formData.connectionName} required onChange={(val) => setFormData(prev => ({ ...prev, connectionName: val }))} placeholder="e.g., My Local DB" />
            <Input label="Database Name" value={formData.databaseName} onChange={(val) => setFormData(prev => ({ ...prev, databaseName: val }))} placeholder="e.g., postgres" />
            <Input label="Host *" value={formData.host} required onChange={(val) => setFormData(prev => ({ ...prev, host: val }))} placeholder="e.g., localhost" />
            <Input label="Port *" type="number" value={formData.port.toString()} required onChange={(val) => setFormData(prev => ({ ...prev, port: parseInt(val) }))} />
            <Input label="Username *" value={formData.username} required onChange={(val) => setFormData(prev => ({ ...prev, username: val }))} placeholder="e.g., admin" />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border rounded-md border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable compact input
const Input = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-md border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
      placeholder={placeholder}
    />
  </div>
);
