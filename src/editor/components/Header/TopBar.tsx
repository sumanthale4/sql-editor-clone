import { useState } from 'react';
import { 
  Play, 
  Plus, 
  Settings, 
  Sun, 
  Moon, 
  Database,
  ChevronDown,
  X
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { DatabaseConnection, SqlTab } from '../../../types/database';

interface TopBarProps {
  connections: DatabaseConnection[];
  activeConnection: DatabaseConnection | null;
  tabs: SqlTab[];
  activeTabId: string | null;
  onConnectionChange: (connection: DatabaseConnection) => void;
  onRunQuery: () => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
  onTabChange: (tabId: string) => void;
  onOpenConnectionManager: () => void;
  queryLimit: number;
  onQueryLimitChange: (limit: number) => void;
}

const QUERY_LIMITS = [100, 500, 1000, 5000, 10000];

export function TopBar({
  connections,
  activeConnection,
  tabs,
  activeTabId,
  onConnectionChange,
  onRunQuery,
  onNewTab,
  onCloseTab,
  onTabChange,
  onOpenConnectionManager,
  queryLimit,
  onQueryLimitChange
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showConnectionDropdown, setShowConnectionDropdown] = useState(false);
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);

  return (
    <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4">
      {/* Connection Selector */}
      <div className="relative">
        <button
          onClick={() => setShowConnectionDropdown(!showConnectionDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
        >
          <Database size={16} />
          {activeConnection ? activeConnection.label : 'No Connection'}
          <ChevronDown size={14} />
        </button>
        
        {showConnectionDropdown && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div className="p-2">
              {connections.map(conn => (
                <button
                  key={conn.id}
                  onClick={() => {
                    onConnectionChange(conn);
                    setShowConnectionDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                    activeConnection?.id === conn.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${conn.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="font-medium">{conn.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{conn.host}:{conn.port}</div>
                  </div>
                </button>
              ))}
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {
                  onOpenConnectionManager();
                  setShowConnectionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400"
              >
                <Plus size={16} />
                Add Connection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex-1 flex items-center gap-1">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              tab.isActive 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.title}</span>
            {tab.isDirty && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={onNewTab}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="New Tab"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Query Limit */}
        <div className="relative">
          <button
            onClick={() => setShowLimitDropdown(!showLimitDropdown)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            LIMIT {queryLimit}
            <ChevronDown size={12} />
          </button>
          
          {showLimitDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              {QUERY_LIMITS.map(limit => (
                <button
                  key={limit}
                  onClick={() => {
                    onQueryLimitChange(limit);
                    setShowLimitDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    queryLimit === limit ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  LIMIT {limit}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run Query */}
        <button
          onClick={onRunQuery}
          disabled={!activeConnection?.isConnected}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
        >
          <Play size={14} />
          Run
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}