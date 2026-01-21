import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  BookOpen, 
  Bookmark, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useLocalStorage, formatDate, isToday } from '@/hooks/useLocalStorage';
import { Task, Note, Habit, DiaryEntry, Bookmark as BookmarkType } from '@/types';
import { cn } from '@/lib/utils';

const quickLinks = [
  { path: '/tasks', icon: CheckSquare, label: 'Tasks', color: 'bg-foreground' },
  { path: '/notes', icon: FileText, label: 'Notes', color: 'bg-foreground' },
  { path: '/calendar', icon: Calendar, label: 'Calendar', color: 'bg-foreground' },
  { path: '/diary', icon: BookOpen, label: 'Diary', color: 'bg-foreground' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks', color: 'bg-foreground' },
  { path: '/habits', icon: Flame, label: 'Habits', color: 'bg-foreground' },
];

export default function Dashboard() {
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [notes] = useLocalStorage<Note[]>('notes', []);
  const [habits] = useLocalStorage<Habit[]>('habits', []);
  const [diary] = useLocalStorage<DiaryEntry[]>('diary', []);
  const [bookmarks] = useLocalStorage<BookmarkType[]>('bookmarks', []);

  const today = formatDate(new Date());
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const todayHabits = habits.filter(h => h.completedDates.includes(today)).length;
  const totalStreaks = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description={new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Pending Tasks</p>
          <p className="text-3xl font-semibold mt-1">{pendingTasks}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="text-3xl font-semibold mt-1">{notes.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Today's Habits</p>
          <p className="text-3xl font-semibold mt-1">{todayHabits}/{habits.length}</p>
        </div>
        <div className={cn(
          "p-4 rounded-xl border border-border",
          totalStreaks > 0 ? "bg-streak/10 border-streak/30" : "bg-card"
        )}>
          <p className="text-sm text-muted-foreground">Total Streaks</p>
          <p className="text-3xl font-semibold mt-1 flex items-center gap-2">
            {totalStreaks}
            {totalStreaks > 0 && <Flame size={20} className="text-streak" />}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-medium mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
          >
            <div className={cn("p-2 rounded-lg text-primary-foreground", link.color)}>
              <link.icon size={18} />
            </div>
            <span className="font-medium">{link.label}</span>
            <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {(tasks.length > 0 || notes.length > 0) && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Recent Items</h2>
          <div className="space-y-2">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <CheckSquare size={16} className={task.completed ? "text-success" : "text-muted-foreground"} />
                <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </span>
              </div>
            ))}
            {notes.slice(0, 2).map(note => (
              <div key={note.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <FileText size={16} className="text-muted-foreground" />
                <span className="text-sm">{note.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
