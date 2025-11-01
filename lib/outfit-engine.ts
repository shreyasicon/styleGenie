import type { OutfitSuggestion } from "./types"

/**
 * Rule-based outfit suggestion engine
 * Uses color harmony principles and garment type matching
 */

// Color harmony rules: complementary and neutral pairings
const colorHarmony: Record<string, string[]> = {
  white: ["black", "navy", "gray", "beige"],
  black: ["white", "gray", "red", "gold"],
  blue: ["white", "beige", "brown", "gray"],
  navy: ["white", "beige", "khaki", "burgundy"],
  red: ["black", "white", "navy", "gray"],
  green: ["beige", "brown", "white", "navy"],
  yellow: ["navy", "gray", "white", "denim"],
  pink: ["gray", "white", "navy", "beige"],
  gray: ["white", "black", "navy", "burgundy"],
  brown: ["beige", "white", "cream", "olive"],
  beige: ["white", "brown", "navy", "olive"],
}

// Outfit templates based on garment type
const outfitTemplates: Record<
  string,
  Array<{
    title: string
    description: string
    pieces: Array<{ item: string; colorKey: "base" | "complement1" | "complement2" | "neutral" }>
  }>
> = {
  shirt: [
    {
      title: "Smart Casual",
      description: "Perfect for office or dinner dates",
      pieces: [
        { item: "Dark trousers", colorKey: "complement1" },
        { item: "Leather belt", colorKey: "complement2" },
        { item: "Dress shoes", colorKey: "complement1" },
      ],
    },
    {
      title: "Weekend Casual",
      description: "Relaxed and comfortable for everyday wear",
      pieces: [
        { item: "Denim jeans", colorKey: "complement2" },
        { item: "Canvas sneakers", colorKey: "neutral" },
        { item: "Casual watch", colorKey: "complement1" },
      ],
    },
  ],
  blouse: [
    {
      title: "Professional Chic",
      description: "Polished look for the workplace",
      pieces: [
        { item: "Pencil skirt", colorKey: "complement1" },
        { item: "Blazer", colorKey: "complement2" },
        { item: "Heeled pumps", colorKey: "complement1" },
      ],
    },
    {
      title: "Brunch Ready",
      description: "Effortlessly stylish for daytime outings",
      pieces: [
        { item: "High-waisted jeans", colorKey: "complement2" },
        { item: "Statement earrings", colorKey: "base" },
        { item: "Ankle boots", colorKey: "complement1" },
      ],
    },
  ],
  dress: [
    {
      title: "Evening Elegance",
      description: "Sophisticated for special occasions",
      pieces: [
        { item: "Strappy heels", colorKey: "complement1" },
        { item: "Clutch bag", colorKey: "complement2" },
        { item: "Statement necklace", colorKey: "neutral" },
      ],
    },
    {
      title: "Daytime Charm",
      description: "Fresh and feminine for casual events",
      pieces: [
        { item: "Denim jacket", colorKey: "complement2" },
        { item: "Crossbody bag", colorKey: "complement1" },
        { item: "White sneakers", colorKey: "neutral" },
      ],
    },
  ],
  pants: [
    {
      title: "Business Professional",
      description: "Sharp and confident for meetings",
      pieces: [
        { item: "Crisp button-down", colorKey: "neutral" },
        { item: "Blazer", colorKey: "complement1" },
        { item: "Oxford shoes", colorKey: "complement2" },
      ],
    },
    {
      title: "Smart Casual",
      description: "Versatile for work or play",
      pieces: [
        { item: "Fitted sweater", colorKey: "complement2" },
        { item: "Loafers", colorKey: "complement1" },
        { item: "Leather bag", colorKey: "complement2" },
      ],
    },
  ],
  jacket: [
    {
      title: "Layered Look",
      description: "Stylish warmth for cooler days",
      pieces: [
        { item: "Basic tee", colorKey: "neutral" },
        { item: "Slim jeans", colorKey: "complement1" },
        { item: "Boots", colorKey: "complement2" },
      ],
    },
    {
      title: "Street Style",
      description: "Urban edge with comfort",
      pieces: [
        { item: "Hoodie", colorKey: "complement2" },
        { item: "Joggers", colorKey: "complement1" },
        { item: "High-top sneakers", colorKey: "neutral" },
      ],
    },
  ],
}

// Default template for unknown garment types
const defaultTemplate = [
  {
    title: "Classic Combination",
    description: "Timeless pairing that always works",
    pieces: [
      { item: "Neutral bottoms", colorKey: "complement1" as const },
      { item: "Complementary shoes", colorKey: "complement2" as const },
      { item: "Simple accessories", colorKey: "neutral" as const },
    ],
  },
  {
    title: "Modern Mix",
    description: "Contemporary style with personality",
    pieces: [
      { item: "Statement piece", colorKey: "complement2" as const },
      { item: "Coordinating item", colorKey: "complement1" as const },
      { item: "Finishing touch", colorKey: "neutral" as const },
    ],
  },
]

export function generateOutfitSuggestions(garmentType: string, garmentColor: string): OutfitSuggestion[] {
  if (!garmentType || !garmentColor) {
    console.warn("[v0] Missing garment type or color, using defaults")
    return defaultTemplate.map((template, index) => ({
      title: template.title,
      description: template.description,
      pieces: template.pieces.map((piece) => ({
        item: piece.item,
        color: "gray",
      })),
      mockupImage: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(template.title + " outfit mockup")}`,
    }))
  }

  // Normalize inputs
  const type = garmentType.toLowerCase()
  const color = garmentColor.toLowerCase()

  // Get complementary colors
  const complements = colorHarmony[color] || ["white", "black", "gray"]

  // Get outfit templates for this garment type
  const templates = outfitTemplates[type] || defaultTemplate

  // Generate suggestions
  return templates.map((template, index) => {
    const colorMap = {
      base: garmentColor,
      complement1: complements[0] || "black",
      complement2: complements[1] || "white",
      neutral: complements[2] || "gray",
    }

    return {
      title: template.title,
      description: template.description,
      pieces: template.pieces.map((piece) => ({
        item: piece.item,
        color: colorMap[piece.colorKey],
      })),
      mockupImage: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
        `${garmentColor} ${garmentType} ${template.title} outfit combination`,
      )}`,
    }
  })
}
