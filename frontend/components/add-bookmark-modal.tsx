"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface AddBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (bookmark: { title: string; url: string; description: string; }) => void
}

export function AddBookmarkModal({ isOpen, onClose, onAdd }: AddBookmarkModalProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (title && url && description) {
      onAdd({ title, url, description })
      setTitle("")
      setUrl("")
      setDescription("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Add New Bookmark</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <Input placeholder="Bookmark title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL</label>
              <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Input
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Add Bookmark
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
