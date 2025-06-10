import React, { useState } from 'react';
import { DatabaseType, Connection } from './types/Connection';
import { useConnections } from './hooks/useConnections';
import { DatabaseTabs } from './components/DatabaseTabs';
import { ConnectionList } from './components/ConnectionList';
import { AddConnectionModal } from './components/AddConnectionModal';
import { EditConnectionModal } from './components/EditConnectionModal';
import { exportConnections, importConnections } from './utils/importExport';
import { Plus, Download, Upload, Database, Sparkles, Crown, Shield } from 'lucide-react';

function App() {
  const {
    connections,
    loading,
    addConnection,
    updateConnection,
    deleteConnection,
    reorderConnections,
    importConnections: handleImportConnections,
    getConnectionsByType,
  } = useConnections();

  const [activeTab, setActiveTab] = useState<DatabaseType>('PostgreSQL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

  const connectionCounts = {
    PostgreSQL: getConnectionsByType('PostgreSQL').length,
    MySQL: getConnectionsByType('MySQL').length,
    Oracle: getConnectionsByType('Oracle').length,
  };

  const currentConnections = getConnectionsByType(activeTab);

  const handleExport = () => {
    exportConnections(connections);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedConnections = await importConnections(file);
          handleImportConnections(importedConnections);
          alert(`Successfully imported ${importedConnections.length} connections!`);
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Failed to import connections');
        }
      }
    };
    input.click();
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedConnection: Connection) => {
    updateConnection(updatedConnection.id, updatedConnection);
    setIsEditModalOpen(false);
    setEditingConnection(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
              <Database className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Connections</h3>
          <p className="text-gray-600">Preparing your premium database interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Universal SQL Editor
                </h1>
                <p className="text-gray-600 mt-1 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Professional Database Management Platform</span>
                  <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </div>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Secure Connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Enterprise Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add Connection</span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={connections.length === 0}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleImport}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>
        </div>

        {/* Database Tabs */}
        <div className="mb-8">
          <DatabaseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            connectionCounts={connectionCounts}
          />
        </div>

        {/* Connection List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>{activeTab} Connections</span>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold rounded-full">
                  {currentConnections.length}
                </div>
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your {activeTab.toLowerCase()} database connections across all environments
              </p>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Drag to reorder</span>
            </div>
          </div>
          
          <ConnectionList
            connections={currentConnections}
            type={activeTab}
            onDelete={deleteConnection}
            onEdit={handleEditConnection}
            onReorder={reorderConnections}
          />
        </div>

        {/* Add Connection Modal */}
        <AddConnectionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={addConnection}
        />

        {/* Edit Connection Modal */}
        <EditConnectionModal
          isOpen={isEditModalOpen}
          connection={editingConnection}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingConnection(null);
          }}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
}

export default App;