"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return null

  const isDetailPage = pathname !== "/bookmarks"

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/bookmarks" className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-foreground">Bookmarks</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/bookmarks" className="text-sm font-medium text-foreground hover:text-primary">
              My Bookmarks
            </Link>
            <Link href="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm group-hover:opacity-80 transition">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {isDetailPage && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-border overflow-y-auto">
            {children}
          </div>
        )}

        {!isDetailPage && <main className="flex-1">{children}</main>}
      </div>
    </div>
  )
}
