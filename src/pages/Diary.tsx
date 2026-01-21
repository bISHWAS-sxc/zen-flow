import { useState } from 'react';
import { Plus, BookOpen, Trash2, Smile, Meh, Frown, Heart } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage, generateId, formatDate } from '@/hooks/useLocalStorage';
import { DiaryEntry } from '@/types';
import { cn } from '@/lib/utils';

const moods = [
  { value: 'great', icon: Heart, label: 'Great' },
  { value: 'good', icon: Smile, label: 'Good' },
  { value: 'okay', icon: Meh, label: 'Okay' },
  { value: 'bad', icon: Frown, label: 'Bad' },
] as const;

export default function Diary() {
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('diary', []);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DiaryEntry['mood']>('good');

  const today = formatDate(new Date());
  const todayEntry = entries.find(e => e.date === today);

  const saveEntry = () => {
    if (!content.trim()) return;

    if (todayEntry) {
      setEntries(entries.map(e => 
        e.id === todayEntry.id ? { ...e, content, mood } : e
      ));
    } else {
      const entry: DiaryEntry = {
        id: generateId(),
        date: today,
        content,
        mood,
      };
      setEntries([entry, ...entries]);
    }
    setIsWriting(false);
    setContent('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const startWriting = () => {
    if (todayEntry) {
      setContent(todayEntry.content);
      setMood(todayEntry.mood || 'good');
    }
    setIsWriting(true);
  };

  if (isWriting) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={todayEntry ? "Edit Today's Entry" : "New Entry"}
          description={new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        />

        {/* Mood Selector */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">How are you feeling?</p>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  mood === m.value 
                    ? "border-foreground bg-foreground text-background" 
                    : "border-border hover:border-foreground"
                )}
              >
                <m.icon size={18} />
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-none mb-4"
          placeholder="Write about your day..."
        />

        <div className="flex gap-2">
          <Button onClick={saveEntry}>Save Entry</Button>
          <Button variant="outline" onClick={() => setIsWriting(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Diary" 
        description={`${entries.length} entries`}
        action={
          <Button onClick={startWriting}>
            <Plus size={18} className="mr-2" />
            {todayEntry ? 'Edit Today' : 'Write Today'}
          </Button>
        }
      />

      {entries.length === 0 ? (
        <EmptyState 
          icon={BookOpen}
          title="No diary entries yet"
          description="Start writing about your day"
        />
      ) : (
        <div className="space-y-4">
          {entries.map(entry => {
            const MoodIcon = moods.find(m => m.value === entry.mood)?.icon || Meh;
            return (
              <div 
                key={entry.id}
                className="group p-4 rounded-xl border border-border bg-card animate-slide-up"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    {entry.mood && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MoodIcon size={16} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                  {entry.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
