import React, { useState } from 'react';
import { Connection, DatabaseType, EnvironmentType } from '../types/Connection';
import { X, Eye, EyeOff, Database, Check, AlertCircle, Sparkles, Shield } from 'lucide-react';

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

const environmentOptions: { value: EnvironmentType; label: string; icon: string; description: string }[] = [
  { value: 'dev', label: 'Development', icon: '🔧', description: 'Development environment' },
  { value: 'qa', label: 'Quality Assurance', icon: '🧪', description: 'Testing and QA' },
  { value: 'staging', label: 'Staging', icon: '🎭', description: 'Pre-production staging' },
  { value: 'uat', label: 'User Acceptance', icon: '👥', description: 'User acceptance testing' },
  { value: 'prod', label: 'Production', icon: '🚀', description: 'Live production environment' },
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Connection</h2>
                <p className="text-blue-100 text-sm">Configure your database connection</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-t-2xl" />
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Database Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Database Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['PostgreSQL', 'MySQL', 'Oracle'] as DatabaseType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`
                    relative px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200
                    ${
                      formData.type === type
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {type}
                  {formData.type === type && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Environment Type
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {environmentOptions.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, environment: env.value }))}
                  className={`
                    relative p-3 text-left rounded-xl border-2 transition-all duration-200
                    ${
                      formData.environment === env.value
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-green-200 hover:bg-green-50/50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{env.icon}</span>
                    <span className="font-semibold text-sm text-gray-900">{env.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{env.description}</p>
                  {formData.environment === env.value && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Connection Name *
              </label>
              <input
                type="text"
                required
                value={formData.connectionName}
                onChange={(e) => setFormData(prev => ({ ...prev, connectionName: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="My Database Connection"
              />
            </div>

            {/* Database Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Database Name
              </label>
              <input
                type="text"
                value={formData.databaseName}
                onChange={(e) => setFormData(prev => ({ ...prev, databaseName: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="mydb"
              />
            </div>
          </div>

          {/* Host and Port */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Host *
              </label>
              <input
                type="text"
                required
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="localhost"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Port *
              </label>
              <input
                type="number"
                required
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) || defaultPorts[formData.type] }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
              testResult === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-semibold"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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