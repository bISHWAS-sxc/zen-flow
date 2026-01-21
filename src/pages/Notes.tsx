import { useState } from 'react';
import { Plus, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createNote = () => {
    const note: Note = {
      id: generateId(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  const updateNote = () => {
    if (!selectedNote) return;
    setNotes(notes.map(n => 
      n.id === selectedNote.id 
        ? { ...n, title, content, updatedAt: new Date().toISOString() }
        : n
    ));
    setSelectedNote({ ...selectedNote, title, content });
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  if (selectedNote) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsEditing(false);
            }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
              placeholder="Note title"
            />
          ) : (
            <h1 className="text-xl font-semibold flex-1">{selectedNote.title}</h1>
          )}
          {isEditing ? (
            <Button onClick={updateNote}>Save</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>

        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none"
            placeholder="Start writing..."
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">
              {selectedNote.content || 'No content yet. Click edit to start writing.'}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Notes" 
        description={`${notes.length} notes`}
        action={
          <Button onClick={createNote}>
            <Plus size={18} className="mr-2" />
            New Note
          </Button>
        }
      />

      {notes.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="No notes yet"
          description="Create your first note to get started"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <div 
              key={note.id}
              className="group p-4 rounded-xl border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors animate-slide-up"
              onClick={() => openNote(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium truncate">{note.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {note.content || 'No content'}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
