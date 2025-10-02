import { useState, useEffect, useCallback } from 'react';
import { Column, storage } from '../services/storage';

export function useColumns(projectId: string) {
  const [columns, setColumns] = useState<Column[]>([]);

  const loadColumns = useCallback(() => {
    setColumns(storage.getColumns(projectId));
  }, [projectId]);

  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  const addColumn = useCallback((columnData: Omit<Column, 'id' | 'created_at'>) => {
    const maxPosition = columns.length > 0
      ? Math.max(...columns.map(c => c.position))
      : -1;

    storage.addColumn({
      ...columnData,
      position: maxPosition + 1,
    }, projectId);
    
    loadColumns();
  }, [columns, projectId, loadColumns]);

  const updateColumn = useCallback((id: string, updates: Partial<Column>) => {
    storage.updateColumn(id, updates, projectId);
    loadColumns();
  }, [projectId, loadColumns]);

  const deleteColumn = useCallback((id: string) => {
    storage.deleteColumn(id, projectId);
    loadColumns();
  }, [projectId, loadColumns]);

  const reorderColumns = useCallback((newColumns: Column[]) => {
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      position: index,
    }));
    
    updatedColumns.forEach(col => {
      storage.updateColumn(col.id, { position: col.position }, projectId);
    });
    
    loadColumns();
  }, [projectId, loadColumns]);

  return {
    columns,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    loadColumns,
  };
}

