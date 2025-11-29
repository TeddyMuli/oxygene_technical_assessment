import { Bookmark } from "@/data/types";
import { Card, CardContent } from "./ui/card";

export default function DetailView({ bookmark }: { bookmark: Bookmark }) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{bookmark.title}</h2>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all text-sm"
        >
          {bookmark.url}
        </a>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <span key={tag.id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {tag.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Description</h3>
          <p className="text-foreground text-sm">{bookmark.description}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2 text-sm">AI Summary</h3>
          <p className="text-foreground leading-relaxed text-sm">{bookmark.ai_summary}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Details</h3>
          <p className="text-muted-foreground text-sm">
            Added on{" "}
            {new Date(bookmark.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
