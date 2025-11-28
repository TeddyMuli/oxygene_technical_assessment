"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBookmark, updateBookmark, deleteBookmark } from "@/data/api"
import type { Bookmark as ApiBookmark, BookmarkUpdate } from "@/data/types"
import { Input } from "@/components/ui/input"

export default function BookmarkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const { data: bookmark, isLoading } = useQuery<any, any>(["bookmark", id], () =>
    getBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, Number(id)),
    { enabled: !!token && !!id },
  )

  const queryClient = useQueryClient()

  const updateMutation = useMutation<ApiBookmark, Error, { id: string; data: BookmarkUpdate }>({
    mutationFn: ({ id, data }) =>
      updateBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, Number(id), data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      queryClient.invalidateQueries({ queryKey: ["bookmark", id] })
    },
  })

  const deleteMutation = useMutation<{ ok: boolean }, Error, string>({
    mutationFn: (id) => deleteBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, Number(id)),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")

  const startEdit = () => {
    if (!bookmark) return
    const b = bookmark as unknown as ApiBookmark
    setTitle(b.title)
    setUrl(b.url)
    setDescription((b as any).description ?? "")
    setIsEditing(true)
  }

  const save = () => {
    if (!bookmark) return
    const b = bookmark as unknown as ApiBookmark
    const data: BookmarkUpdate = { title, url, description, tags: [] }
    updateMutation.mutate({ id: String(b.id), data })
    setIsEditing(false)
  }

  const remove = () => {
    if (!bookmark) return
    const b = bookmark as unknown as ApiBookmark
    deleteMutation.mutate(String(b.id))
  }

  if (isLoading) {
    return null
  }

  if (!bookmark) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Bookmark not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6 bg-card">
      <button
        onClick={() => router.back()}
        className="mb-6 text-primary hover:underline text-sm font-medium flex items-center gap-1"
      >
        ← Back to Bookmarks
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{(bookmark as unknown as ApiBookmark).title}</h1>
          <a
              href={(bookmark as unknown as ApiBookmark).url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all text-sm"
          >
                {(bookmark as unknown as ApiBookmark).url}
          </a>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{(bookmark as unknown as ApiBookmark).description}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">AI Summary</CardTitle>
            <CardDescription>Generated summary of this bookmark</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{(bookmark as unknown as ApiBookmark).ai_summary ?? (bookmark as unknown as ApiBookmark).aiSummary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-muted-foreground">
                Added on{" "}
                {new Date((bookmark as unknown as ApiBookmark).createdAt ?? (bookmark as any).created_at ?? "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

          <div className="mt-6 flex gap-2 pt-6 border-t border-border">
            {isEditing ? (
              <>
                <div className="flex-1">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" />
                  <Input value={url} onChange={(e) => setUrl(e.target.value)} className="mb-2" />
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={save} disabled={updateMutation.status === "pending"}>
                  {updateMutation.status === "pending" ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={startEdit}>
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={remove} disabled={deleteMutation.status === "pending"}>
                  {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
    </div>
  )
}
