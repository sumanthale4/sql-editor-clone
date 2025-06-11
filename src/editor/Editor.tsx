import  { useState, useCallback } from 'react';
import { TopBar } from './components/Header/TopBar';
import { DatabaseTree } from './components/Sidebar/DatabaseTree';
import { SqlEditor } from './components/Editor/SqlEditor';
import { QueryResults } from './components/Results/QueryResults';
import { ConnectionManager } from './components/Modals/ConnectionManager';
import { ResizableHandle } from './components/Layout/ResizableHandle';
import { useResizable } from './hooks/useResizable';
import { DatabaseConnection, SqlTab, QueryResult } from '../types/database';
import { mockConnections, mockSchemas, mockQueryResults } from '../data/mockData';

export default function Editor() {
  // State
  const [connections, setConnections] = useState<DatabaseConnection[]>(mockConnections);
  const [activeConnection, setActiveConnection] = useState<DatabaseConnection | null>(mockConnections[0]);
  const [tabs, setTabs] = useState<SqlTab[]>([
    {
      id: 'tab-1',
      title: 'Query 1',
      content: 'SELECT * FROM users WHERE created_at > \'2024-01-01\' LIMIT 10;',
      isActive: true,
      isDirty: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [queryResults, setQueryResults] = useState<QueryResult[]>(mockQueryResults);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [lastQueryExecuted, setLastQueryExecuted] = useState<Date>(new Date());
  const [showConnectionManager, setShowConnectionManager] = useState(false);
  const [queryLimit, setQueryLimit] = useState(1000);

  // Resizable panels
  const sidebarResize = useResizable({
    initialSize: 280,
    minSize: 200,
    maxSize: 500,
    direction: 'horizontal'
  });

  const resultsResize = useResizable({
    initialSize: 300,
    minSize: 200,
    maxSize: 600,
    direction: 'vertical'
  });

  // Handlers
  const handleConnectionChange = useCallback((connection: DatabaseConnection) => {
    setActiveConnection(connection);
  }, []);

  const handleRunQuery = useCallback(async () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeConnection?.isConnected) return;

    setIsQueryLoading(true);
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different query results based on the query content
    const query = activeTab.content.toLowerCase().trim();
    let mockResult: QueryResult;

    if (query.includes('select') && query.includes('users')) {
      // Return user data
      mockResult = mockQueryResults[0];
    } else if (query.includes('select') && query.includes('orders')) {
      // Return order data
      mockResult = {
        columns: [
          { name: 'id', type: 'integer' },
          { name: 'user_id', type: 'integer' },
          { name: 'total_amount', type: 'decimal' },
          { name: 'status', type: 'varchar' },
          { name: 'created_at', type: 'timestamp' }
        ],
        rows: [
          { id: 1, user_id: 1, total_amount: 99.99, status: 'completed', created_at: '2024-01-20T10:30:00Z' },
          { id: 2, user_id: 2, total_amount: 149.50, status: 'pending', created_at: '2024-01-20T11:15:00Z' },
          { id: 3, user_id: 1, total_amount: 75.25, status: 'completed', created_at: '2024-01-20T14:22:00Z' },
          { id: 4, user_id: 3, total_amount: 200.00, status: 'shipped', created_at: '2024-01-20T16:45:00Z' },
          { id: 5, user_id: 2, total_amount: 89.99, status: 'completed', created_at: '2024-01-21T09:30:00Z' }
        ],
        totalRows: 5,
        executionTime: Math.floor(Math.random() * 100) + 20,
        query: activeTab.content,
        timestamp: new Date()
      };
    } else if (query.includes('select') && query.includes('products')) {
      // Return product data
      mockResult = {
        columns: [
          { name: 'id', type: 'integer' },
          { name: 'name', type: 'varchar' },
          { name: 'price', type: 'decimal' },
          { name: 'description', type: 'text' },
          { name: 'created_at', type: 'timestamp' }
        ],
        rows: [
          { id: 1, name: 'Laptop Pro', price: 1299.99, description: 'High-performance laptop for professionals', created_at: '2024-01-15T10:00:00Z' },
          { id: 2, name: 'Wireless Mouse', price: 29.99, description: 'Ergonomic wireless mouse with precision tracking', created_at: '2024-01-15T10:30:00Z' },
          { id: 3, name: 'Mechanical Keyboard', price: 149.99, description: 'RGB mechanical keyboard with blue switches', created_at: '2024-01-15T11:00:00Z' },
          { id: 4, name: 'Monitor 4K', price: 399.99, description: '27-inch 4K UHD monitor with HDR support', created_at: '2024-01-15T11:30:00Z' },
          { id: 5, name: 'USB-C Hub', price: 79.99, description: 'Multi-port USB-C hub with HDMI and ethernet', created_at: '2024-01-15T12:00:00Z' }
        ],
        totalRows: 5,
        executionTime: Math.floor(Math.random() * 100) + 20,
        query: activeTab.content,
        timestamp: new Date()
      };
    } else {
      // Default empty result for non-SELECT queries or unknown tables
      mockResult = {
        columns: [],
        rows: [],
        totalRows: 0,
        executionTime: Math.floor(Math.random() * 50) + 10,
        query: activeTab.content,
        timestamp: new Date()
      };
    }

    setQueryResults([mockResult]);
    setIsQueryLoading(false);
    setLastQueryExecuted(new Date());
    
    console.log('Executing query:', activeTab.content);
  }, [tabs, activeTabId, activeConnection]);

  const handleNewTab = useCallback(() => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: SqlTab = {
      id: newTabId,
      title: `Query ${tabs.length + 1}`,
      content: '',
      isActive: false,
      isDirty: false
    };

    setTabs(prev => prev.map(t => ({ ...t, isActive: false })).concat({ ...newTab, isActive: true }));
    setActiveTabId(newTabId);
  }, [tabs.length]);

  const handleCloseTab = useCallback((tabId: string) => {
    if (tabs.length === 1) return; // Don't close the last tab

    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    
    if (activeTabId === tabId) {
      // Set the previous tab as active, or the first one if closing the first tab
      const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
      const newActiveTab = newTabs[newActiveIndex];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
        newTabs[newActiveIndex] = { ...newActiveTab, isActive: true };
      }
    }

    setTabs(newTabs);
  }, [tabs, activeTabId]);

  const handleTabChange = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === tabId })));
    setActiveTabId(tabId);
  }, []);

  const handleEditorChange = useCallback((value: string) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, content: value, isDirty: t.content !== value }
        : t
    ));
  }, [activeTabId]);

  const handleSaveConnection = useCallback((connectionData: Omit<DatabaseConnection, 'id'>) => {
    const newConnection: DatabaseConnection = {
      ...connectionData,
      id: `conn-${Date.now()}`
    };
    setConnections(prev => [...prev, newConnection]);
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top Bar */}
      <TopBar
        connections={connections}
        activeConnection={activeConnection}
        tabs={tabs}
        activeTabId={activeTabId}
        onConnectionChange={handleConnectionChange}
        onRunQuery={handleRunQuery}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onTabChange={handleTabChange}
        onOpenConnectionManager={() => setShowConnectionManager(true)}
        queryLimit={queryLimit}
        onQueryLimitChange={setQueryLimit}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div style={{ width: `${sidebarResize.size}px` }} className="flex-shrink-0">
          <DatabaseTree
            connections={connections}
            schemas={mockSchemas}
            activeConnection={activeConnection}
            onConnectionSelect={handleConnectionChange}
          />
        </div>

        {/* Sidebar Resize Handle */}
        <ResizableHandle
          direction="horizontal"
          onMouseDown={sidebarResize.startResizing}
          isResizing={sidebarResize.isResizing}
        />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div 
            className="flex-1 overflow-hidden"
            style={{ height: `calc(100% - ${resultsResize.size}px - 4px)` }}
          >
            <SqlEditor
              value={activeTab?.content || ''}
              onChange={handleEditorChange}
              onRunQuery={handleRunQuery}
            />
          </div>

          {/* Results Resize Handle */}
          <ResizableHandle
            direction="vertical"
            onMouseDown={resultsResize.startResizing}
            isResizing={resultsResize.isResizing}
          />

          {/* Results Panel */}
          <div 
            style={{ height: `${resultsResize.size}px` }}
            className="flex-shrink-0"
          >
            <QueryResults
              results={queryResults}
              isLoading={isQueryLoading}
              lastExecuted={lastQueryExecuted}
            />
          </div>
        </div>
      </div>

      {/* Connection Manager Modal */}
      <ConnectionManager
        isOpen={showConnectionManager}
        onClose={() => setShowConnectionManager(false)}
        onSave={handleSaveConnection}
      />
    </div>
  );
}