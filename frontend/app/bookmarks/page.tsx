"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AddBookmarkModal } from "@/components/add-bookmark-modal"
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark, getTags } from "@/data/api"
import type { Bookmark as ApiBookmark, BookmarkCreate, BookmarkUpdate, Tag } from "@/data/types"
import DetailView from "@/components/detail-view"

export default function BookmarksPage() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditingDetail, setIsEditingDetail] = useState(false)
  const [detailTitle, setDetailTitle] = useState("")
  const [detailUrl, setDetailUrl] = useState("")
  const [detailDescription, setDetailDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const { data: bookmarks = [] } = useQuery<ApiBookmark[], Error>({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(process.env.NEXT_PUBLIC_API_URL ?? "", token as string),
    enabled: !!token,
  })

  const { data: tags = [] } = useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: () => getTags(process.env.NEXT_PUBLIC_API_URL ?? "", token as string),
    enabled: !!token
  })

  const createMutation = useMutation<ApiBookmark, Error, BookmarkCreate>({
    mutationFn: (payload: BookmarkCreate) =>
      createBookmark(process.env.NEXT_PUBLIC_API_URL ?? "", token as string, payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "tags"] })
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

  const filteredBookmarks = (bookmarks as ApiBookmark[]).filter((bookmark) => {
    const searchTerm = search.trim().toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      bookmark.title.toLowerCase().includes(searchTerm) ||
      (bookmark.description ?? "").toLowerCase().includes(searchTerm)

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagName) => bookmark.tags.some((t) => t.name === tagName))

    return matchesSearch && matchesTags
  })

  const handleAddBookmark = (newBookmark: { title: string; url: string; description: string, tags: string[] }) => {
    const payload: BookmarkCreate = {
      title: newBookmark.title,
      url: newBookmark.url,
      description: newBookmark.description,
      tags: newBookmark.tags,
    }
    createMutation.mutate(payload)
  }

  const selectedBookmark = (bookmarks as ApiBookmark[]).find((b) => String(b.id) === selectedBookmarkId)

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

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
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
          {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag.name)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
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
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {bookmark.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{bookmark.tags.length - 2}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedBookmark && (
        <>
          {(() => {
        const DetailBody = () => (
          <div className="flex-1 p-4">
            <DetailView bookmark={selectedBookmark} />
          </div>
        )

        const ActionButtons = () =>
          isEditingDetail ? (
            <>
          <div className="flex-1">
            <Input
              value={detailTitle}
              onChange={(e) => setDetailTitle(e.target.value)}
              className="mb-2"
              placeholder="Title"
            />
            <Input
              value={detailUrl}
              onChange={(e) => setDetailUrl(e.target.value)}
              className="mb-2"
              placeholder="URL"
            />
            <Input
              value={detailDescription}
              onChange={(e) => setDetailDescription(e.target.value)}
              placeholder="Description"
            />
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
          )

        return (
          <>
            <div className="flex lg:hidden fixed inset-0 flex-col bg-background z-50 overflow-y-auto">
          <div className="sticky top-0 bg-background border-b border-border p-4">
            <button
              onClick={() => setSelectedBookmarkId(null)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to list
            </button>
          </div>

          <DetailBody />

          <div className="flex gap-2 p-4 border-t border-border bg-background sticky bottom-0">
            <ActionButtons />
          </div>
            </div>

            <div className="hidden lg:flex flex-1 flex-col p-6 bg-card overflow-y-auto">
          <DetailBody />

          <div className="mt-auto flex gap-2 pt-6 border-t border-border">
            <ActionButtons />
          </div>
            </div>
          </>
        )
          })()}
        </>
      )}

      {!selectedBookmark && (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-muted-foreground">
          <p>Select a bookmark to view details</p>
        </div>
      )}

      <AddBookmarkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddBookmark} />
    </div>
  )
}
