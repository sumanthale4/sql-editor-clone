import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Save, 
  FolderOpen,
  Plus,
  X,
  ChevronDown,
  Database,
  Server,
  Layers
} from 'lucide-react';

interface TopBarProps {
  activeConnection: string | null;
  onConnectionChange: (connection: string | null) => void;
  onQueryRun: (query: string, limit: number) => void;
}

interface QueryTab {
  id: string;
  title: string;
  query: string;
  saved: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeConnection,
  onConnectionChange,
  onQueryRun,
}) => {
  const [tabs, setTabs] = useState<QueryTab[]>([
    { id: '1', title: 'Query 1', query: '', saved: true }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [isRunning, setIsRunning] = useState(false);
  const [limit, setLimit] = useState(1000);

  const mockConnections = [
    { id: 'pg1', name: 'Production DB', type: 'PostgreSQL', icon: Database },
    { id: 'mysql1', name: 'Analytics DB', type: 'MySQL', icon: Server },
    { id: 'oracle1', name: 'Legacy System', type: 'Oracle', icon: Layers },
  ];

  const mockSchemas = ['public', 'analytics', 'reporting', 'staging'];
  const mockDatabases = ['main_db', 'analytics_db', 'test_db'];

  const handleRunQuery = () => {
    setIsRunning(true);
    onQueryRun('SELECT * FROM users', limit);
    setTimeout(() => setIsRunning(false), 1500);
  };

  const addNewTab = () => {
    const newId = Date.now().toString();
    const newTab = {
      id: newId,
      title: `Query ${tabs.length + 1}`,
      query: '',
      saved: true
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Connection and Database Selectors */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Connection Selector */}
          <div className="relative">
            <select
              value={activeConnection || ''}
              onChange={(e) => onConnectionChange(e.target.value || null)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Connection</option>
              {mockConnections.map(conn => (
                <option key={conn.id} value={conn.id}>
                  {conn.name} ({conn.type})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Database Selector */}
          <div className="relative">
            <select
              disabled={!activeConnection}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Database</option>
              {mockDatabases.map(db => (
                <option key={db} value={db}>{db}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Schema Selector */}
          <div className="relative">
            <select
              disabled={!activeConnection}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Schema</option>
              {mockSchemas.map(schema => (
                <option key={schema} value={schema}>{schema}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Query Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Limit:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={5000}>5000</option>
              <option value={-1}>No Limit</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleRunQuery}
              disabled={!activeConnection || isRunning}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </>
              )}
            </button>

            <button
              disabled={!isRunning}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
              title="Stop Query"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" title="Save Query">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" title="Open Query">
              <FolderOpen className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Query Tabs */}
      <div className="flex items-center">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-sm font-medium">{tab.title}</span>
              {!tab.saved && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addNewTab}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-l border-gray-200 dark:border-gray-700 transition-colors"
          title="New Query Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};