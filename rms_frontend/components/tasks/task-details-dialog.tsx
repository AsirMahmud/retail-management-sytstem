"use client"

import { useState } from "react"
import { useTasks, type Task, type TaskStatus } from "@/context/task-context"
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
import { Calendar, Clock, User, AlertCircle, CheckCircle, Edit } from "lucide-react"

interface TaskDetailsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const { updateTask } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description)

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

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      case "medium":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      case "low":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "inventory":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100"
      case "staff":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "marketing":
        return "bg-pink-100 text-pink-700 hover:bg-pink-100"
      case "reports":
        return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
      case "finances":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      case "in-progress":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
  }

  // Update task status
  const updateStatus = (newStatus: TaskStatus) => {
    updateTask(task.id, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
    })
  }

  // Save edited description
  const saveDescription = () => {
    updateTask(task.id, { description: editedDescription })
    setIsEditing(false)
  }

  // Check if task is overdue
  const isOverdue = () => {
    if (task.status === "completed") return false
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    return dueDate < now
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority} priority
            </Badge>
            <Badge variant="outline" className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status.replace("-", " ")}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-1">Description</h4>
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveDescription}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{task.description}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned to</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{getInitials(task.assignedTo)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created by</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{getInitials(task.createdBy)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Due date</p>
                  <p className={`text-sm ${isOverdue() ? "text-red-500 font-medium" : ""}`}>
                    {formatDate(task.dueDate)}
                    {isOverdue() && " (Overdue)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created on</p>
                  <p className="text-sm">{formatDate(task.createdAt)}</p>
                </div>
              </div>

              {task.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Completed on</p>
                    <p className="text-sm">{formatDate(task.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {task.status !== "completed" && (
            <Button
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
              onClick={() => updateStatus("completed")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}
          {task.status !== "in-progress" && task.status !== "completed" && (
            <Button
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              onClick={() => updateStatus("in-progress")}
            >
              Start Task
            </Button>
          )}
          {task.status !== "pending" && (
            <Button variant="outline" onClick={() => updateStatus("pending")}>
              Reset to Pending
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
