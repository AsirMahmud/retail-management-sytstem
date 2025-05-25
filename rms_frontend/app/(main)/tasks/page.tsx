import type { Metadata } from "next"
import { TaskBoard } from "@/components/tasks/task-board"
import { TaskSummaryCards } from "@/components/tasks/task-summary-cards"
import { TaskFilterBar } from "@/components/tasks/task-filter-bar"

export const metadata: Metadata = {
  title: "Task Board",
  description: "Manage and track tasks across your retail business",
}

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">Manage and track tasks across your retail business</p>
        </div>
        <TaskFilterBar />
      </div>

      <TaskSummaryCards />
      <TaskBoard />
    </div>
  )
}
