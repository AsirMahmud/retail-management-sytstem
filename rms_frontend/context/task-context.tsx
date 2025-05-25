"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define types for tasks and notes
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  completedAt?: string;
  attachments?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  category: string;
  pinned: boolean;
  tags: string[];
}

// Sample initial data
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Restock summer collection",
    description:
      "Order new inventory for the summer collection from our main supplier",
    assignedTo: "Sarah Williams",
    createdBy: "John Doe",
    createdAt: "2023-05-10T09:00:00Z",
    dueDate: "2023-05-15T17:00:00Z",
    priority: "high",
    status: "in-progress",
    category: "inventory",
  },
  {
    id: "task-2",
    title: "Train new sales associate",
    description:
      "Complete onboarding and POS training for the new hire starting next week",
    assignedTo: "Alex Johnson",
    createdBy: "John Doe",
    createdAt: "2023-05-11T10:30:00Z",
    dueDate: "2023-05-18T17:00:00Z",
    priority: "medium",
    status: "pending",
    category: "staff",
  },
  {
    id: "task-3",
    title: "Update window display",
    description:
      "Change the front window display to showcase the new summer collection",
    assignedTo: "Michael Brown",
    createdBy: "Sarah Williams",
    createdAt: "2023-05-12T14:00:00Z",
    dueDate: "2023-05-14T12:00:00Z",
    priority: "medium",
    status: "completed",
    completedAt: "2023-05-14T11:30:00Z",
    category: "marketing",
  },
  {
    id: "task-4",
    title: "Prepare monthly sales report",
    description:
      "Compile and analyze sales data for the monthly management meeting",
    assignedTo: "John Doe",
    createdBy: "John Doe",
    createdAt: "2023-05-13T09:15:00Z",
    dueDate: "2023-05-20T09:00:00Z",
    priority: "high",
    status: "pending",
    category: "reports",
  },
  {
    id: "task-5",
    title: "Follow up with late payments",
    description: "Contact customers with outstanding balances over 30 days",
    assignedTo: "Emily Davis",
    createdBy: "John Doe",
    createdAt: "2023-05-13T11:45:00Z",
    dueDate: "2023-05-16T17:00:00Z",
    priority: "high",
    status: "in-progress",
    category: "finances",
  },
];

const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "New supplier contact",
    content:
      "Met with a new potential supplier for premium accessories. Contact: John Smith, email: john@example.com, phone: 555-123-4567",
    createdBy: "John Doe",
    createdAt: "2023-05-10T14:30:00Z",
    category: "suppliers",
    pinned: true,
    tags: ["supplier", "accessories", "contact"],
  },
  {
    id: "note-2",
    title: "Staff meeting agenda",
    content:
      "Topics for next week's staff meeting: 1. Summer collection launch, 2. New commission structure, 3. Customer feedback review, 4. Training schedule",
    createdBy: "John Doe",
    createdAt: "2023-05-11T09:45:00Z",
    category: "staff",
    pinned: true,
    tags: ["meeting", "staff", "agenda"],
  },
  {
    id: "note-3",
    title: "Display ideas",
    content:
      "Ideas for summer window display: beach theme with mannequins in casual wear, surfboards as props, blue and yellow color scheme",
    createdBy: "Michael Brown",
    createdAt: "2023-05-12T11:20:00Z",
    category: "marketing",
    pinned: false,
    tags: ["display", "marketing", "summer"],
  },
  {
    id: "note-4",
    title: "Customer feedback",
    content:
      "Several customers have requested more variety in plus sizes. Consider expanding this section in the next inventory order.",
    createdBy: "Sarah Williams",
    createdAt: "2023-05-13T16:10:00Z",
    category: "customers",
    pinned: false,
    tags: ["feedback", "inventory", "sizing"],
  },
];

// Define the context type
interface TaskContextType {
  tasks: Task[];
  notes: Note[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  toggleNotePin: (id: string) => void;
  taskCategories: string[];
  noteCategories: string[];
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // Extract unique categories
  const taskCategories = Array.from(
    new Set(tasks.map((task) => task.category))
  );
  const noteCategories = Array.from(
    new Set(notes.map((note) => note.category))
  );

  // Task operations
  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  // Note operations
  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const getNoteById = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  const toggleNotePin = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        notes,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        addNote,
        updateNote,
        deleteNote,
        getNoteById,
        toggleNotePin,
        taskCategories,
        noteCategories,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Create a custom hook to use the context
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
