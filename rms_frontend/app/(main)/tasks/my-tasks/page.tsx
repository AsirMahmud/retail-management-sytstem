import type { Metadata } from "next"
import { MyTasksList } from "@/components/tasks/my-tasks-list"
import { TaskFilterBar } from "@/components/tasks/task-filter-bar"

export const metadata: Metadata = {
  title: "My Tasks",
  description: "View and manage your assigned tasks",
}

export default function MyTasksPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">View and manage your assigned tasks</p>
        </div>
        <TaskFilterBar showAssigneeFilter={false} />
      </div>

      <MyTasksList />
    </div>
  )
}
