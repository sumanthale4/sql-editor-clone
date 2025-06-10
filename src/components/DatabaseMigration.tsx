import React, { useState } from 'react';
import { 
  Database, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  Download, 
  RefreshCw,
  Clock,
  Shield,
  Zap,
  Settings,
  Eye,
  FileText,
  Users,
  Key,
  Link,
  Table,
  GitBranch,
  Layers,
  Code,
  Hash,
  Lock
} from 'lucide-react';

type DatabaseType = 'MySQL' | 'PostgreSQL' | 'SQL Server' | 'Oracle' | 'MongoDB';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'failed';
type SupportLevel = 'supported' | 'partial' | 'unsupported';
type MigrationStatus = 'idle' | 'running' | 'completed' | 'failed';

interface DatabaseConnection {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  status: ConnectionStatus;
}

interface MigrationComponent {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: React.ComponentType<any>;
  support: SupportLevel;
  selected: boolean;
  warning?: string;
}

const defaultPorts = {
  MySQL: 3306,
  PostgreSQL: 5432,
  'SQL Server': 1433,
  Oracle: 1521,
  MongoDB: 27017,
};
interface DatabaseMigrationProps {
  setActiveView: (view: "connections" | "migration") => void;
}

export const DatabaseMigration: React.FC<DatabaseMigrationProps> = ({
  setActiveView
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sourceDb, setSourceDb] = useState<DatabaseConnection>({
    type: 'MySQL',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: '',
    status: 'disconnected'
  });
  
  const [targetDb, setTargetDb] = useState<DatabaseConnection>({
    type: 'Oracle',
    host: 'localhost',
    port: 1521,
    username: '',
    password: '',
    database: '',
    status: 'disconnected'
  });

  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>('idle');
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [showPassword, setShowPassword] = useState({ source: false, target: false });

  const [components, setComponents] = useState<MigrationComponent[]>([
    { id: 'tables', name: 'Tables', description: 'Database tables with structure and constraints', count: 14, icon: Table, support: 'supported', selected: true },
    { id: 'views', name: 'Views', description: 'Database views and materialized views', count: 4, icon: Eye, support: 'supported', selected: true },
    { id: 'indexes', name: 'Indexes', description: 'Primary, unique, and composite indexes', count: 23, icon: Hash, support: 'supported', selected: true },
    { id: 'triggers', name: 'Triggers', description: 'Database triggers and event handlers', count: 3, icon: Zap, support: 'partial', selected: true, warning: 'Syntax differences may require manual adjustment' },
    { id: 'procedures', name: 'Stored Procedures', description: 'Stored procedures and functions', count: 6, icon: Code, support: 'partial', selected: false, warning: 'MySQL procedures need Oracle PL/SQL conversion' },
    { id: 'functions', name: 'Functions', description: 'User-defined functions', count: 8, icon: GitBranch, support: 'partial', selected: false, warning: 'Function syntax varies between databases' },
    { id: 'sequences', name: 'Sequences', description: 'Auto-increment sequences', count: 5, icon: RefreshCw, support: 'supported', selected: true },
    { id: 'constraints', name: 'Constraints', description: 'Check constraints and rules', count: 12, icon: Shield, support: 'supported', selected: true },
    { id: 'users', name: 'Users & Roles', description: 'Database users and permission roles', count: 7, icon: Users, support: 'unsupported', selected: false, warning: 'User management differs significantly between systems' },
    { id: 'data', name: 'Table Data', description: 'Actual row data from tables', count: 125000, icon: FileText, support: 'supported', selected: true },
  ]);

  const steps = [
    { id: 1, title: 'Select Databases', description: 'Choose source and target databases' },
    { id: 2, title: 'Connect & Verify', description: 'Test database connections' },
    { id: 3, title: 'Select Components', description: 'Choose what to migrate' },
    { id: 4, title: 'Review & Execute', description: 'Review plan and start migration' },
  ];

  const handleDatabaseTypeChange = (type: 'source' | 'target', dbType: DatabaseType) => {
    const db = type === 'source' ? sourceDb : targetDb;
    const updatedDb = {
      ...db,
      type: dbType,
      port: defaultPorts[dbType],
      status: 'disconnected' as ConnectionStatus
    };
    
    if (type === 'source') {
      setSourceDb(updatedDb);
    } else {
      setTargetDb(updatedDb);
    }
  };

  const handleConnect = async (type: 'source' | 'target') => {
    const db = type === 'source' ? sourceDb : targetDb;
    const setDb = type === 'source' ? setSourceDb : setTargetDb;
    
    setDb({ ...db, status: 'connecting' });
    
    // Simulate connection attempt
    setTimeout(() => {
      const success = db.host && db.username && db.database;
      setDb({ ...db, status: success ? 'connected' : 'failed' });
    }, 2000);
  };

  const toggleComponent = (id: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, selected: !comp.selected } : comp
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = components.every(comp => comp.selected);
    setComponents(prev => prev.map(comp => ({ ...comp, selected: !allSelected })));
  };

  const startMigration = () => {
    setMigrationStatus('running');
    setMigrationProgress(0);
    
    // Simulate migration progress
    const interval = setInterval(() => {
      setMigrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setMigrationStatus('completed');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const getSupportBadge = (support: SupportLevel) => {
    switch (support) {
      case 'supported':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Supported</span>;
      case 'partial':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Partial</span>;
      case 'unsupported':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Not Supported</span>;
    }
  };

  const getConnectionStatus = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <span className="inline-flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" />Connected</span>;
      case 'connecting':
        return <span className="inline-flex items-center text-blue-600"><RefreshCw className="w-4 h-4 mr-1 animate-spin" />Connecting...</span>;
      case 'failed':
        return <span className="inline-flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" />Failed</span>;
      default:
        return <span className="inline-flex items-center text-gray-500"><Database className="w-4 h-4 mr-1" />Not Connected</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Database Migration Studio
              </h1>
              <p className="text-gray-600 mt-1">Seamlessly migrate between database systems with precision control</p>
            </div>
          </div>

        <button
          onClick={() => setActiveView("connections")}
          className={` absolute top-3 right-3 flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex-1 justify-center ${"bg-indigo-600 text-white shadow"}`}
        >
          <Database className="w-4 h-4" />
          <span>Connections</span>
        </button>
          {/* Progress Steps */}
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`font-semibold text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`w-5 h-5 mx-4 ${currentStep > step.id ? 'text-blue-600' : 'text-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Source and Target Databases</h2>
                <p className="text-gray-600">Choose the databases you want to migrate from and to</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Source Database */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Source Database</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Type</label>
                    <select 
                      value={sourceDb.type}
                      onChange={(e) => handleDatabaseTypeChange('source', e.target.value as DatabaseType)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {['MySQL', 'PostgreSQL', 'SQL Server', 'MongoDB'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
                      <input 
                        type="text" 
                        value={sourceDb.host}
                        onChange={(e) => setSourceDb({...sourceDb, host: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                      <input 
                        type="number" 
                        value={sourceDb.port}
                        onChange={(e) => setSourceDb({...sourceDb, port: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
                    <input 
                      type="text" 
                      value={sourceDb.database}
                      onChange={(e) => setSourceDb({...sourceDb, database: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="database_name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input 
                        type="text" 
                        value={sourceDb.username}
                        onChange={(e) => setSourceDb({...sourceDb, username: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword.source ? "text" : "password"}
                          value={sourceDb.password}
                          onChange={(e) => setSourceDb({...sourceDb, password: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({...prev, source: !prev.source}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Database */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Database className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Target Database</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Type</label>
                    <select 
                      value={targetDb.type}
                      onChange={(e) => handleDatabaseTypeChange('target', e.target.value as DatabaseType)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {['Oracle', 'PostgreSQL', 'MySQL', 'SQL Server'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
                      <input 
                        type="text" 
                        value={targetDb.host}
                        onChange={(e) => setTargetDb({...targetDb, host: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                      <input 
                        type="number" 
                        value={targetDb.port}
                        onChange={(e) => setTargetDb({...targetDb, port: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
                    <input 
                      type="text" 
                      value={targetDb.database}
                      onChange={(e) => setTargetDb({...targetDb, database: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="database_name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input 
                        type="text" 
                        value={targetDb.username}
                        onChange={(e) => setTargetDb({...targetDb, username: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword.target ? "text" : "password"}
                          value={targetDb.password}
                          onChange={(e) => setTargetDb({...targetDb, password: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({...prev, target: !prev.target}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Database Connections</h2>
                <p className="text-gray-600">Verify connectivity to both source and target databases</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Source Connection Status */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Source: {sourceDb.type}</h3>
                        <p className="text-sm text-gray-600">{sourceDb.host}:{sourceDb.port}</p>
                      </div>
                    </div>
                    {getConnectionStatus(sourceDb.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>Database: {sourceDb.database || 'Not specified'}</div>
                    <div>User: {sourceDb.username || 'Not specified'}</div>
                  </div>

                  <button
                    onClick={() => handleConnect('source')}
                    disabled={sourceDb.status === 'connecting'}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {sourceDb.status === 'connecting' ? 'Testing Connection...' : 'Test Connection'}
                  </button>
                </div>

                {/* Target Connection Status */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Target: {targetDb.type}</h3>
                        <p className="text-sm text-gray-600">{targetDb.host}:{targetDb.port}</p>
                      </div>
                    </div>
                    {getConnectionStatus(targetDb.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>Database: {targetDb.database || 'Not specified'}</div>
                    <div>User: {targetDb.username || 'Not specified'}</div>
                  </div>

                  <button
                    onClick={() => handleConnect('target')}
                    disabled={targetDb.status === 'connecting'}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {targetDb.status === 'connecting' ? 'Testing Connection...' : 'Test Connection'}
                  </button>
                </div>
              </div>

              {/* Migration Path Info */}
              {sourceDb.status === 'connected' && targetDb.status === 'connected' && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-900">{sourceDb.type}</span>
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-indigo-900">{targetDb.type}</span>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-indigo-800">
                    ✅ Both databases are connected successfully. Ready to proceed with migration planning.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Migration Components</h2>
                  <p className="text-gray-600">Choose which database objects to migrate from {sourceDb.type} to {targetDb.type}</p>
                </div>
                
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{components.every(c => c.selected) ? 'Deselect All' : 'Select All'}</span>
                </button>
              </div>

              <div className="grid gap-4">
                {components.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        component.selected 
                          ? 'border-indigo-300 bg-indigo-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => toggleComponent(component.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={component.selected}
                            onChange={() => toggleComponent(component.id)}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <Icon className={`w-6 h-6 ${component.selected ? 'text-indigo-600' : 'text-gray-400'}`} />
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">{component.name}</h3>
                              <span className="text-sm text-gray-500">({component.count.toLocaleString()})</span>
                              {getSupportBadge(component.support)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                            {component.warning && (
                              <div className="flex items-center space-x-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                <p className="text-sm text-yellow-800">{component.warning}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {component.warning && (
                          <Info className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Migration Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Selected Components:</span>
                    <div className="font-semibold text-indigo-900">{components.filter(c => c.selected).length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Objects:</span>
                    <div className="font-semibold text-indigo-900">
                      {components.filter(c => c.selected).reduce((sum, c) => sum + c.count, 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fully Supported:</span>
                    <div className="font-semibold text-green-700">
                      {components.filter(c => c.selected && c.support === 'supported').length}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Need Review:</span>
                    <div className="font-semibold text-yellow-700">
                      {components.filter(c => c.selected && c.support !== 'supported').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Migration Plan</h2>
                <p className="text-gray-600">Review your migration configuration and execute the migration</p>
              </div>

              {migrationStatus === 'idle' && (
                <>
                  {/* Migration Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-600" />
                        Migration Path
                      </h3>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <div className="font-semibold text-blue-900">{sourceDb.type}</div>
                          <div className="text-sm text-blue-700">{sourceDb.host}</div>
                        </div>
                        <ArrowRight className="w-8 h-8 text-blue-600" />
                        <div className="text-center">
                          <div className="font-semibold text-blue-900">{targetDb.type}</div>
                          <div className="text-sm text-blue-700">{targetDb.host}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        Estimated Time
                      </h3>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">~45 minutes</div>
                        <div className="text-sm text-green-700">Based on selected components</div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Components Summary */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Selected Components ({components.filter(c => c.selected).length})</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid gap-3">
                        {components.filter(c => c.selected).map(component => {
                          const Icon = component.icon;
                          return (
                            <div key={component.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">{component.name}</span>
                                <span className="text-sm text-gray-500">({component.count.toLocaleString()})</span>
                              </div>
                              {getSupportBadge(component.support)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {components.some(c => c.selected && c.warning) && (
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        <h3 className="font-semibold text-yellow-900">Important Considerations</h3>
                      </div>
                      <div className="space-y-2">
                        {components.filter(c => c.selected && c.warning).map(component => (
                          <div key={component.id} className="text-sm text-yellow-800">
                            <strong>{component.name}:</strong> {component.warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Migration Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={startMigration}
                      className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Play className="w-6 h-6" />
                      <span>Start Migration</span>
                    </button>
                  </div>
                </>
              )}

              {migrationStatus === 'running' && (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Migration Progress</h3>
                      <span className="text-sm text-gray-600">{Math.round(migrationProgress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${migrationProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Live Log */}
                  <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div>✅ Connected to source database ({sourceDb.type})</div>
                      <div>✅ Connected to target database ({targetDb.type})</div>
                      <div>🔄 Analyzing source schema...</div>
                      <div>✅ Schema analysis complete</div>
                      <div>🔄 Creating target schema...</div>
                      <div>✅ Tables created (14/14)</div>
                      <div>🔄 Migrating indexes...</div>
                      <div>✅ Indexes migrated (23/23)</div>
                      <div>🔄 Migrating data...</div>
                      <div className="text-yellow-400">⚠️  Large table detected: processing in batches...</div>
                      <div>🔄 Processing batch 1/5...</div>
                      {migrationProgress > 80 && <div>🔄 Processing batch 2/5...</div>}
                    </div>
                  </div>
                </div>
              )}

              {migrationStatus === 'completed' && (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Migration Completed Successfully!</h3>
                    <p className="text-green-700">All selected components have been migrated to your target database.</p>
                  </div>

                  {/* Migration Summary */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">127,456</div>
                      <div className="text-sm text-gray-600">Objects Migrated</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">42m 18s</div>
                      <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      <Download className="w-5 h-5" />
                      <span>Download Report</span>
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentStep(1);
                        setMigrationStatus('idle');
                        setMigrationProgress(0);
                      }}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>New Migration</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || migrationStatus === 'running'}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span>Previous</span>
            </button>

            {currentStep < 4 && (
              <button
                onClick={() => {
                  if (currentStep === 2 && (sourceDb.status !== 'connected' || targetDb.status !== 'connected')) {
                    return;
                  }
                  setCurrentStep(Math.min(4, currentStep + 1));
                }}
                disabled={
                  (currentStep === 2 && (sourceDb.status !== 'connected' || targetDb.status !== 'connected')) ||
                  (currentStep === 3 && components.filter(c => c.selected).length === 0)
                }
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};