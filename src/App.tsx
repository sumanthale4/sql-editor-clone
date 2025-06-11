import { useState } from "react";
import { DatabaseType, Connection } from "./types/Connection";
import { useConnections } from "./hooks/useConnections";
import { DatabaseTabs } from "./components/DatabaseTabs";
import { ConnectionList } from "./components/ConnectionList";
import { AddConnectionModal } from "./components/AddConnectionModal";
import { EditConnectionModal } from "./components/EditConnectionModal";
import { PasswordUpdateModal } from "./components/PasswordUpdateModal";
import { DatabaseMigration } from "./components/DatabaseMigration";
import { exportConnections, importConnections } from "./utils/importExport";
import {
  Plus,
  Download,
  Upload,
  Database,
  Sparkles,
  Shield,
  GitBranch,
  Code,
  Sun,
  Moon,
} from "lucide-react";
import Editor from "./editor/Editor";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();
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

  const [activeView, setActiveView] = useState<
    "connections" | "migration" | "editor"
  >("connections");
  const [activeTab, setActiveTab] = useState<DatabaseType>("PostgreSQL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(
    null
  );
  const [updatingPasswordConnection, setUpdatingPasswordConnection] =
    useState<Connection | null>(null);

  const connectionCounts = {
    PostgreSQL: getConnectionsByType("PostgreSQL").length,
    MySQL: getConnectionsByType("MySQL").length,
    Oracle: getConnectionsByType("Oracle").length,
  };

  const currentConnections = getConnectionsByType(activeTab);

  const handleExport = () => {
    exportConnections(connections);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedConnections = await importConnections(file);
          handleImportConnections(importedConnections);
          alert(
            `Successfully imported ${importedConnections.length} connections!`
          );
        } catch (error) {
          alert(
            error instanceof Error
              ? error.message
              : "Failed to import connections"
          );
        }
      }
    };
    input.click();
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setIsEditModalOpen(true);
  };

  const handleUpdatePassword = (connection: Connection) => {
    setUpdatingPasswordConnection(connection);
    setIsPasswordModalOpen(true);
  };

  const handleSaveEdit = (updatedConnection: Connection) => {
    updateConnection(updatedConnection.id, updatedConnection);
    setIsEditModalOpen(false);
    setEditingConnection(null);
  };

  const handlePasswordUpdate = (connectionId: string, newPassword: string) => {
    updateConnection(connectionId, { password: newPassword });
    setIsPasswordModalOpen(false);
    setUpdatingPasswordConnection(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_8px_25px_var(--shadow-medium)]">
              <Database className="w-10 h-10 text-white animate-pulse-brand" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-brand-accent animate-bounce" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Loading Connections
          </h3>
          <p className="text-[var(--text-secondary)]">
            Preparing your premium database interface...
          </p>
        </div>
      </div>
    );
  }

  // Show migration view
  if (activeView === "migration") {
    return <DatabaseMigration setActiveView={setActiveView} />;
  }
  // Show SQL Editor
  if (activeView === "editor") {
    return <Editor />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="gradient-primary p-3 rounded-2xl shadow-[0_8px_25px_var(--shadow-medium)]">
                  <Database className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                  Universal SQL Editor
                </h1>
                <p className="text-[var(--text-secondary)] mt-1 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>
                    Seamlessly Connect, Manage and Scale Across Multiple
                    Databases
                  </span>
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-3 rounded-xl"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6 absolute top-3 right-16">
          <button
            onClick={() => setActiveView("editor")}
            className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Code className="w-4 h-4" />
            <span>SQL Editor</span>
          </button>

          <button
            onClick={() => setActiveView("migration")}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <GitBranch className="w-4 h-4" />
            <span>Migration</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-end absolute right-5 top-20">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Connection</span>
          </button>

          <button
            onClick={handleExport}
            disabled={connections.length === 0}
            className="btn-outline inline-flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={handleImport}
            className="btn-ghost inline-flex items-center gap-2 text-sm px-4 py-2 border border-[var(--border-primary)]"
          >
            <Upload className="w-4 h-4" />
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
        <div className="card-elevated p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center space-x-2">
                <span>{activeTab} Connections</span>
                <div className="px-3 py-1 bg-[var(--synchrony-blue)] text-white text-sm font-semibold rounded-full">
                  {currentConnections.length}
                </div>
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Manage your {activeTab.toLowerCase()} database connections
                across all environments
              </p>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-[var(--text-muted)]">
              <Sparkles className="w-4 h-4" />
              <span>Drag to reorder</span>
            </div>
          </div>

          <ConnectionList
            connections={currentConnections}
            type={activeTab}
            onDelete={deleteConnection}
            onEdit={handleEditConnection}
            onUpdatePassword={handleUpdatePassword}
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

        {/* Password Update Modal */}
        <PasswordUpdateModal
          isOpen={isPasswordModalOpen}
          connection={updatingPasswordConnection}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setUpdatingPasswordConnection(null);
          }}
          onUpdate={handlePasswordUpdate}
        />
      </div>
    </div>
  );
}

export default App;