import { Calendar, CheckCircle2, Clock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: string
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

const upcomingTasks: Task[] = [
  {
    id: "task-1",
    title: "Order new inventory for summer collection",
    dueDate: "Today, 5:00 PM",
    priority: "high",
    completed: false,
  },
  {
    id: "task-2",
    title: "Review staff schedules for next week",
    dueDate: "Tomorrow, 10:00 AM",
    priority: "medium",
    completed: false,
  },
  {
    id: "task-3",
    title: "Finalize end-of-month sales report",
    dueDate: "May 31, 2023",
    priority: "high",
    completed: false,
  },
  {
    id: "task-4",
    title: "Meet with new supplier for fall collection",
    dueDate: "Jun 2, 2023",
    priority: "medium",
    completed: false,
  },
  {
    id: "task-5",
    title: "Update product descriptions on website",
    dueDate: "Jun 5, 2023",
    priority: "low",
    completed: false,
  },
  {
    id: "task-6",
    title: "Conduct monthly inventory audit",
    dueDate: "Jun 10, 2023",
    priority: "high",
    completed: false,
  },
]

export function UpcomingTasks() {
  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Low
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3">
              <Checkbox id={task.id} className="mt-1" />
              <div className="space-y-1 flex-1">
                <label
                  htmlFor={task.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {task.title}
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {task.dueDate}
                  </div>
                  <div>{getPriorityBadge(task.priority)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>6 upcoming tasks</span>
        </div>
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span>2 completed today</span>
        </div>
      </div>
    </div>
  )
}
