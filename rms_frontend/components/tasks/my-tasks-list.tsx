"use client"

import { useState } from "react"
import { useTasks } from "@/context/task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { Calendar, Clock, MoreHorizontal, CheckCircle, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MyTasksList() {
  const { tasks, updateTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filter tasks assigned to the current user (John Doe in this example)
  const currentUser = "John Doe"
  const myTasks = tasks.filter((task) => task.assignedTo === currentUser)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
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

  // Check if task is overdue
  const isOverdue = (task) => {
    if (task.status === "completed") return false
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    return dueDate < now
  }

  // View task details
  const viewTaskDetails = (task) => {
    setSelectedTask(task)
    setDetailsOpen(true)
  }

  // Mark task as completed
  const markAsCompleted = (taskId) => {
    updateTask(taskId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    })
  }

  // Start task (mark as in-progress)
  const startTask = (taskId) => {
    updateTask(taskId, { status: "in-progress" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You have no assigned tasks.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={isOverdue(task) ? "text-red-500 font-medium" : ""}>
                          {formatDate(task.dueDate)}
                          {isOverdue(task) && (
                            <span className="ml-1">
                              <AlertCircle className="h-3.5 w-3.5 inline text-red-500" />
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{task.category}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => viewTaskDetails(task)}>View Details</DropdownMenuItem>
                          {task.status !== "completed" && (
                            <DropdownMenuItem onClick={() => markAsCompleted(task.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {task.status === "pending" && (
                            <DropdownMenuItem onClick={() => startTask(task.id)}>
                              <Clock className="mr-2 h-4 w-4 text-blue-600" />
                              Start Task
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {selectedTask && <TaskDetailsDialog task={selectedTask} open={detailsOpen} onOpenChange={setDetailsOpen} />}
    </Card>
  )
}
