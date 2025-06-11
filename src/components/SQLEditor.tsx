import React, { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Sidebar } from './sql-editor/Sidebar';
import { EditorPanel } from './sql-editor/EditorPanel';
import { ResultsPanel } from './sql-editor/ResultsPanel';
import { TopBar } from './sql-editor/TopBar';
import { 
  Database, 
  ArrowLeft, 
  Moon, 
  Sun,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface SQLEditorProps {
  setActiveView: (view: "connections" | "migration" | "editor") => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ setActiveView }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeConnection, setActiveConnection] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryInfo, setQueryInfo] = useState<{
    runtime: number;
    timestamp: string;
    rowCount: number;
  } | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleQueryRun = (query: string, limit: number) => {
    // Simulate query execution
    const startTime = Date.now();
    
    // Mock data generation
    const mockData = Array.from({ length: Math.min(limit, 50) }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      department: ['Engineering', 'Marketing', 'Sales', 'HR'][Math.floor(Math.random() * 4)],
    }));

    setTimeout(() => {
      const runtime = Date.now() - startTime;
      setQueryResults(mockData);
      setQueryInfo({
        runtime,
        timestamp: new Date().toISOString(),
        rowCount: mockData.length,
      });
    }, 500 + Math.random() * 1000);
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView("connections")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Connections
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                SQL Editor
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Professional database query interface
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <TopBar 
        activeConnection={activeConnection}
        onConnectionChange={setActiveConnection}
        onQueryRun={handleQueryRun}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar */}
          <Panel 
            defaultSize={20} 
            minSize={15} 
            maxSize={35}
            collapsible={true}
            onCollapse={() => setSidebarCollapsed(true)}
            onExpand={() => setSidebarCollapsed(false)}
          >
            <Sidebar 
              collapsed={sidebarCollapsed}
              activeConnection={activeConnection}
              isDarkMode={isDarkMode}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors" />

          {/* Main Editor Area */}
          <Panel defaultSize={80} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Editor Panel */}
              <Panel defaultSize={60} minSize={30}>
                <EditorPanel 
                  isDarkMode={isDarkMode}
                  onQueryRun={handleQueryRun}
                />
              </Panel>

              <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors" />

              {/* Results Panel */}
              <Panel defaultSize={40} minSize={20}>
                <ResultsPanel 
                  results={queryResults}
                  queryInfo={queryInfo}
                  isDarkMode={isDarkMode}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};