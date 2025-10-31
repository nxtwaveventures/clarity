import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAnalyzer } from '@/lib/analyzer';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid website URL.' },
        { status: 400 }
      );
    }

    console.log(`Starting enterprise-grade analysis for: ${url}`);

    // Initialize enterprise-grade analyzer
    const analyzer = new WebsiteAnalyzer();
    
    // Perform comprehensive multi-dimensional analysis
    const analysis = await analyzer.analyze(url);

    console.log(`Analysis completed. Overall score: ${analysis.overallScore}`);

    return NextResponse.json({
      success: true,
      analysis,
      tier: 'free', // Mark as free tier analysis
      upgradeAvailable: analysis.premiumInsightsAvailable > 0
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Provide helpful error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        message: errorMessage.includes('ENOTFOUND') 
          ? 'Could not reach the website. Please check the URL and try again.'
          : errorMessage.includes('timeout')
          ? 'Website took too long to respond. Please try again.'
          : 'Unable to analyze the website. Please try a different URL.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    version: '1.0.0',
    engine: 'enterprise-grade-analyzer',
    capabilities: [
      'Content Analysis',
      'SEO Analysis',
      'Performance Analysis',
      'Design Analysis',
      'Psychology Analysis',
      'Accessibility Analysis'
    ]
  });
}