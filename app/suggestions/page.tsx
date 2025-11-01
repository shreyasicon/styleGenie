"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, ArrowLeft, Loader2, AlertCircle, Shuffle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loadCombination } from "@/lib/cache-utils"

export default function SuggestionsPage() {
  const router = useRouter()
  const [shirt, setShirt] = useState<any>(null)
  const [pant, setPant] = useState<any>(null)
  const [shoe, setShoe] = useState<any>(null)
  const [addon, setAddon] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [savingLook, setSavingLook] = useState(false)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    const combination = loadCombination()

    if (!combination) {
      router.push("/")
      return
    }

    setShirt(combination.shirt)
    setPant(combination.pant)
    setShoe(combination.shoe)
    setAddon(combination.addon)
    setPreferences(combination.preferences || {})
    setIsFallback(
      combination.shirt._fallback ||
        combination.pant._fallback ||
        combination.shoe?._fallback ||
        combination.addon?._fallback,
    )
  }, [router])

  const handleSaveLook = async () => {
    setSavingLook(true)

    try {
      const look = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        suggestion: {
          title: `Complete Outfit`,
          description: `Perfect for ${preferences?.eventType || "any occasion"}${preferences?.country ? ` in ${preferences.country}` : ""}`,
          mockupImage: shirt.image || "/placeholder.svg",
          pieces: [
            { item: "shirt", color: shirt.color || "#ccc" },
            { item: "pant", color: pant.color || "#ccc" },
            { item: "shoe", color: shoe.color || "#ccc" },
            { item: "addon", color: addon.color || "#ccc" },
          ],
        },
        shirt,
        pant,
        shoe,
        addon,
        preferences,
      }

      const saved = localStorage.getItem("myLooks")
      const looks = saved ? JSON.parse(saved) : []
      looks.unshift(look)
      localStorage.setItem("myLooks", JSON.stringify(looks))

      console.log("[v0] Look saved successfully:", look)

      setTimeout(() => {
        setSavingLook(false)
        router.push("/")
      }, 500)
    } catch (error) {
      console.error("[v0] Error saving look:", error)
      setSavingLook(false)
    }
  }

  if (!shirt || !pant || !shoe || !addon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StyleGenie</span>
          </Link>
          <Link href="/my-looks">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              My Looks
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <Link href="/upload">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-balance">Your Recommended Outfit</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              {preferences?.eventType || preferences?.country
                ? `Perfect for ${preferences.eventType || "your event"}${preferences.country ? ` in ${preferences.country}` : ""}`
                : "We selected a complete outfit from your wardrobe"}
            </p>
          </div>

          {isFallback && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                AI detection is currently unavailable. Showing example suggestions with demo data.
              </AlertDescription>
            </Alert>
          )}

          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Recommended Outfit</CardTitle>
                  <CardDescription className="mt-1">This combination looks great together!</CardDescription>
                </div>
                <Badge className="text-lg px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Good Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={shirt.image || "/placeholder.svg"}
                      alt="Selected shirt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      Shirt
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: shirt.color }}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{shirt.color}</span>
                    </div>
                    {shirt.styleTags && shirt.styleTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {shirt.styleTags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={pant.image || "/placeholder.svg"}
                      alt="Selected pant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      Pant
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: pant.color }}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{pant.color}</span>
                    </div>
                    {pant.styleTags && pant.styleTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pant.styleTags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={shoe.image || "/placeholder.svg"}
                      alt="Selected shoe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      Shoes
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: shoe.color }}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{shoe.color}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={addon.image || "/placeholder.svg"}
                      alt="Selected add-on"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      Add-on
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: addon.color }}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{addon.color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {(preferences?.country || preferences?.eventType || preferences?.specifications) && (
                <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-sm">Your Preferences:</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.country && (
                      <Badge variant="secondary" className="capitalize">
                        {preferences.country}
                      </Badge>
                    )}
                    {preferences.eventType && (
                      <Badge variant="secondary" className="capitalize">
                        {preferences.eventType}
                      </Badge>
                    )}
                  </div>
                  {preferences.specifications && (
                    <p className="text-sm text-muted-foreground">{preferences.specifications}</p>
                  )}
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Why this works:</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  This complete outfit combines your {shirt.color} shirt, {pant.color} pants, {shoe.color} shoes, and{" "}
                  {addon.color} accessories
                  {preferences?.eventType && `, making it perfect for ${preferences.eventType} occasions`}. The
                  combination is {preferences?.country === "india" ? "culturally appropriate and " : ""}
                  versatile and stylish.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push("/upload")} variant="outline" className="flex-1 gap-2">
                  <Shuffle className="h-4 w-4" />
                  Try Another
                </Button>
                <Button onClick={handleSaveLook} disabled={savingLook} className="flex-1 gap-2">
                  {savingLook ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Save Look
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
