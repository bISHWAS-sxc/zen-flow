import { useState } from 'react';
import { Plus, Flame, Trash2, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage, generateId, formatDate, isYesterday } from '@/hooks/useLocalStorage';
import { Habit } from '@/types';
import { cn } from '@/lib/utils';

export default function Habits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [newHabit, setNewHabit] = useState('');

  const today = formatDate(new Date());

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: generateId(),
      name: newHabit,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;

      const isCompletedToday = habit.completedDates.includes(today);
      let newCompletedDates = isCompletedToday
        ? habit.completedDates.filter(d => d !== today)
        : [...habit.completedDates, today];

      // Calculate streak
      let newStreak = 0;
      if (!isCompletedToday) {
        // Check if yesterday was completed or if this is the first day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDate(yesterday);
        
        if (habit.completedDates.includes(yesterdayStr) || habit.currentStreak === 0) {
          newStreak = habit.currentStreak + 1;
        } else {
          newStreak = 1; // Start new streak
        }
      } else {
        // Unchecking today - reduce streak
        newStreak = Math.max(0, habit.currentStreak - 1);
      }

      const newLongestStreak = Math.max(habit.longestStreak, newStreak);

      return {
        ...habit,
        completedDates: newCompletedDates,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
      };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Get last 7 days for the streak visualization
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(formatDate(date));
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Habits" 
        description="Build better habits with streaks"
      />

      {/* Add Habit */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          className="flex-1"
        />
        <Button onClick={addHabit} size="icon">
          <Plus size={18} />
        </Button>
      </div>

      {habits.length === 0 ? (
        <EmptyState 
          icon={Flame}
          title="No habits yet"
          description="Start tracking your daily habits"
        />
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const isCompletedToday = habit.completedDates.includes(today);
            
            return (
              <div 
                key={habit.id}
                className={cn(
                  "group p-4 rounded-xl border transition-all animate-slide-up",
                  isCompletedToday 
                    ? "border-success/30 bg-success/5" 
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isCompletedToday 
                          ? "bg-success border-success text-success-foreground" 
                          : "border-muted-foreground hover:border-foreground"
                      )}
                    >
                      {isCompletedToday && <Check size={14} strokeWidth={3} />}
                    </button>
                    <span className={cn(
                      "font-medium",
                      isCompletedToday && "text-success"
                    )}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {habit.currentStreak > 0 && (
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                        habit.currentStreak >= 7 
                          ? "bg-streak/20 text-streak streak-glow" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Flame size={14} className={habit.currentStreak >= 7 ? "text-streak" : ""} />
                        {habit.currentStreak}
                      </div>
                    )}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Last 7 days visualization */}
                <div className="flex items-center gap-1">
                  {last7Days.map((date, i) => {
                    const isCompleted = habit.completedDates.includes(date);
                    const isToday = date === today;
                    return (
                      <div
                        key={date}
                        className={cn(
                          "flex-1 h-2 rounded-full transition-all",
                          isCompleted 
                            ? "bg-success" 
                            : isToday 
                              ? "bg-muted-foreground/30" 
                              : "bg-muted"
                        )}
                        title={new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                  <span>Current: {habit.currentStreak} days</span>
                  <span>Best: {habit.longestStreak} days</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
