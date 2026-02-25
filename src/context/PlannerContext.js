import React, { createContext, useContext, useState, useCallback } from 'react';

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, { ...task, id: task.id || Date.now().toString(), completed: task.completed ?? false }]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleCompleted = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const setTasksDirect = useCallback((updater) => {
    setTasks(typeof updater === 'function' ? updater : () => updater);
  }, []);

  const value = {
    tasks,
    setTasks: setTasksDirect,
    addTask,
    deleteTask,
    toggleCompleted,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
}

/** First incomplete task (for Dashboard "Today's Focus") or null */
export function useFirstFocusTask() {
  const ctx = useContext(PlannerContext);
  if (!ctx?.tasks?.length) return null;
  return ctx.tasks.find((t) => !t.completed) || null;
}
