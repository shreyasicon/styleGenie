"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Trash2, Upload } from "lucide-react"
import type { SavedLook } from "@/lib/types"

export default function MyLooksPage() {
  const [looks, setLooks] = useState<SavedLook[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("myLooks")
    if (saved) {
      setLooks(JSON.parse(saved))
    }
  }, [])

  const handleDelete = (id: string) => {
    const updated = looks.filter((look) => look.id !== id)
    setLooks(updated)
    localStorage.setItem("myLooks", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StyleGenie</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
                <Heart className="h-8 w-8 text-primary" />
                My Saved Looks
              </h1>
              <p className="text-muted-foreground mt-2">Your collection of favorite outfit combinations</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {looks.length} {looks.length === 1 ? "Look" : "Looks"}
            </Badge>
          </div>

          {looks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No saved looks yet</h3>
                  <p className="text-muted-foreground text-pretty">
                    Upload a garment and save your favorite outfit suggestions to see them here
                  </p>
                </div>
                <Link href="/">
                  <Button className="gap-2 mt-4">
                    <Upload className="h-4 w-4" />
                    Upload Garment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {looks.map((look) => (
                <Card key={look.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative">
                    <img
                      src={look.suggestion.mockupImage || "/placeholder.svg"}
                      alt={look.suggestion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{look.suggestion.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {new Date(look.savedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {look.garmentType}
                      </Badge>
                      <div
                        className="w-5 h-5 rounded-full border border-border"
                        style={{ backgroundColor: look.garmentColor }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <ul className="space-y-1">
                        {look.suggestion.pieces.slice(0, 3).map((piece, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                              style={{ backgroundColor: piece.color }}
                            />
                            <span className="truncate">{piece.item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(look.id)}
                      className="w-full gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
