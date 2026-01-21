export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'diary' | 'habit';
}

export interface UserData {
  tasks: Task[];
  notes: Note[];
  diary: DiaryEntry[];
  bookmarks: Bookmark[];
  habits: Habit[];
}
