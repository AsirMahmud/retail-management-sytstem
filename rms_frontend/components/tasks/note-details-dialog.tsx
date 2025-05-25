"use client"

import { useState } from "react"
import { useTasks, type Note } from "@/context/task-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Pin, Edit, Trash, Save } from "lucide-react"

interface NoteDetailsDialogProps {
  note: Note
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteDetailsDialog({ note, open, onOpenChange }: NoteDetailsDialogProps) {
  const { updateNote, toggleNotePin, deleteNote } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(note.content)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
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

  // Save edited content
  const saveContent = () => {
    updateNote(note.id, { content: editedContent })
    setIsEditing(false)
  }

  // Handle note deletion with confirmation
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{note.title}</DialogTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleNotePin(note.id)}>
                <Pin className={`h-4 w-4 ${note.pinned ? "text-amber-500" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="capitalize bg-slate-50">
              {note.category}
            </Badge>
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700">
                {tag}
              </Badge>
            ))}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{getInitials(note.createdBy)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{note.createdBy}</p>
                <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
              </div>
            </div>

            <Separator />

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveContent}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-line text-sm">{note.content}</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
