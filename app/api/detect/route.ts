import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

/**
 * Garment detection API endpoint
 * Uses AI vision models to analyze clothing images
 */

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    let result
    let isFallback = false

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                image: image,
              },
              {
                type: "text",
                text: `Analyze this clothing item and provide a JSON response with the following structure:
{
  "type": "the garment type (e.g., shirt, blouse, dress, pants, jacket, sweater, skirt, etc.)",
  "color": "the primary color (use common color names like white, black, blue, red, etc.)",
  "styleTags": ["array", "of", "style", "descriptors"]
}

Style tags should describe the garment's characteristics like: casual, formal, elegant, sporty, vintage, modern, cotton, silk, denim, leather, button-down, sleeveless, long-sleeve, etc.

Return ONLY the JSON object, no additional text.`,
              },
            ],
          },
        ],
      })

      // Parse the AI response
      try {
        // Clean the response in case there's markdown formatting
        const cleanedText = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()
        result = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error("[v0] Failed to parse AI response:", text)
        // Fallback to demo data if parsing fails
        isFallback = true
        result = {
          type: "shirt",
          color: "white",
          styleTags: ["casual", "cotton", "button-down"],
        }
      }
    } catch (aiError: any) {
      console.error("[v0] Detection API error:", aiError?.message || aiError)
      isFallback = true
      result = {
        type: "shirt",
        color: "white",
        styleTags: ["casual", "cotton", "button-down"],
        _error: aiError?.message || "AI detection unavailable",
      }
    }

    return NextResponse.json({
      ...result,
      _fallback: isFallback,
    })
  } catch (error) {
    console.error("[v0] Detection API error:", error)
    return NextResponse.json({
      type: "shirt",
      color: "white",
      styleTags: ["casual", "cotton"],
      _fallback: true,
      _error: "Detection service unavailable",
    })
  }
}
