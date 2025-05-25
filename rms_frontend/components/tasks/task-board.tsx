"use client"

import { useState } from "react"
import { useTasks } from "@/context/task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TaskBoard() {
  const { tasks } = useTasks()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Group tasks by status
  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="bg-amber-50 rounded-t-lg">
            <CardTitle className="text-amber-700 flex justify-between items-center">
              <span>Pending</span>
              <span className="bg-amber-100 text-amber-700 rounded-full px-2 py-1 text-xs">{pendingTasks.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending tasks</p>
              ) : (
                pendingTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="text-blue-700 flex justify-between items-center">
              <span>In Progress</span>
              <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs">{inProgressTasks.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks in progress</p>
              ) : (
                inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-green-700 flex justify-between items-center">
              <span>Completed</span>
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs">
                {completedTasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed tasks</p>
              ) : (
                completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
