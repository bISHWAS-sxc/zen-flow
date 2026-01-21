import { useState } from 'react';
import { Plus, Bookmark as BookmarkIcon, Trash2, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';
import { Bookmark } from '@/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', []);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const addBookmark = () => {
    if (!title.trim() || !url.trim()) return;
    
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }

    const bookmark: Bookmark = {
      id: generateId(),
      title,
      url: finalUrl,
      createdAt: new Date().toISOString(),
    };
    setBookmarks([bookmark, ...bookmarks]);
    setTitle('');
    setUrl('');
    setOpen(false);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Bookmarks" 
        description={`${bookmarks.length} saved links`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bookmark</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBookmark()}
                />
                <Button onClick={addBookmark} className="w-full">
                  Save Bookmark
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {bookmarks.length === 0 ? (
        <EmptyState 
          icon={BookmarkIcon}
          title="No bookmarks yet"
          description="Save your favorite links for quick access"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map(bookmark => (
            <div 
              key={bookmark.id}
              className="group p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors animate-slide-up"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium truncate flex-1 pr-2">{bookmark.title}</h3>
                <div className="flex items-center gap-1">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {getDomain(bookmark.url)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
