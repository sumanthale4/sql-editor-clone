import React, { useState } from 'react';
import {
  Database,
  Table,
  Eye,
  Zap,
  Hash,
  ChevronRight,
  ChevronDown,
  Plus,
  RefreshCw,
  Key,
  Link
} from 'lucide-react';
import { DatabaseConnection, Schema } from '../../../types/database';

interface DatabaseTreeProps {
  connections: DatabaseConnection[];
  schemas: Schema[];
  activeConnection: DatabaseConnection | null;
  onConnectionSelect: (connection: DatabaseConnection) => void;
}

export function DatabaseTree({ connections, schemas, activeConnection, onConnectionSelect }: DatabaseTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['connections', 'schemas']));
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (nodeId: string) => expandedNodes.has(nodeId);

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Database Explorer</h2>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Connections */}
        <div className="p-2">
          <div
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm font-medium"
            onClick={() => toggleExpanded('connections')}
          >
            {isExpanded('connections') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Database size={16} />
            Connections
          </div>

          {isExpanded('connections') && (
            <div className="ml-4 mt-1">
              {connections.map(conn => (
                <div
                  key={conn.id}
                  className={`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm group ${
                    activeConnection?.id === conn.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                  }`}
                  onClick={() => onConnectionSelect(conn)}
                  onMouseEnter={() => setHoveredItem(conn.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-2 h-2 rounded-full ${conn.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="flex-1 truncate">{conn.label}</span>
                  {hoveredItem === conn.id && (
                    <RefreshCw size={12} className="opacity-50 hover:opacity-100" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schemas (only show if connected) */}
        {activeConnection?.isConnected && (
          <div className="p-2">
            <div
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm font-medium"
              onClick={() => toggleExpanded('schemas')}
            >
              {isExpanded('schemas') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Database size={16} />
              Schemas
            </div>

            {isExpanded('schemas') && (
              <div className="ml-4 mt-1">
                {schemas.map(schema => (
                  <div key={schema.name}>
                    <div
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm"
                      onClick={() => toggleExpanded(`schema-${schema.name}`)}
                    >
                      {isExpanded(`schema-${schema.name}`) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="flex-1">{schema.name}</span>
                    </div>

                    {isExpanded(`schema-${schema.name}`) && (
                      <div className="ml-4">
                        {/* Tables */}
                        <div
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400 group"
                          onClick={() => toggleExpanded(`tables-${schema.name}`)}
                          onMouseEnter={() => setHoveredItem(`tables-${schema.name}`)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {isExpanded(`tables-${schema.name}`) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <Table size={12} />
                          Tables ({schema.tables.length})
                          {hoveredItem === `tables-${schema.name}` && (
                            <Plus size={10} className="ml-auto opacity-50 hover:opacity-100" />
                          )}
                        </div>

                        {isExpanded(`tables-${schema.name}`) && (
                          <div className="ml-4">
                            {schema.tables.map(table => (
                              <div key={table.name}>
                                <div
                                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs group"
                                  onClick={() => toggleExpanded(`table-${schema.name}-${table.name}`)}
                                  onMouseEnter={() => setHoveredItem(`table-${schema.name}-${table.name}`)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                >
                                  {isExpanded(`table-${schema.name}-${table.name}`) ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                  <Table size={10} />
                                  <span className="flex-1">{table.name}</span>
                                  <span className="text-xs text-gray-500">{table.rowCount}</span>
                                </div>

                                {isExpanded(`table-${schema.name}-${table.name}`) && (
                                  <div className="ml-4">
                                    {table.columns.map(column => (
                                      <div
                                        key={column.name}
                                        className="flex items-center gap-2 px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-xs"
                                      >
                                        {column.isPrimaryKey ? (
                                          <Key size={8} className="text-yellow-600" />
                                        ) : column.isForeignKey ? (
                                          <Link size={8} className="text-blue-600" />
                                        ) : (
                                          <div className="w-2 h-2" />
                                        )}
                                        <span className="flex-1">{column.name}</span>
                                        <span className="text-gray-500 text-xs">{column.type}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Views */}
                        <div
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400"
                          onClick={() => toggleExpanded(`views-${schema.name}`)}
                        >
                          {isExpanded(`views-${schema.name}`) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <Eye size={12} />
                          Views ({schema.views.length})
                        </div>

                        {isExpanded(`views-${schema.name}`) && (
                          <div className="ml-4">
                            {schema.views.map(view => (
                              <div
                                key={view.name}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs"
                              >
                                <Eye size={10} />
                                <span>{view.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Functions */}
                        <div
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400"
                          onClick={() => toggleExpanded(`functions-${schema.name}`)}
                        >
                          {isExpanded(`functions-${schema.name}`) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <Zap size={12} />
                          Functions ({schema.functions.length})
                        </div>

                        {isExpanded(`functions-${schema.name}`) && (
                          <div className="ml-4">
                            {schema.functions.map(func => (
                              <div
                                key={func.name}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs"
                              >
                                <Zap size={10} />
                                <span>{func.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sequences */}
                        <div
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400"
                          onClick={() => toggleExpanded(`sequences-${schema.name}`)}
                        >
                          {isExpanded(`sequences-${schema.name}`) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <Hash size={12} />
                          Sequences ({schema.sequences.length})
                        </div>

                        {isExpanded(`sequences-${schema.name}`) && (
                          <div className="ml-4">
                            {schema.sequences.map(seq => (
                              <div
                                key={seq.name}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-xs"
                              >
                                <Hash size={10} />
                                <span className="flex-1">{seq.name}</span>
                                <span className="text-gray-500">{seq.currentValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}