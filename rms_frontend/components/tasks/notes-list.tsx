"use client"

import { useState } from "react"
import { useTasks, type Note } from "@/context/task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreateNoteDialog } from "@/components/tasks/create-note-dialog"
import { NoteDetailsDialog } from "@/components/tasks/note-details-dialog"
import { Pin, Trash, Plus } from "lucide-react"

export function NotesList() {
  const { notes, toggleNotePin, deleteNote } = useTasks()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // View note details
  const viewNoteDetails = (note: Note) => {
    setSelectedNote(note)
    setDetailsOpen(true)
  }

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>No notes found. Create your first note to get started.</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`overflow-hidden ${note.pinned ? "border-amber-200 shadow-amber-100/50" : ""}`}
            >
              <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {note.title}
                    {note.pinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">{getInitials(note.createdBy)}</AvatarFallback>
                    </Avatar>
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleNotePin(note.id)}>
                    <Pin className={`h-4 w-4 ${note.pinned ? "text-amber-500" : "text-muted-foreground"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div
                  className="text-sm text-muted-foreground line-clamp-3 mb-3 cursor-pointer"
                  onClick={() => viewNoteDetails(note)}
                >
                  {note.content}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="capitalize bg-slate-50">
                    {note.category}
                  </Badge>
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && <Badge variant="outline">+{note.tags.length - 3}</Badge>}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => viewNoteDetails(note)}>
                  View Full Note
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateNoteDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {selectedNote && <NoteDetailsDialog note={selectedNote} open={detailsOpen} onOpenChange={setDetailsOpen} />}
    </>
  )
}
