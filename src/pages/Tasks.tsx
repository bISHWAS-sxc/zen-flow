import { useState } from 'react';
import { Plus, Check, Trash2, CheckSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage, generateId, formatDate } from '@/hooks/useLocalStorage';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: generateId(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Tasks" 
        description={`${pendingTasks.length} pending, ${completedTasks.length} completed`}
      />

      {/* Add Task */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1"
        />
        <Button onClick={addTask} size="icon">
          <Plus size={18} />
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState 
          icon={CheckSquare}
          title="No tasks yet"
          description="Add your first task to get started"
        />
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Pending</h3>
              <div className="space-y-2">
                {pendingTasks.map(task => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors animate-slide-up"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded border-2 border-muted-foreground flex items-center justify-center hover:border-foreground transition-colors"
                    >
                    </button>
                    <span className="flex-1">{task.title}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed</h3>
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded bg-success text-success-foreground flex items-center justify-center"
                    >
                      <Check size={12} strokeWidth={3} />
                    </button>
                    <span className="flex-1 line-through text-muted-foreground">{task.title}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
