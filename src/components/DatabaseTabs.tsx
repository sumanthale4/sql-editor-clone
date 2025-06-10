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
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    activeBg: 'bg-blue-600',
  },
  MySQL: {
    icon: Server,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    activeBg: 'bg-orange-600',
  },
  Oracle: {
    icon: Layers,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    activeBg: 'bg-red-600',
  },
};

export const DatabaseTabs: React.FC<DatabaseTabsProps> = ({
  activeTab,
  onTabChange,
  connectionCounts,
}) => {
  return (
    <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
      {(Object.keys(tabConfig) as DatabaseType[]).map((type) => {
        const config = tabConfig[type];
        const Icon = config.icon;
        const isActive = activeTab === type;
        const count = connectionCounts[type];

        return (
          <button
            key={type}
            onClick={() => onTabChange(type)}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-md font-medium text-sm
              transition-all duration-200 ease-in-out min-w-0 flex-1
              ${
                isActive
                  ? `${config.activeBg} text-white shadow-sm`
                  : `text-gray-600 hover:${config.bgColor} hover:${config.color}`
              }
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{type}</span>
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                  ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
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