import { useState, useEffect, useCallback } from 'react';
import { Connection, DatabaseType } from '../types/Connection';
import { saveConnections, loadConnections } from '../utils/storage';

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedConnections = loadConnections();
        // Migrate old connections to include environment field
        const migratedConnections = savedConnections.map(conn => ({
          ...conn,
          environment: conn.environment || 'dev',
          createdAt: conn.createdAt || new Date().toISOString(),
          lastUsed: conn.lastUsed || new Date().toISOString(),
        }));
        setConnections(migratedConnections);
      } catch (error) {
        console.error('Failed to load connections:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const saveData = useCallback((newConnections: Connection[]) => {
    setConnections(newConnections);
    saveConnections(newConnections);
  }, []);

  const addConnection = useCallback((connection: Omit<Connection, 'id' | 'order'>) => {
    const newConnection: Connection = {
      ...connection,
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: connections.length,
      environment: connection.environment || 'dev',
      createdAt: connection.createdAt || new Date().toISOString(),
      lastUsed: connection.lastUsed || new Date().toISOString(),
    };
    
    const newConnections = [...connections, newConnection];
    saveData(newConnections);
  }, [connections, saveData]);

  const updateConnection = useCallback((id: string, updates: Partial<Connection>) => {
    const newConnections = connections.map(conn =>
      conn.id === id ? { ...conn, ...updates, lastUsed: new Date().toISOString() } : conn
    );
    saveData(newConnections);
  }, [connections, saveData]);

  const deleteConnection = useCallback((id: string) => {
    const newConnections = connections.filter(conn => conn.id !== id);
    saveData(newConnections);
  }, [connections, saveData]);

  const reorderConnections = useCallback((type: DatabaseType, newOrder: Connection[]) => {
    const otherConnections = connections.filter(conn => conn.type !== type);
    const reorderedConnections = newOrder.map((conn, index) => ({
      ...conn,
      order: index,
    }));
    
    const allConnections = [...otherConnections, ...reorderedConnections];
    saveData(allConnections);
  }, [connections, saveData]);

  const importConnections = useCallback((importedConnections: Connection[]) => {
    // Ensure imported connections have all required fields
    const processedConnections = importedConnections.map(conn => ({
      ...conn,
      environment: conn.environment || 'dev',
      createdAt: conn.createdAt || new Date().toISOString(),
      lastUsed: conn.lastUsed || new Date().toISOString(),
    }));
    
    const newConnections = [...connections, ...processedConnections];
    saveData(newConnections);
  }, [connections, saveData]);

  const getConnectionsByType = useCallback((type: DatabaseType) => {
    return connections
      .filter(conn => conn.type === type)
      .sort((a, b) => a.order - b.order);
  }, [connections]);

  return {
    connections,
    loading,
    addConnection,
    updateConnection,
    deleteConnection,
    reorderConnections,
    importConnections,
    getConnectionsByType,
  };
};