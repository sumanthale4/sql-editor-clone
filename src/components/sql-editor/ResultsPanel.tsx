import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  FileText,
  Database,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ResultsPanelProps {
  results: any[];
  queryInfo: {
    runtime: number;
    timestamp: string;
    rowCount: number;
  } | null;
  isDarkMode: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  results, 
  queryInfo, 
  isDarkMode 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const totalPages = Math.ceil(results.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, results.length);
  const currentResults = results.slice(startIndex, endIndex);

  const columns = results.length > 0 ? Object.keys(results[0]) : [];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    
    const headers = Object.keys(results[0]).join(',');
    const rows = results.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (results.length === 0) return;
    
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    if (results.length === 0) return;
    
    const headers = Object.keys(results[0]).join('\t');
    const rows = results.map(row => Object.values(row).join('\t'));
    const text = [headers, ...rows].join('\n');
    
    navigator.clipboard.writeText(text);
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">NULL</span>;
    }
    if (typeof value === 'boolean') {
      return <span className={value ? 'text-green-600' : 'text-red-600'}>{value.toString()}</span>;
    }
    if (typeof value === 'string' && value.length > 50) {
      return (
        <span title={value} className="truncate block max-w-xs">
          {value.substring(0, 50)}...
        </span>
      );
    }
    return value?.toString() || '';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Results Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Query Results
          </h3>
          
          {queryInfo && (
            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{queryInfo.rowCount} rows</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{queryInfo.runtime}ms</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{new Date(queryInfo.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <button
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />

          <button
            onClick={handleCopyResults}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Copy Results"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            <FileText className="w-3 h-3" />
            <span>JSON</span>
          </button>

          <button
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-auto">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Database className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Results</p>
            <p className="text-sm">Run a query to see results here</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-750 sticky top-0">
              <tr>
                <th className="w-8 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(new Set(Array.from({ length: results.length }, (_, i) => i)));
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                  />
                </th>
                {columns.map(column => (
                  <th
                    key={column}
                    className="px-3 py-2 text-left font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column}</span>
                      {sortColumn === column && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="w-3 h-3" /> : 
                          <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentResults.map((row, index) => (
                <tr
                  key={startIndex + index}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                    selectedRows.has(startIndex + index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600"
                      checked={selectedRows.has(startIndex + index)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedRows);
                        if (e.target.checked) {
                          newSelected.add(startIndex + index);
                        } else {
                          newSelected.delete(startIndex + index);
                        }
                        setSelectedRows(newSelected);
                      }}
                    />
                  </td>
                  {columns.map(column => (
                    <td
                      key={column}
                      className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {formatValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {results.length > 0 && (
        <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {startIndex + 1}-{endIndex} of {results.length} rows
            </span>
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-900 dark:text-white"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};