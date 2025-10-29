import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate mock analysis data
    const mockData = {
      total_score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
      categories: {
        clarity: Math.floor(Math.random() * 8) + 12, // 12-20
        ux: Math.floor(Math.random() * 8) + 12,      // 12-20
        mobile: Math.floor(Math.random() * 8) + 12,  // 12-20
        copy: Math.floor(Math.random() * 8) + 12,    // 12-20
        speed: Math.floor(Math.random() * 8) + 12,   // 12-20
      },
      issues: [
        "Headline doesn't clearly explain what you offer",
        "Call-to-action button is below the fold",
        "Mobile layout spacing feels cramped",
        "Loading speed could be improved",
        "Navigation menu is confusing",
        "Value proposition is unclear"
      ].slice(0, 3), // Take first 3 issues
      recommendations: [
        "Use a simple, benefit-driven headline that explains your core value",
        "Move your primary CTA button above the fold for better visibility",
        "Increase padding and spacing on mobile sections for better readability",
        "Optimize images and reduce page load time to under 3 seconds",
        "Simplify navigation with clear, descriptive menu labels",
        "Add social proof and testimonials near your main value proposition"
      ].slice(0, 3), // Take first 3 recommendations
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
}