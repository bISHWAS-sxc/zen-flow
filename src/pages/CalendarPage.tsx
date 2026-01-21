import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { useLocalStorage, formatDate } from '@/hooks/useLocalStorage';
import { Task, DiaryEntry, Habit } from '@/types';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [diary] = useLocalStorage<DiaryEntry[]>('diary', []);
  const [habits] = useLocalStorage<Habit[]>('habits', []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const dayDiary = diary.find(d => d.date === dateStr);
    const dayHabits = habits.filter(h => h.completedDates.includes(dateStr));
    
    return {
      tasks: dayTasks.length,
      hasDiary: !!dayDiary,
      habits: dayHabits.length,
    };
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Calendar" 
        description="View your schedule at a glance"
      />

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <Button variant="outline" onClick={goToToday}>Today</Button>
      </div>

      {/* Calendar Grid */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="p-3 min-h-[80px] bg-muted/30" />;
            }

            const events = getEventsForDay(day);
            const isToday = isCurrentMonth && today.getDate() === day;

            return (
              <div
                key={index}
                className={cn(
                  "p-2 min-h-[80px] border-t border-l border-border first:border-l-0",
                  isToday && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                  isToday && "bg-primary text-primary-foreground font-semibold"
                )}>
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {events.tasks > 0 && (
                    <div className="text-xs px-1.5 py-0.5 rounded bg-foreground/10 truncate">
                      {events.tasks} task{events.tasks > 1 ? 's' : ''}
                    </div>
                  )}
                  {events.habits > 0 && (
                    <div className="text-xs px-1.5 py-0.5 rounded bg-streak/20 text-streak-foreground truncate">
                      {events.habits} habit{events.habits > 1 ? 's' : ''}
                    </div>
                  )}
                  {events.hasDiary && (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-foreground/10" />
          <span>Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-streak/20" />
          <span>Habits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span>Diary</span>
        </div>
      </div>
    </div>
  );
}
