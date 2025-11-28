"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMe, updateMe } from "@/data/api"
import type { User as ApiUser, UserUpdate } from "@/data/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const [localUser, setLocalUser] = useState<ApiUser | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
      } else {
        const parsed = JSON.parse(userData)
        setLocalUser(parsed)
        setName(parsed.full_name ?? parsed.name ?? "")
      }
    }
  }, [router])

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const { data: apiUser, isError } = useQuery<ApiUser, Error>({
    queryKey: ["me"],
    queryFn: () => getMe(process.env.NEXT_PUBLIC_API_URL ?? "", token as string),
    enabled: !!token,
  })

  useEffect(() => {
    if (isError) {
      router.push("/login")
    }
  }, [isError, router])

  const user = apiUser ?? localUser

  const handleSave = () => {
    if (user) {
      const updated = { ...user, full_name: name }
      localStorage.setItem("user", JSON.stringify(updated))
      setLocalUser(updated)
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="font-bold text-lg text-foreground">Profile</h1>
          <div className="w-8"></div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4">
            {(user.name ?? (user as any).name).charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{user.name ?? (user as any).name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              {isEditing ? (
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <p className="text-foreground">{user.name ?? (user as any).name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <p className="text-foreground">{user.email}</p>
            </div>

            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
