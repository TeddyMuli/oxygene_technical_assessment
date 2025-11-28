import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BookmarkCardProps {
  bookmark: {
    id: string
    title: string
    url: string
    description: string
    aiSummary: string
    createdAt: string
  }
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle className="line-clamp-1">{bookmark.title}</CardTitle>
        <CardDescription className="line-clamp-1">{bookmark.url}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground mb-3">{bookmark.description}</p>
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-1">AI Summary</p>
          <p className="text-sm text-foreground line-clamp-2">{bookmark.aiSummary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
