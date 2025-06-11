import React, { useState } from 'react';
import { Connection, DatabaseType, EnvironmentType } from '../types/Connection';
import { X, Eye, EyeOff, Database, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connection: Omit<Connection, 'id' | 'order'>) => void;
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

export const AddConnectionModal: React.FC<AddConnectionModalProps> = ({
  isOpen,
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
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTypeChange = (type: DatabaseType) => {
    setFormData(prev => ({
      ...prev,
      type,
      port: defaultPorts[type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: 'PostgreSQL',
      connectionName: '',
      databaseName: '',
      host: 'localhost',
      port: defaultPorts.PostgreSQL,
      username: '',
      password: '',
      environment: 'dev',
    });
    setShowPassword(false);
    setTestResult(null);
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    
    // Simulate connection test
    setTimeout(() => {
      const isValid = formData.connectionName && formData.host && formData.username;
      setTestResult(isValid ? 'success' : 'error');
      setIsTestingConnection(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card w-full max-w-xl overflow-y-auto border-0">
        <div className="relative gradient-primary p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Connection</h2>
              <p className="text-blue-100 text-sm">Configure your database connection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/90 p-2 rounded-md hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Database Type */}
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1 block">Database Type</label>
            <div className="flex gap-2">
              {(['PostgreSQL', 'MySQL', 'Oracle'] as DatabaseType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition
                    ${formData.type === type
                      ? 'bg-[var(--synchrony-blue)] text-white border-[var(--synchrony-blue)] shadow'
                      : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-1 block">Environment</label>
            <div className="grid grid-cols-3 gap-2">
              {environmentOptions.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, environment: env.value }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition
                    ${formData.environment === env.value
                      ? 'bg-[var(--synchrony-teal)]/10 border-[var(--synchrony-teal)] text-[var(--synchrony-teal)] font-medium'
                      : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}
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
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input w-full px-3 py-2 pr-10 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
              testResult === 'success' 
                ? 'status-success border-green-200 dark:border-green-800' 
                : 'status-error border-red-200 dark:border-red-800'
            }`}>
              {testResult === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">
                  {testResult === 'success' 
                    ? 'Connection test successful!' 
                    : 'Connection test failed'
                  }
                </p>
                <p className="text-sm opacity-80">
                  {testResult === 'success' 
                    ? 'Your database connection is working properly.' 
                    : 'Please check your credentials and try again.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="btn-secondary flex-1 py-1.5 text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isTestingConnection ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Test Connection</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              className="btn-ghost px-6 py-1.5 text-sm"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn-primary flex-1 py-1.5 text-sm px-6 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Connection</span>
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
    <label className="text-sm font-medium text-[var(--text-primary)] mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="form-input w-full px-3 py-2 text-sm"
      placeholder={placeholder}
    />
  </div>
);