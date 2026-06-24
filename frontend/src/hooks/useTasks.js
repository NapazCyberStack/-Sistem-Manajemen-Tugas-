import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';

export const useTasks = (shouldFetchOnMount = true) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    status: { pending: 0, inProgress: 0, completed: 0 },
    priority: { low: 0, medium: 0, high: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtering state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: ''
  });

  // Fetch tasks
  const fetchTasks = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      // Clean empty filters before sending request
      const activeFilters = {};
      if (currentFilters.search) activeFilters.search = currentFilters.search;
      if (currentFilters.status) activeFilters.status = currentFilters.status;
      if (currentFilters.priority) activeFilters.priority = currentFilters.priority;

      const data = await taskService.getTasks(activeFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await taskService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Gagal mengambil statistik:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch both tasks and stats
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchStats()]);
  }, [fetchTasks, fetchStats]);

  // Run on mount if specified
  useEffect(() => {
    if (shouldFetchOnMount) {
      refreshAll();
    }
  }, [shouldFetchOnMount]);

  // Trigger search / filter update
  const updateFilters = (newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Fetch tasks immediately with new filters
      fetchTasks(updated);
      return updated;
    });
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      await fetchStats(); // Refresh stats for dashboard
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      await fetchStats(); // Refresh stats
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    tasks,
    stats,
    loading,
    statsLoading,
    error,
    filters,
    fetchTasks,
    fetchStats,
    refreshAll,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    clearError
  };
};
