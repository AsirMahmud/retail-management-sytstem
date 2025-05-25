import type { Metadata } from "next"
import { NotesList } from "@/components/tasks/notes-list"
import { NoteFilterBar } from "@/components/tasks/note-filter-bar"

export const metadata: Metadata = {
  title: "Notes",
  description: "View and manage store notes and important information",
}

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Store notes and important information</p>
        </div>
        <NoteFilterBar />
      </div>

      <NotesList />
    </div>
  )
}
