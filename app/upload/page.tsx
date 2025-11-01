"use client"

import type React from "react"

import { useState, useRef, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Upload, ArrowLeft, Loader2, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { saveWardrobe, loadWardrobe, saveCombination } from "@/lib/cache-utils"

function UploadContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get("source")
  const shirtInputRef = useRef<HTMLInputElement>(null)
  const pantInputRef = useRef<HTMLInputElement>(null)
  const shoeInputRef = useRef<HTMLInputElement>(null)
  const addonInputRef = useRef<HTMLInputElement>(null)

  const [shirts, setShirts] = useState<Array<{ file: File; preview: string }>>([])
  const [pants, setPants] = useState<Array<{ file: File; preview: string }>>([])
  const [shoes, setShoes] = useState<Array<{ file: File; preview: string }>>([])
  const [addons, setAddons] = useState<Array<{ file: File; preview: string }>>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [country, setCountry] = useState("")
  const [eventType, setEventType] = useState("")
  const [specifications, setSpecifications] = useState("")

  useEffect(() => {
    const cached = loadWardrobe()
    if (cached) {
      setShirts(cached.shirts.map((s) => ({ file: null as any, preview: s.preview })))
      setPants(cached.pants.map((p) => ({ file: null as any, preview: p.preview })))
      setShoes(cached.shoes?.map((s) => ({ file: null as any, preview: s.preview })) || [])
      setAddons(cached.addons?.map((a) => ({ file: null as any, preview: a.preview })) || [])
    }
  }, [])

  useEffect(() => {
    if (shirts.length > 0 || pants.length > 0 || shoes.length > 0 || addons.length > 0) {
      saveWardrobe(shirts, pants, shoes, addons)
    }
  }, [shirts, pants, shoes, addons])

  const handleShirtSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setShirts((prev) => [...prev, { file, preview: reader.result as string }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePantSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPants((prev) => [...prev, { file, preview: reader.result as string }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleShoeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setShoes((prev) => [...prev, { file, preview: reader.result as string }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddonSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAddons((prev) => [...prev, { file, preview: reader.result as string }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeShirt = (index: number) => {
    setShirts((prev) => prev.filter((_, i) => i !== index))
  }

  const removePant = (index: number) => {
    setPants((prev) => prev.filter((_, i) => i !== index))
  }

  const removeShoe = (index: number) => {
    setShoes((prev) => prev.filter((_, i) => i !== index))
  }

  const removeAddon = (index: number) => {
    setAddons((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDetect = async () => {
    if (shirts.length === 0 || pants.length === 0 || shoes.length === 0 || addons.length === 0) return

    setIsDetecting(true)

    const randomShirt = shirts[Math.floor(Math.random() * shirts.length)]
    const randomPant = pants[Math.floor(Math.random() * pants.length)]
    const randomShoe = shoes[Math.floor(Math.random() * shoes.length)]
    const randomAddon = addons[Math.floor(Math.random() * addons.length)]

    saveCombination({
      shirt: {
        type: "shirt",
        color: "selected",
        styleTags: [],
        image: randomShirt.preview,
      },
      pant: {
        type: "pant",
        color: "selected",
        styleTags: [],
        image: randomPant.preview,
      },
      shoe: {
        type: "shoe",
        color: "selected",
        styleTags: [],
        image: randomShoe.preview,
      },
      addon: {
        type: "addon",
        color: "selected",
        styleTags: [],
        image: randomAddon.preview,
      },
      preferences: {
        country,
        eventType,
        specifications,
      },
    })

    router.push("/suggestions")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StyleGenie</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload Shirts</CardTitle>
                <CardDescription>Upload one or more shirts from your wardrobe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  ref={shirtInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture={source === "camera" ? "environment" : undefined}
                  onChange={handleShirtSelect}
                  className="hidden"
                />

                {shirts.length === 0 ? (
                  <Button
                    onClick={() => shirtInputRef.current?.click()}
                    size="lg"
                    className="w-full h-48 flex-col gap-3 bg-muted hover:bg-muted/80 text-foreground"
                  >
                    <Upload className="h-12 w-12" />
                    <span>Upload Shirts</span>
                    <span className="text-sm text-muted-foreground">Select one or more shirt images</span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {shirts.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={`Shirt ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeShirt(index)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => shirtInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add More</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload Pants</CardTitle>
                <CardDescription>Upload one or more pants from your wardrobe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  ref={pantInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture={source === "camera" ? "environment" : undefined}
                  onChange={handlePantSelect}
                  className="hidden"
                />

                {pants.length === 0 ? (
                  <Button
                    onClick={() => pantInputRef.current?.click()}
                    size="lg"
                    className="w-full h-48 flex-col gap-3 bg-muted hover:bg-muted/80 text-foreground"
                  >
                    <Upload className="h-12 w-12" />
                    <span>Upload Pants</span>
                    <span className="text-sm text-muted-foreground">Select one or more pant images</span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pants.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={`Pant ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePant(index)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => pantInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add More</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload Shoes</CardTitle>
                <CardDescription>Upload one or more shoes from your wardrobe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  ref={shoeInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture={source === "camera" ? "environment" : undefined}
                  onChange={handleShoeSelect}
                  className="hidden"
                />

                {shoes.length === 0 ? (
                  <Button
                    onClick={() => shoeInputRef.current?.click()}
                    size="lg"
                    className="w-full h-48 flex-col gap-3 bg-muted hover:bg-muted/80 text-foreground"
                  >
                    <Upload className="h-12 w-12" />
                    <span>Upload Shoes</span>
                    <span className="text-sm text-muted-foreground">Select one or more shoe images</span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {shoes.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={`Shoe ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeShoe(index)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => shoeInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add More</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload Add-ons</CardTitle>
                <CardDescription>Upload accessories like watches, bags, jewelry, etc.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  ref={addonInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture={source === "camera" ? "environment" : undefined}
                  onChange={handleAddonSelect}
                  className="hidden"
                />

                {addons.length === 0 ? (
                  <Button
                    onClick={() => addonInputRef.current?.click()}
                    size="lg"
                    className="w-full h-48 flex-col gap-3 bg-muted hover:bg-muted/80 text-foreground"
                  >
                    <Upload className="h-12 w-12" />
                    <span>Upload Add-ons</span>
                    <span className="text-sm text-muted-foreground">Select accessories images</span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {addons.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={`Add-on ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeAddon(index)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addonInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add More</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {shirts.length > 0 && pants.length > 0 && shoes.length > 0 && addons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Your Preferences</CardTitle>
                  <CardDescription>Tell us more about the occasion to get better recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="japan">Japan</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="italy">Italy</SelectItem>
                          <SelectItem value="spain">Spain</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select value={eventType} onValueChange={setEventType}>
                        <SelectTrigger id="eventType">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="party">Party</SelectItem>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="date">Date Night</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specifications">Additional Specifications (Optional)</Label>
                    <Input
                      id="specifications"
                      placeholder="e.g., prefer bright colors, need comfortable fit, outdoor event..."
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <Button
                  onClick={handleDetect}
                  disabled={
                    isDetecting ||
                    shirts.length === 0 ||
                    pants.length === 0 ||
                    shoes.length === 0 ||
                    addons.length === 0
                  }
                  size="lg"
                  className="w-full gap-2"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Your Outfit...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Get Recommendation
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  {shirts.length === 0 || pants.length === 0 || shoes.length === 0 || addons.length === 0
                    ? "Upload at least one item from each category to continue"
                    : `Ready to pick from ${shirts.length} shirt${shirts.length > 1 ? "s" : ""}, ${pants.length} pant${pants.length > 1 ? "s" : ""}, ${shoes.length} shoe${shoes.length > 1 ? "s" : ""}, and ${addons.length} add-on${addons.length > 1 ? "s" : ""}`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  )
}
