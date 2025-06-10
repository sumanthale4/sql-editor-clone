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
    <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg shadow-inner">
      {(Object.keys(tabConfig) as DatabaseType[]).map((type) => {
        const Icon = tabConfig[type].icon;
        const isActive = activeTab === type;
        const count = connectionCounts[type];

        return (
          <button
            key={type}
            onClick={() => onTabChange(type)}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 min-w-0 flex-1
              ${isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-200'}
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{type}</span>
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-700'}
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
