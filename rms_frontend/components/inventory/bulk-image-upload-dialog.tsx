"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

export function BulkImageUploadDialog() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Update Images</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Variation Images</DialogTitle>
          <DialogDescription>Upload multiple images for your product variations at once.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-medium">Drag & drop files or click to upload</h3>
              <p className="text-sm text-muted-foreground">Upload images for your product variations</p>
              <label className="cursor-pointer">
                <Button variant="secondary" className="mt-2">
                  Select Files
                </Button>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({files.length})</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Naming Convention</Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>For automatic assignment, name your files using the variation code:</p>
              <p>
                <strong>Example:</strong> S-Black.jpg, M-White.jpg, L-Mixed.jpg
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Upload & Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
