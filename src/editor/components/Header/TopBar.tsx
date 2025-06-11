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
    <div className="h-12 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] flex items-center px-4 gap-4">
      {/* Connection Selector */}
      <div className="relative">
        <button
          onClick={() => setShowConnectionDropdown(!showConnectionDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-md text-sm font-medium transition-colors"
        >
          <Database size={16} />
          {activeConnection ? activeConnection.label : 'No Connection'}
          <ChevronDown size={14} />
        </button>
        
        {showConnectionDropdown && (
          <div className="absolute top-full left-0 mt-1 w-64 card border-0 z-50">
            <div className="p-2">
              {connections.map(conn => (
                <button
                  key={conn.id}
                  onClick={() => {
                    onConnectionChange(conn);
                    setShowConnectionDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2 ${
                    activeConnection?.id === conn.id ? 'bg-[var(--synchrony-blue)]/10 text-[var(--synchrony-blue)]' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${conn.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="font-medium">{conn.label}</div>
                    <div className="text-xs text-[var(--text-muted)]">{conn.host}:{conn.port}</div>
                  </div>
                </button>
              ))}
              <hr className="my-2 border-[var(--border-primary)]" />
              <button
                onClick={() => {
                  onOpenConnectionManager();
                  setShowConnectionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2 text-[var(--synchrony-blue)]"
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
                ? 'bg-[var(--synchrony-blue)]/10 text-[var(--synchrony-blue)] border border-[var(--synchrony-blue)]/20' 
                : 'hover:bg-[var(--bg-secondary)]'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.title}</span>
            {tab.isDirty && <div className="w-1.5 h-1.5 bg-[var(--synchrony-orange)] rounded-full" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="hover:bg-[var(--bg-tertiary)] rounded p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={onNewTab}
          className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-md transition-colors"
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
            className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          >
            LIMIT {queryLimit}
            <ChevronDown size={12} />
          </button>
          
          {showLimitDropdown && (
            <div className="absolute top-full right-0 mt-1 card border-0 z-50">
              {QUERY_LIMITS.map(limit => (
                <button
                  key={limit}
                  onClick={() => {
                    onQueryLimitChange(limit);
                    setShowLimitDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] ${
                    queryLimit === limit ? 'bg-[var(--synchrony-blue)]/10 text-[var(--synchrony-blue)]' : ''
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
          className="btn-primary flex items-center gap-2 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={14} />
          Run
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-[var(--bg-secondary)] rounded-md transition-colors"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-md transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}