"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Sparkles, Heart, Shirt, X } from "lucide-react"
import { loadWardrobe, clearWardrobe, type CachedWardrobe } from "@/lib/cache-utils"

export default function HomePage() {
  const [wardrobe, setWardrobe] = useState<CachedWardrobe | null>(null)
  const [savedLooks, setSavedLooks] = useState<any[]>([])

  useEffect(() => {
    // Load cached wardrobe on mount
    const cached = loadWardrobe()
    setWardrobe(cached)

    const saved = localStorage.getItem("myLooks")
    if (saved) {
      const parsedLooks = JSON.parse(saved)
      const validLooks = parsedLooks.filter((look: any) => look && look.shirt && look.pant && look.shoe && look.addon)
      setSavedLooks(validLooks)
    }
  }, [])

  const handleClearWardrobe = () => {
    clearWardrobe()
    setWardrobe(null)
  }

  const hasImages =
    wardrobe &&
    (wardrobe.shirts.length > 0 || wardrobe.pants.length > 0 || wardrobe.shoes.length > 0 || wardrobe.addons.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-balance">StyleGenie</span>
          </Link>
          <Link href="/my-looks">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              My Looks
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">Your AI Fashion Stylist</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
            Upload photos of your wardrobe and let StyleGenie create perfect outfit combinations tailored just for you
          </p>
        </div>
      </section>

      {/* Upload Card */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your Garments</CardTitle>
              <CardDescription className="text-base">
                Upload shirts, pants, shoes, and accessories to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/upload?source=camera" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    <Camera className="h-8 w-8" />
                    <span className="text-base font-medium">Take Photo</span>
                  </Button>
                </Link>
                <Link href="/upload?source=file" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-base font-medium">Upload File</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {hasImages && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-primary" />
                  Your Wardrobe
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearWardrobe}
                  className="gap-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Shirts */}
              {wardrobe.shirts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Shirts ({wardrobe.shirts.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {wardrobe.shirts.map((shirt, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={shirt.preview || "/placeholder.svg"}
                          alt={`Shirt ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pants */}
              {wardrobe.pants.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Pants ({wardrobe.pants.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {wardrobe.pants.map((pant, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={pant.preview || "/placeholder.svg"}
                          alt={`Pant ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wardrobe.shoes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Shoes ({wardrobe.shoes.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {wardrobe.shoes.map((shoe, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={shoe.preview || "/placeholder.svg"}
                          alt={`Shoe ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wardrobe.addons.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Add-ons ({wardrobe.addons.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {wardrobe.addons.map((addon, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={addon.preview || "/placeholder.svg"}
                          alt={`Add-on ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/upload">
                <Button variant="outline" className="w-full bg-transparent">
                  Add More Items
                </Button>
              </Link>
            </div>
          )}

          {savedLooks.length > 0 && (
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Liked Combos
                </h2>
                <Link href="/my-looks">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedLooks.slice(0, 3).map((look) => {
                  if (!look?.shirt || !look?.pant || !look?.shoe || !look?.addon) return null

                  return (
                    <Card key={look.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">Complete Outfit</h3>
                          <span className="text-xs text-muted-foreground">
                            {look.preferences?.eventType || "Casual"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={look.shirt.preview || look.shirt.image || "/placeholder.svg"}
                              alt="Shirt"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={look.pant.preview || look.pant.image || "/placeholder.svg"}
                              alt="Pant"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={look.shoe.preview || look.shoe.image || "/placeholder.svg"}
                              alt="Shoes"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={look.addon.preview || look.addon.image || "/placeholder.svg"}
                              alt="Add-on"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {look.preferences && (
                          <p className="text-xs text-muted-foreground">
                            {look.preferences.country && `${look.preferences.country} • `}
                            {look.preferences.specifications || "Perfect combination"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {savedLooks.length > 3 && (
                <Link href="/my-looks">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All {savedLooks.length} Liked Combos
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Smart Selection</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Randomly picks perfect combinations from your wardrobe
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Complete Outfits</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Shirt, pants, shoes, and accessories all matched
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Save Looks</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Build your personal collection of favorite outfits
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
