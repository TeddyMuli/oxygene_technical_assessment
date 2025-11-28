"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AddBookmarkModal } from "@/components/add-bookmark-modal"
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark } from "@/data/api"
import type { Bookmark as ApiBookmark, BookmarkCreate, BookmarkUpdate } from "@/data/types"

export default function BookmarksPage() {
  const [search, setSearch] = useState("")
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const { data: bookmarks = [] } = useQuery<ApiBookmark[], Error>({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(process.env.NEXT_PUBLIC_API_URL ?? "", token as string),
    enabled: !!token,
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation<ApiBookmark, Error, BookmarkCreate>({
    mutationFn: (payload: BookmarkCreate) =>
      createBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      setIsAddModalOpen(false)
    },
  })

  const updateMutation = useMutation<ApiBookmark, Error, { id: string; data: BookmarkUpdate }>({
    mutationFn: ({ id, data }: { id: string; data: BookmarkUpdate }) =>
      updateBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      setIsEditingDetail(false)
    },
  })

  const deleteMutation = useMutation<{ ok: boolean }, Error, string>({
    mutationFn: (id: string) =>
      deleteBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      setSelectedBookmarkId(null)
    },
  })

  const filteredBookmarks = (bookmarks as ApiBookmark[]).filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
      (bookmark.description ?? "").toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddBookmark = (newBookmark: { title: string; url: string; description: string }) => {
    const payload: BookmarkCreate = {
      title: newBookmark.title,
      url: newBookmark.url,
      description: newBookmark.description,
      tags: [],
    }
    createMutation.mutate(payload)
  }

  const selectedBookmark = (bookmarks as ApiBookmark[]).find((b) => String(b.id) === selectedBookmarkId)
  const [isEditingDetail, setIsEditingDetail] = useState(false)
  const [detailTitle, setDetailTitle] = useState("")
  const [detailUrl, setDetailUrl] = useState("")
  const [detailDescription, setDetailDescription] = useState("")

  const startEditing = () => {
    if (!selectedBookmark) return
    setDetailTitle(selectedBookmark.title)
    setDetailUrl(selectedBookmark.url)
    setDetailDescription(selectedBookmark.description ?? "")
    setIsEditingDetail(true)
  }

  const saveDetail = () => {
    if (!selectedBookmark) return
    const data: BookmarkUpdate = {
      title: detailTitle,
      url: detailUrl,
      description: detailDescription,
      tags: [],
    }
    updateMutation.mutate({ id: String(selectedBookmark.id), data })
  }

  const removeDetail = () => {
    if (!selectedBookmark) return
    deleteMutation.mutate(String(selectedBookmark.id))
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full lg:w-96 border-r border-border overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Bookmarks</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
            >
              + Add
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredBookmarks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground text-sm">No bookmarks found</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => setSelectedBookmarkId(bookmark.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedBookmarkId === bookmark.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-semibold text-foreground line-clamp-1 text-sm">{bookmark.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{bookmark.url}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 flex-col">
        {selectedBookmark ? (
          <div className="h-full flex flex-col p-6 bg-card overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedBookmark.title}</h2>
              <a
                href={selectedBookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all text-sm"
              >
                {selectedBookmark.url}
              </a>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2 text-sm">Description</h3>
                <p className="text-foreground text-sm">{selectedBookmark.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2 text-sm">AI Summary</h3>
                <p className="text-foreground leading-relaxed text-sm">{selectedBookmark.aiSummary}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2 text-sm">Details</h3>
                <p className="text-muted-foreground text-sm">
                  Added on{" "}
                  {new Date(selectedBookmark.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            <div className="mt-auto flex gap-2 pt-6 border-t border-border">
              {isEditingDetail ? (
                <>
                  <Input value={detailTitle} onChange={(e) => setDetailTitle(e.target.value)} />
                  <div className="flex-1">
                    <Input value={detailTitle} onChange={(e) => setDetailTitle(e.target.value)} className="mb-2" />
                    <Input value={detailUrl} onChange={(e) => setDetailUrl(e.target.value)} className="mb-2" />
                    <Input value={detailDescription} onChange={(e) => setDetailDescription(e.target.value)} />
                  </div>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={saveDetail}
                    disabled={updateMutation.status === "pending"}
                  >
                    {updateMutation.status === "pending" ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditingDetail(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={startEditing}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={removeDetail}
                    disabled={deleteMutation.status === "pending"}
                  >
                    {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a bookmark to view details</p>
          </div>
        )}
      </div>

      <AddBookmarkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddBookmark} />
    </div>
  )
}
