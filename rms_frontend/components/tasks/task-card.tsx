"use client"

import { useState } from "react"
import { useTasks, type Task, type TaskStatus } from "@/context/task-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { Calendar, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks()
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

  // Update task status
  const updateStatus = (newStatus: TaskStatus) => {
    updateTask(task.id, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
    })
  }

  // Check if task is overdue
  const isOverdue = () => {
    if (task.status === "completed") return false
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    return dueDate < now
  }

  return (
    <>
      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium line-clamp-2">{task.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDetailsOpen(true)}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("pending")}>Mark as Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("in-progress")}>Mark as In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("completed")}>Mark as Completed</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => deleteTask(task.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={getCategoryColor(task.category)}>
                {task.category}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span className={isOverdue() ? "text-red-500 font-medium" : ""}>
                {formatDate(task.dueDate)}
                {isOverdue() && " (Overdue)"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-slate-100">{getInitials(task.assignedTo)}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDetailsOpen(true)}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      <TaskDetailsDialog task={task} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </>
  )
}
