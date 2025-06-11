import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Database, 
  Table, 
  Eye, 
  Zap, 
  Hash, 
  RefreshCw,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Columns,
  Key,
  Link
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  activeConnection: string | null;
  isDarkMode: boolean;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'connection' | 'schema' | 'table' | 'view' | 'function' | 'sequence' | 'column';
  icon: React.ComponentType<any>;
  children?: TreeNode[];
  expanded?: boolean;
  metadata?: {
    dataType?: string;
    nullable?: boolean;
    primaryKey?: boolean;
    foreignKey?: boolean;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  activeConnection, 
  isDarkMode 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['conn1', 'schema1']));

  const mockTreeData: TreeNode[] = [
    {
      id: 'conn1',
      name: 'Production DB',
      type: 'connection',
      icon: Database,
      expanded: true,
      children: [
        {
          id: 'schema1',
          name: 'public',
          type: 'schema',
          icon: Database,
          expanded: true,
          children: [
            {
              id: 'table1',
              name: 'users',
              type: 'table',
              icon: Table,
              children: [
                {
                  id: 'col1',
                  name: 'id',
                  type: 'column',
                  icon: Key,
                  metadata: { dataType: 'bigint', nullable: false, primaryKey: true }
                },
                {
                  id: 'col2',
                  name: 'email',
                  type: 'column',
                  icon: Columns,
                  metadata: { dataType: 'varchar(255)', nullable: false }
                },
                {
                  id: 'col3',
                  name: 'created_at',
                  type: 'column',
                  icon: Columns,
                  metadata: { dataType: 'timestamp', nullable: true }
                },
                {
                  id: 'col4',
                  name: 'department_id',
                  type: 'column',
                  icon: Link,
                  metadata: { dataType: 'bigint', nullable: true, foreignKey: true }
                }
              ]
            },
            {
              id: 'table2',
              name: 'orders',
              type: 'table',
              icon: Table,
              children: [
                {
                  id: 'col5',
                  name: 'id',
                  type: 'column',
                  icon: Key,
                  metadata: { dataType: 'bigint', nullable: false, primaryKey: true }
                },
                {
                  id: 'col6',
                  name: 'user_id',
                  type: 'column',
                  icon: Link,
                  metadata: { dataType: 'bigint', nullable: false, foreignKey: true }
                },
                {
                  id: 'col7',
                  name: 'total',
                  type: 'column',
                  icon: Columns,
                  metadata: { dataType: 'decimal(10,2)', nullable: false }
                }
              ]
            },
            {
              id: 'view1',
              name: 'user_orders_view',
              type: 'view',
              icon: Eye
            },
            {
              id: 'func1',
              name: 'calculate_total',
              type: 'function',
              icon: Zap
            },
            {
              id: 'seq1',
              name: 'user_id_seq',
              type: 'sequence',
              icon: Hash
            }
          ]
        },
        {
          id: 'schema2',
          name: 'analytics',
          type: 'schema',
          icon: Database,
          children: [
            {
              id: 'table3',
              name: 'events',
              type: 'table',
              icon: Table
            },
            {
              id: 'table4',
              name: 'metrics',
              type: 'table',
              icon: Table
            }
          ]
        }
      ]
    }
  ];

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const Icon = node.icon;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const paddingLeft = level * 16 + 8;

    const getNodeColor = (type: string) => {
      switch (type) {
        case 'connection': return 'text-blue-600 dark:text-blue-400';
        case 'schema': return 'text-purple-600 dark:text-purple-400';
        case 'table': return 'text-green-600 dark:text-green-400';
        case 'view': return 'text-orange-600 dark:text-orange-400';
        case 'function': return 'text-yellow-600 dark:text-yellow-400';
        case 'sequence': return 'text-pink-600 dark:text-pink-400';
        case 'column': return node.metadata?.primaryKey 
          ? 'text-red-600 dark:text-red-400' 
          : node.metadata?.foreignKey 
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group transition-colors ${
            level > 0 ? 'text-sm' : ''
          }`}
          style={{ paddingLeft }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            <button className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}
          
          <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${getNodeColor(node.type)}`} />
          
          <span className="flex-1 truncate text-gray-900 dark:text-gray-100 text-sm">
            {node.name}
          </span>

          {node.metadata && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.metadata.primaryKey && (
                <Key className="w-3 h-3 text-red-500" title="Primary Key" />
              )}
              {node.metadata.foreignKey && (
                <Link className="w-3 h-3 text-indigo-500" title="Foreign Key" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {node.metadata.dataType}
              </span>
            </div>
          )}

          {!hasChildren && level > 1 && (
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity">
              <MoreHorizontal className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (collapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
        <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Database Explorer
          </h3>
          <div className="flex items-center space-x-1">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Add Connection">
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Filter">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto">
        {!activeConnection ? (
          <div className="p-4 text-center">
            <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a connection to explore
            </p>
          </div>
        ) : (
          <div className="py-2">
            {mockTreeData.map(node => renderTreeNode(node))}
          </div>
        )}
      </div>

      {/* Connection Status */}
      {activeConnection && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Connected to Production DB
            </span>
          </div>
        </div>
      )}
    </div>
  );
};