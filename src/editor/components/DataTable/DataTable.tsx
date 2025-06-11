import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  X, 
  Search,
  Calendar,
  Hash,
  Type,
  MoreHorizontal,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  options?: string[]; // For select type filters
  render?: (value: any, row: any) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
  priority: number;
}

export interface FilterConfig {
  key: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  onRowClick?: (row: any) => void;
  onSelectionChange?: (selectedRows: any[]) => void;
  className?: string;
}

export function DataTable({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  pageSize = 50,
  showPagination = true,
  onRowClick,
  onSelectionChange,
  className = ""
}: DataTableProps) {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.key];
        const filterValue = filter.value.toLowerCase();

        if (!filterValue) return true;

        switch (filter.type) {
          case 'text':
            return String(value).toLowerCase().includes(filterValue);
          case 'number':
            return String(value).includes(filter.value);
          case 'date':
            return String(value).includes(filter.value);
          case 'select':
            return String(value).toLowerCase() === filterValue;
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (sortConfigs.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sortConfig of sortConfigs.sort((x, y) => x.priority - y.priority)) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        let comparison = 0;
        
        if (aValue === null || aValue === undefined) comparison = 1;
        else if (bValue === null || bValue === undefined) comparison = -1;
        else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        if (comparison !== 0) {
          return sortConfig.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }, [filteredData, sortConfigs]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    setSortConfigs(prev => {
      const existingIndex = prev.findIndex(config => config.key === columnKey);
      
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (existing.direction === 'asc') {
          // Change to desc
          return prev.map((config, index) => 
            index === existingIndex 
              ? { ...config, direction: 'desc' as const }
              : config
          );
        } else {
          // Remove sort
          return prev.filter((_, index) => index !== existingIndex);
        }
      } else {
        // Add new sort
        return [...prev, { key: columnKey, direction: 'asc' as const, priority: prev.length }];
      }
    });
  }, []);

  // Handle filtering
  const handleFilter = useCallback((columnKey: string, value: string, type: FilterConfig['type']) => {
    setFilters(prev => {
      const existingIndex = prev.findIndex(filter => filter.key === columnKey);
      
      if (value === '') {
        // Remove filter if empty
        return prev.filter((_, index) => index !== existingIndex);
      }
      
      const newFilter = { key: columnKey, value, type };
      
      if (existingIndex >= 0) {
        // Update existing filter
        return prev.map((filter, index) => 
          index === existingIndex ? newFilter : filter
        );
      } else {
        // Add new filter
        return [...prev, newFilter];
      }
    });
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters([]);
    setCurrentPage(1);
  }, []);

  // Handle row selection
  const handleRowSelection = useCallback((rowId: string, isSelected: boolean) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(rowId);
      } else {
        newSelection.delete(rowId);
      }
      
      if (onSelectionChange) {
        const selectedData = data.filter(row => newSelection.has(row.id || row.key || String(row)));
        onSelectionChange(selectedData);
      }
      
      return newSelection;
    });
  }, [data, onSelectionChange]);

  // Select all rows
  const handleSelectAll = useCallback(() => {
    const allIds = paginatedData.map(row => row.id || row.key || String(row));
    const isAllSelected = allIds.every(id => selectedRows.has(id));
    
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (isAllSelected) {
        allIds.forEach(id => newSelection.delete(id));
      } else {
        allIds.forEach(id => newSelection.add(id));
      }
      return newSelection;
    });
  }, [paginatedData, selectedRows]);

  // Get sort indicator for column
  const getSortIndicator = (columnKey: string) => {
    const sortConfig = sortConfigs.find(config => config.key === columnKey);
    if (!sortConfig) return <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50" />;
    
    return sortConfig.direction === 'asc' 
      ? <SortAsc size={14} className="text-blue-600 dark:text-blue-400" />
      : <SortDesc size={14} className="text-blue-600 dark:text-blue-400" />;
  };

  // Get filter icon for column
  const getFilterIcon = (column: Column) => {
    switch (column.type) {
      case 'number': return <Hash size={12} />;
      case 'date': return <Calendar size={12} />;
      case 'select': return <Filter size={12} />;
      default: return <Type size={12} />;
    }
  };

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Results
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sortedData.length} row{sortedData.length !== 1 ? 's' : ''}
              {filters.length > 0 && ` (filtered from ${data.length})`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                showFilters 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {columns.filter(col => col.filterable !== false).map(column => (
              <div key={column.key} className="relative">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {column.label}
                </label>
                {column.type === 'select' && column.options ? (
                  <select
                    value={filters.find(f => f.key === column.key)?.value || ''}
                    onChange={(e) => handleFilter(column.key, e.target.value, column.type)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All</option>
                    {column.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                      placeholder={`Filter ${column.label.toLowerCase()}...`}
                      value={filters.find(f => f.key === column.key)?.value || ''}
                      onChange={(e) => handleFilter(column.key, e.target.value, column.type)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="absolute left-2.5 top-2.5 text-gray-400">
                      {getFilterIcon(column)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
              {filters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Clear filters to see all data
                </button>
              )}
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                {onSelectionChange && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && paginatedData.every(row => 
                        selectedRows.has(row.id || row.key || String(row))
                      )}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                      column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 group' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className={`flex items-center gap-2 ${
                      column.align === 'center' ? 'justify-center' : 
                      column.align === 'right' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{column.label}</span>
                      {column.sortable !== false && getSortIndicator(column.key)}
                    </div>
                  </th>
                ))}
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((row, index) => {
                const rowId = row.id || row.key || String(index);
                const isSelected = selectedRows.has(rowId);
                
                return (
                  <tr
                    key={rowId}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectionChange && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelection(rowId, e.target.checked);
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 ${
                          column.align === 'center' ? 'text-center' : 
                          column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {column.render ? column.render(row[column.key], row) : (
                          <span className="truncate block max-w-xs" title={String(row[column.key])}>
                            {row[column.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}