import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import CalendarPage from "./pages/CalendarPage";
import Diary from "./pages/Diary";
import Bookmarks from "./pages/Bookmarks";
import Habits from "./pages/Habits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
          <Route path="/notes" element={<Layout><Notes /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/diary" element={<Layout><Diary /></Layout>} />
          <Route path="/bookmarks" element={<Layout><Bookmarks /></Layout>} />
          <Route path="/habits" element={<Layout><Habits /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
