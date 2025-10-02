import { useCallback, useEffect, useState } from 'react';
import { Task, storage } from '../services/storage';

export function useTasks(projectId: string) {
   const [tasks, setTasks] = useState<Task[]>([]);

   const loadTasks = useCallback(() => {
      setTasks(storage.getTasks(projectId));
   }, [projectId]);

   useEffect(() => {
      loadTasks();
   }, [loadTasks]);

   const addTask = useCallback((taskData: Omit<Task, 'id' | 'created_at'>) => {
      storage.addTask(taskData);
      loadTasks();
   }, [loadTasks]);

   const updateTask = useCallback((id: string, updates: Partial<Task>) => {
      storage.updateTask(id, updates);
      loadTasks();
   }, [loadTasks]);

   const deleteTask = useCallback((id: string) => {
      storage.deleteTask(id);
      loadTasks();
   }, [loadTasks]);

   const getTasksByColumn = useCallback((
      columnId: string,
      searchQuery?: string,
      filterPriority?: string
   ) => {
      let filteredTasks = tasks.filter(task => task.column_id === columnId);

      if (searchQuery) {
         filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }

      if (filterPriority) {
         filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
      }

      return filteredTasks;
   }, [tasks]);

   return {
      tasks,
      addTask,
      updateTask,
      deleteTask,
      getTasksByColumn,
      loadTasks,
   };
}

