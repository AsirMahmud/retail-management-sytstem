"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

interface TaskFilterBarProps {
  showAssigneeFilter?: boolean
}

export function TaskFilterBar({ showAssigneeFilter = true }: TaskFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Sample staff members for the dropdown
  const staffMembers = ["all", "John Doe", "Sarah Williams", "Alex Johnson", "Emily Davis", "Michael Brown"]

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {showAssigneeFilter && (
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] flex-1 sm:flex-initial">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff} value={staff}>
                    {staff === "all" ? "All Assignees" : staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[140px] flex-1 sm:flex-initial">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Button>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
