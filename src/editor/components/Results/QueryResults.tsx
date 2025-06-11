import React, { useMemo } from 'react';
import { 
  Download, 
  FileText, 
  Database, 
  Clock,
  RotateCcw,
  Play,
  AlertCircle
} from 'lucide-react';
import { DataTable, Column } from '../DataTable/DataTable';
import { QueryResult } from '../../../types/database';

interface QueryResultsProps {
  results: QueryResult[];
  isLoading: boolean;
  lastExecuted?: Date;
}

export function QueryResults({ results, isLoading, lastExecuted }: QueryResultsProps) {
  const currentResult = results[0]; // Show the most recent query result

  // Generate columns dynamically from query result
  const columns: Column[] = useMemo(() => {
    if (!currentResult || !currentResult.columns) return [];

    return currentResult.columns.map(col => ({
      key: col.name,
      label: col.name,
      type: col.type.includes('int') || col.type.includes('decimal') || col.type.includes('numeric') ? 'number' :
            col.type.includes('date') || col.type.includes('time') ? 'date' : 'text',
      width: col.name.length > 15 ? '200px' : 'auto',
      align: col.type.includes('int') || col.type.includes('decimal') || col.type.includes('numeric') ? 'right' : 'left',
      render: (value) => {
        if (value === null || value === undefined) {
          return <span className="text-gray-400 italic">NULL</span>;
        }
        
        // Format different data types
        if (col.type.includes('timestamp') || col.type.includes('date')) {
          try {
            const date = new Date(value);
            return (
              <div className="text-sm">
                <div className="text-gray-900 dark:text-gray-100">
                  {date.toLocaleDateString()}
                </div>
                {col.type.includes('timestamp') && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {date.toLocaleTimeString()}
                  </div>
                )}
              </div>
            );
          } catch {
            return <span className="font-mono text-sm">{String(value)}</span>;
          }
        }
        
        if (col.type.includes('decimal') || col.type.includes('numeric')) {
          return <span className="font-mono text-sm">{Number(value).toLocaleString()}</span>;
        }
        
        if (col.type.includes('bool')) {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {value ? 'TRUE' : 'FALSE'}
            </span>
          );
        }
        
        // Handle long text values
        const stringValue = String(value);
        if (stringValue.length > 50) {
          return (
            <div className="max-w-xs">
              <span className="truncate block" title={stringValue}>
                {stringValue}
              </span>
            </div>
          );
        }
        
        return <span>{stringValue}</span>;
      }
    }));
  }, [currentResult]);

  const exportToCSV = () => {
    if (!currentResult) return;
    
    const headers = currentResult.columns.map(col => col.name);
    const csvContent = [
      headers.join(','),
      ...currentResult.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (!currentResult) return;
    
    const jsonContent = JSON.stringify({
      query: currentResult.query,
      columns: currentResult.columns,
      rows: currentResult.rows,
      totalRows: currentResult.totalRows,
      executionTime: currentResult.executionTime,
      timestamp: currentResult.timestamp
    }, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RotateCcw className="animate-spin" size={20} />
          <span className="text-gray-600 dark:text-gray-400">Executing query...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Query Results</h3>
          
          {currentResult && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Database size={12} />
                {currentResult.totalRows} row{currentResult.totalRows !== 1 ? 's' : ''}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                {currentResult.executionTime}ms
              </div>
              
              {lastExecuted && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Play size={12} />
                  {lastExecuted.toLocaleTimeString()}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={!currentResult || currentResult.rows.length === 0}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <FileText size={12} />
            CSV
          </button>
          <button
            onClick={exportToJSON}
            disabled={!currentResult || currentResult.rows.length === 0}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <Database size={12} />
            JSON
          </button>
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-hidden">
        {!currentResult ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Database size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No query results to display</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Run a SQL query to see the data results here</p>
            </div>
          </div>
        ) : currentResult.rows.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-yellow-400" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">Query executed successfully</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">No rows returned</p>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {currentResult.query}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <DataTable
              data={currentResult.rows}
              columns={columns}
              loading={false}
              emptyMessage="No data returned from query"
              pageSize={50}
              showPagination={true}
              className="h-full border-0 rounded-none"
            />
          </div>
        )}
      </div>

      {/* Query Info Footer */}
      {currentResult && (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate max-w-2xl">
              {currentResult.query}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 ml-4 flex-shrink-0">
              Executed at {currentResult.timestamp.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}