import React from 'react';
import { DatabaseType } from '../types/Connection';
import { Database, Server, Layers } from 'lucide-react';

interface DatabaseTabsProps {
  activeTab: DatabaseType;
  onTabChange: (tab: DatabaseType) => void;
  connectionCounts: Record<DatabaseType, number>;
}

const tabConfig = {
  PostgreSQL: {
    icon: Database,
  },
  MySQL: {
    icon: Server,
  },
  Oracle: {
    icon: Layers,
  },
};

export const DatabaseTabs: React.FC<DatabaseTabsProps> = ({
  activeTab,
  onTabChange,
  connectionCounts,
}) => {
  return (
    <div className="flex space-x-1 p-1 bg-[var(--bg-secondary)] rounded-lg shadow-[0_2px_8px_var(--shadow-light)]">
      {(Object.keys(tabConfig) as DatabaseType[]).map((type) => {
        const Icon = tabConfig[type].icon;
        const isActive = activeTab === type;
        const count = connectionCounts[type];

        return (
          <button
            key={type}
            onClick={() => onTabChange(type)}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 min-w-0 flex-1
              ${isActive
                ? 'bg-[var(--synchrony-blue)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--synchrony-blue)]'}
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{type}</span>
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--synchrony-teal)] text-white'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};