// Enterprise-grade Website Analysis Engine
// Multi-dimensional analysis: HTML, SEO, Performance, Psychology, Accessibility

import * as cheerio from 'cheerio';
import axios from 'axios';

interface AnalysisResult {
  url: string;
  timestamp: string;
  overallScore: number;
  
  // Core Analysis Modules
  contentAnalysis: ContentAnalysis;
  seoAnalysis: SEOAnalysis;
  performanceAnalysis: PerformanceAnalysis;
  designAnalysis: DesignAnalysis;
  psychologyAnalysis: PsychologyAnalysis;
  accessibilityAnalysis: AccessibilityAnalysis;
  
  // Recommendations
  criticalIssues: Issue[];
  quickWins: Recommendation[];
  strategicImprovements: Recommendation[];
  
  // Monetization
  freeInsightsCount: number;
  premiumInsightsAvailable: number;
}

interface ContentAnalysis {
  score: number;
  wordCount: number;
  readabilityScore: number;
  spellingIssues: SpellingIssue[];
  grammarIssues: GrammarIssue[];
  headingStructure: HeadingAnalysis;
  contentQuality: {
    hasClearValue: boolean;
    hasCallToAction: boolean;
    messageClarity: number;
  };
}

interface SEOAnalysis {
  score: number;
  metaTags: {
    title: { present: boolean; length: number; optimized: boolean };
    description: { present: boolean; length: number; optimized: boolean };
    keywords: string[];
  };
  headings: {
    h1Count: number;
    properStructure: boolean;
  };
  images: {
    total: number;
    missingAlt: number;
    optimizationScore: number;
  };
  internalLinks: number;
  externalLinks: number;
  schemaMarkup: boolean;
  mobileOptimized: boolean;
}

interface PerformanceAnalysis {
  score: number;
  estimatedLoadTime: number;
  resourcesSize: {
    images: number;
    scripts: number;
    styles: number;
  };
  optimizations: {
    minifiedCSS: boolean;
    minifiedJS: boolean;
    compressedImages: boolean;
    lazyLoading: boolean;
  };
}

interface DesignAnalysis {
  score: number;
  visualHierarchy: number;
  whitespace: number;
  colorContrast: {
    score: number;
    issues: ColorContrastIssue[];
  };
  typography: {
    fontSizes: number[];
    readableSize: boolean;
    fontVariety: number;
  };
  imageTextBalance: {
    score: number;
    recommendation: string;
  };
}

interface PsychologyAnalysis {
  score: number;
  trustSignals: {
    score: number;
    present: string[];
    missing: string[];
  };
  ctaPlacement: {
    score: number;
    ctaCount: number;
    aboveFold: boolean;
    clarity: number;
  };
  colorPsychology: {
    score: number;
    dominantColors: string[];
    emotionalImpact: string;
    brandAlignment: number;
  };
  urgencyTriggers: boolean;
  socialProof: boolean;
}

interface AccessibilityAnalysis {
  score: number;
  wcagCompliance: string;
  ariaLabels: {
    score: number;
    missing: number;
  };
  keyboardNavigation: boolean;
  screenReaderFriendly: boolean;
  contrastRatio: number;
}

interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  premium: boolean;
}

interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
  premium: boolean;
}

export class WebsiteAnalyzer {
  private html: string = '';
  private $: cheerio.CheerioAPI | null = null;
  private url: string = '';

  async analyze(url: string): Promise<AnalysisResult> {
    this.url = url;
    
    try {
      // Fetch and parse HTML
      await this.fetchWebsite(url);
      
      // Run all analysis modules in parallel
      const [
        contentAnalysis,
        seoAnalysis,
        performanceAnalysis,
        designAnalysis,
        psychologyAnalysis,
        accessibilityAnalysis
      ] = await Promise.all([
        this.analyzeContent(),
        this.analyzeSEO(),
        this.analyzePerformance(),
        this.analyzeDesign(),
        this.analyzePsychology(),
        this.analyzeAccessibility()
      ]);

      // Calculate overall score
      const overallScore = this.calculateOverallScore({
        contentAnalysis,
        seoAnalysis,
        performanceAnalysis,
        designAnalysis,
        psychologyAnalysis,
        accessibilityAnalysis
      });

      // Generate recommendations
      const { criticalIssues, quickWins, strategicImprovements } = 
        this.generateRecommendations({
          contentAnalysis,
          seoAnalysis,
          performanceAnalysis,
          designAnalysis,
          psychologyAnalysis,
          accessibilityAnalysis
        });

      return {
        url,
        timestamp: new Date().toISOString(),
        overallScore,
        contentAnalysis,
        seoAnalysis,
        performanceAnalysis,
        designAnalysis,
        psychologyAnalysis,
        accessibilityAnalysis,
        criticalIssues,
        quickWins,
        strategicImprovements,
        freeInsightsCount: this.countFreeInsights(criticalIssues, quickWins),
        premiumInsightsAvailable: this.countPremiumInsights(criticalIssues, quickWins, strategicImprovements)
      };
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchWebsite(url: string): Promise<void> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClarityBot/1.0; +https://clarity.nxtwaves.in)'
      },
      timeout: 10000
    });
    
    this.html = response.data;
    this.$ = cheerio.load(this.html);
  }

  private async analyzeContent(): Promise<ContentAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    const text = $('body').text();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    // Analyze headings
    const headings = $('h1, h2, h3, h4, h5, h6');
    const headingStructure = this.analyzeHeadingStructure($);
    
    // Content quality checks
    const hasCTA = $('button, a').text().toLowerCase().includes('contact') || 
                   $('button, a').text().toLowerCase().includes('get started') ||
                   $('button, a').text().toLowerCase().includes('buy now');
    
    const titleText = $('title').text().toLowerCase();
    const h1Text = $('h1').first().text().toLowerCase();
    const hasClearValue = titleText.length > 10 && h1Text.length > 10;
    
    // Readability score (Flesch Reading Ease approximation)
    const readabilityScore = this.calculateReadability(text);
    
    // Spelling and grammar (basic detection for free tier)
    const spellingIssues = this.detectSpellingIssues(text);
    const grammarIssues = this.detectGrammarIssues(text);
    
    const messageClarity = this.assessMessageClarity($);
    
    const score = this.calculateContentScore({
      wordCount,
      readabilityScore,
      spellingIssues: spellingIssues.length,
      grammarIssues: grammarIssues.length,
      hasClearValue,
      hasCTA,
      messageClarity
    });

    return {
      score,
      wordCount,
      readabilityScore,
      spellingIssues: spellingIssues.slice(0, 5), // Free tier: first 5
      grammarIssues: grammarIssues.slice(0, 5), // Free tier: first 5
      headingStructure,
      contentQuality: {
        hasClearValue,
        hasCallToAction: hasCTA,
        messageClarity
      }
    };
  }

  private async analyzeSEO(): Promise<SEOAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    
    // Meta tags
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',') || [];
    
    // Headings
    const h1Count = $('h1').length;
    const properStructure = h1Count === 1 && $('h2').length > 0;
    
    // Images
    const images = $('img');
    const missingAlt = images.filter((_, img) => !$(img).attr('alt')).length;
    
    // Links
    const internalLinks = $('a[href^="/"], a[href^="' + this.url + '"]').length;
    const externalLinks = $('a[href^="http"]').not('[href^="' + this.url + '"]').length;
    
    // Schema
    const schemaMarkup = $('script[type="application/ld+json"]').length > 0;
    
    // Mobile optimization
    const viewport = $('meta[name="viewport"]').attr('content');
    const mobileOptimized = !!viewport && viewport.includes('width=device-width');
    
    const score = this.calculateSEOScore({
      title: title.length,
      description: description.length,
      h1Count,
      properStructure,
      missingAlt,
      totalImages: images.length,
      schemaMarkup,
      mobileOptimized
    });

    return {
      score,
      metaTags: {
        title: {
          present: title.length > 0,
          length: title.length,
          optimized: title.length >= 30 && title.length <= 60
        },
        description: {
          present: description.length > 0,
          length: description.length,
          optimized: description.length >= 120 && description.length <= 160
        },
        keywords
      },
      headings: {
        h1Count,
        properStructure
      },
      images: {
        total: images.length,
        missingAlt,
        optimizationScore: ((images.length - missingAlt) / Math.max(images.length, 1)) * 100
      },
      internalLinks,
      externalLinks,
      schemaMarkup,
      mobileOptimized
    };
  }

  private async analyzePerformance(): Promise<PerformanceAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    
    // Count resources
    const scripts = $('script[src]').length;
    const styles = $('link[rel="stylesheet"]').length;
    const images = $('img').length;
    
    // Check optimizations
    const hasMinifiedCSS = $('link[rel="stylesheet"]').toArray().some(el => 
      $(el).attr('href')?.includes('.min.css')
    );
    const hasMinifiedJS = $('script[src]').toArray().some(el => 
      $(el).attr('src')?.includes('.min.js')
    );
    const hasLazyLoading = $('img[loading="lazy"]').length > 0;
    
    // Estimate load time based on resource count
    const estimatedLoadTime = (scripts * 0.2) + (styles * 0.15) + (images * 0.1);
    
    const score = this.calculatePerformanceScore({
      scripts,
      styles,
      images,
      hasMinifiedCSS,
      hasMinifiedJS,
      hasLazyLoading,
      estimatedLoadTime
    });

    return {
      score,
      estimatedLoadTime: Number(estimatedLoadTime.toFixed(2)),
      resourcesSize: {
        images,
        scripts,
        styles
      },
      optimizations: {
        minifiedCSS: hasMinifiedCSS,
        minifiedJS: hasMinifiedJS,
        compressedImages: false, // Would need actual file analysis
        lazyLoading: hasLazyLoading
      }
    };
  }

  private async analyzeDesign(): Promise<DesignAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    
    // Typography analysis
    const fontSizes: number[] = [];
    $('*').each((_, el) => {
      const fontSize = $(el).css('font-size');
      if (fontSize) {
        const size = parseInt(fontSize);
        if (!isNaN(size)) fontSizes.push(size);
      }
    });
    
    const uniqueFontSizes = Array.from(new Set(fontSizes));
    const readableSize = fontSizes.some(size => size >= 16);
    
    // Visual hierarchy (based on heading usage)
    const visualHierarchy = this.assessVisualHierarchy($);
    
    // Whitespace (based on content density)
    const whitespace = this.assessWhitespace($);
    
    // Image-text balance
    const imageCount = $('img').length;
    const textLength = $('body').text().length;
    const imageTextBalance = this.calculateImageTextBalance(imageCount, textLength);
    
    const score = this.calculateDesignScore({
      visualHierarchy,
      whitespace,
      readableSize,
      fontVariety: uniqueFontSizes.length,
      imageTextBalance: imageTextBalance.score
    });

    return {
      score,
      visualHierarchy,
      whitespace,
      colorContrast: {
        score: 75, // Would need color extraction for accurate analysis
        issues: []
      },
      typography: {
        fontSizes: uniqueFontSizes.slice(0, 10),
        readableSize,
        fontVariety: uniqueFontSizes.length
      },
      imageTextBalance
    };
  }

  private async analyzePsychology(): Promise<PsychologyAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    
    // Trust signals
    const trustSignals = this.detectTrustSignals($);
    
    // CTA analysis
    const ctas = $('button, a.button, a.btn, .cta');
    const ctaText = ctas.text().toLowerCase();
    const hasUrgency = ctaText.includes('now') || ctaText.includes('today') || 
                       ctaText.includes('limited');
    const hasSocialProof = $('*:contains("customers")').length > 0 || 
                          $('*:contains("reviews")').length > 0 ||
                          $('*:contains("testimonial")').length > 0;
    
    // CTA placement
    const ctaAboveFold = ctas.length > 0; // Simplified check
    const ctaClarity = this.assessCTAClarity(ctas);
    
    const score = this.calculatePsychologyScore({
      trustSignals: trustSignals.present.length,
      ctaCount: ctas.length,
      ctaAboveFold,
      ctaClarity,
      hasUrgency,
      hasSocialProof
    });

    return {
      score,
      trustSignals,
      ctaPlacement: {
        score: ctaClarity,
        ctaCount: ctas.length,
        aboveFold: ctaAboveFold,
        clarity: ctaClarity
      },
      colorPsychology: {
        score: 70,
        dominantColors: [], // Would need color extraction
        emotionalImpact: 'Professional',
        brandAlignment: 75
      },
      urgencyTriggers: hasUrgency,
      socialProof: hasSocialProof
    };
  }

  private async analyzeAccessibility(): Promise<AccessibilityAnalysis> {
    if (!this.$) throw new Error('HTML not loaded');
    
    const $ = this.$;
    
    // ARIA labels
    const elementsNeedingAria = $('button, a, input, select, textarea').length;
    const elementsWithAria = $('[aria-label], [aria-labelledby]').length;
    
    // Alt text
    const images = $('img').length;
    const imagesWithAlt = $('img[alt]').length;
    
    // Semantic HTML
    const hasSemanticHTML = $('header, nav, main, footer, article, section').length > 0;
    
    // Language attribute
    const hasLangAttr = $('html[lang]').length > 0;
    
    const ariaScore = elementsNeedingAria > 0 
      ? (elementsWithAria / elementsNeedingAria) * 100 
      : 100;
    
    const altScore = images > 0 
      ? (imagesWithAlt / images) * 100 
      : 100;
    
    const score = this.calculateAccessibilityScore({
      ariaScore,
      altScore,
      hasSemanticHTML,
      hasLangAttr
    });

    return {
      score,
      wcagCompliance: score >= 80 ? 'AA' : score >= 60 ? 'A' : 'Needs Improvement',
      ariaLabels: {
        score: ariaScore,
        missing: elementsNeedingAria - elementsWithAria
      },
      keyboardNavigation: true, // Would need actual testing
      screenReaderFriendly: hasSemanticHTML && ariaScore > 50,
      contrastRatio: 4.5 // Would need color analysis
    };
  }

  // Helper methods
  private calculateOverallScore(analyses: any): number {
    const weights = {
      content: 0.25,
      seo: 0.20,
      performance: 0.15,
      design: 0.15,
      psychology: 0.15,
      accessibility: 0.10
    };

    return Math.round(
      analyses.contentAnalysis.score * weights.content +
      analyses.seoAnalysis.score * weights.seo +
      analyses.performanceAnalysis.score * weights.performance +
      analyses.designAnalysis.score * weights.design +
      analyses.psychologyAnalysis.score * weights.psychology +
      analyses.accessibilityAnalysis.score * weights.accessibility
    );
  }

  private generateRecommendations(analyses: any): {
    criticalIssues: Issue[];
    quickWins: Recommendation[];
    strategicImprovements: Recommendation[];
  } {
    const criticalIssues: Issue[] = [];
    const quickWins: Recommendation[] = [];
    const strategicImprovements: Recommendation[] = [];

    // SEO Critical Issues
    if (!analyses.seoAnalysis.metaTags.title.present) {
      criticalIssues.push({
        severity: 'critical',
        category: 'SEO',
        title: 'Missing Page Title',
        description: 'Your page is missing a title tag, which is crucial for SEO',
        impact: 'Search engines cannot properly index your page',
        premium: false
      });
    }

    if (!analyses.seoAnalysis.metaTags.description.present) {
      criticalIssues.push({
        severity: 'high',
        category: 'SEO',
        title: 'Missing Meta Description',
        description: 'No meta description found',
        impact: 'Lower click-through rates from search results',
        premium: false
      });
    }

    // Content Quick Wins
    if (analyses.contentAnalysis.spellingIssues.length > 0) {
      quickWins.push({
        title: 'Fix Spelling Errors',
        description: `Found ${analyses.contentAnalysis.spellingIssues.length} spelling issues`,
        impact: 'high',
        effort: 'low',
        category: 'Content',
        premium: analyses.contentAnalysis.spellingIssues.length > 5
      });
    }

    // Performance Quick Wins
    if (!analyses.performanceAnalysis.optimizations.lazyLoading) {
      quickWins.push({
        title: 'Implement Lazy Loading',
        description: 'Add lazy loading to images for faster initial page load',
        impact: 'medium',
        effort: 'low',
        category: 'Performance',
        premium: false
      });
    }

    // Strategic Improvements
    if (analyses.psychologyAnalysis.score < 70) {
      strategicImprovements.push({
        title: 'Enhance Trust Signals',
        description: 'Add testimonials, security badges, and social proof',
        impact: 'high',
        effort: 'medium',
        category: 'Psychology',
        premium: true
      });
    }

    if (analyses.designAnalysis.score < 70) {
      strategicImprovements.push({
        title: 'Improve Visual Hierarchy',
        description: 'Optimize typography and spacing for better readability',
        impact: 'high',
        effort: 'medium',
        category: 'Design',
        premium: true
      });
    }

    return { criticalIssues, quickWins, strategicImprovements };
  }

  // Scoring methods
  private calculateContentScore(params: any): number {
    let score = 70;
    if (params.wordCount >= 300) score += 10;
    if (params.readabilityScore >= 60) score += 10;
    if (params.spellingIssues === 0) score += 5;
    if (params.hasClearValue) score += 5;
    return Math.min(100, score);
  }

  private calculateSEOScore(params: any): number {
    let score = 50;
    if (params.title >= 30 && params.title <= 60) score += 15;
    if (params.description >= 120) score += 15;
    if (params.properStructure) score += 10;
    if (params.schemaMarkup) score += 5;
    if (params.mobileOptimized) score += 5;
    return Math.min(100, score);
  }

  private calculatePerformanceScore(params: any): number {
    let score = 80;
    if (params.scripts > 10) score -= 10;
    if (params.hasMinifiedCSS) score += 5;
    if (params.hasMinifiedJS) score += 5;
    if (params.hasLazyLoading) score += 10;
    return Math.max(0, Math.min(100, score));
  }

  private calculateDesignScore(params: any): number {
    let score = 60;
    if (params.visualHierarchy >= 70) score += 15;
    if (params.whitespace >= 70) score += 10;
    if (params.readableSize) score += 10;
    if (params.fontVariety >= 3 && params.fontVariety <= 6) score += 5;
    return Math.min(100, score);
  }

  private calculatePsychologyScore(params: any): number {
    let score = 50;
    if (params.trustSignals >= 3) score += 20;
    if (params.ctaCount >= 1) score += 10;
    if (params.ctaAboveFold) score += 10;
    if (params.hasSocialProof) score += 10;
    return Math.min(100, score);
  }

  private calculateAccessibilityScore(params: any): number {
    let score = (params.ariaScore + params.altScore) / 2;
    if (params.hasSemanticHTML) score += 10;
    if (params.hasLangAttr) score += 5;
    return Math.min(100, Math.round(score));
  }

  // Analysis helper methods
  private analyzeHeadingStructure($: cheerio.CheerioAPI): any {
    const h1 = $('h1').length;
    const h2 = $('h2').length;
    const h3 = $('h3').length;
    
    return {
      h1Count: h1,
      h2Count: h2,
      h3Count: h3,
      properHierarchy: h1 === 1 && h2 > 0,
      score: h1 === 1 && h2 > 0 ? 90 : 60
    };
  }

  private calculateReadability(text: string): number {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    
    // Simple readability score
    if (avgWordsPerSentence <= 15) return 90;
    if (avgWordsPerSentence <= 20) return 75;
    if (avgWordsPerSentence <= 25) return 60;
    return 40;
  }

  private detectSpellingIssues(text: string): any[] {
    // Simplified detection - would use proper spell-check API in production
    const commonMisspellings = ['recieve', 'occured', 'seperate', 'definately', 'alot'];
    const issues: any[] = [];
    
    commonMisspellings.forEach(word => {
      if (text.toLowerCase().includes(word)) {
        issues.push({
          word,
          suggestion: this.getCorrection(word),
          position: text.toLowerCase().indexOf(word)
        });
      }
    });
    
    return issues;
  }

  private detectGrammarIssues(text: string): any[] {
    // Simplified detection
    const issues: any[] = [];
    
    if (text.includes('your welcome')) {
      issues.push({
        text: 'your welcome',
        suggestion: "you're welcome",
        type: 'grammar'
      });
    }
    
    return issues;
  }

  private getCorrection(word: string): string {
    const corrections: Record<string, string> = {
      'recieve': 'receive',
      'occured': 'occurred',
      'seperate': 'separate',
      'definately': 'definitely',
      'alot': 'a lot'
    };
    return corrections[word] || word;
  }

  private assessMessageClarity($: cheerio.CheerioAPI): number {
    const h1 = $('h1').first().text();
    const title = $('title').text();
    
    if (h1.length > 20 && title.length > 20) return 90;
    if (h1.length > 10 || title.length > 10) return 70;
    return 40;
  }

  private assessVisualHierarchy($: cheerio.CheerioAPI): number {
    const h1 = $('h1').length;
    const h2 = $('h2').length;
    const h3 = $('h3').length;
    
    if (h1 === 1 && h2 >= 2 && h3 >= 1) return 90;
    if (h1 === 1 && h2 >= 1) return 75;
    return 50;
  }

  private assessWhitespace($: cheerio.CheerioAPI): number {
    const elements = $('*').length;
    const text = $('body').text().length;
    
    // More elements relative to text suggests better spacing
    const density = elements / Math.max(text, 1);
    
    if (density > 0.01) return 80;
    if (density > 0.005) return 65;
    return 50;
  }

  private calculateImageTextBalance(images: number, textLength: number): any {
    const ratio = images / Math.max(textLength / 1000, 1);
    
    let score = 70;
    let recommendation = 'Good balance between images and text';
    
    if (ratio > 5) {
      score = 50;
      recommendation = 'Too many images relative to text content';
    } else if (ratio < 0.5 && images > 0) {
      score = 60;
      recommendation = 'Consider adding more visuals to break up text';
    } else if (images === 0) {
      score = 40;
      recommendation = 'Add images to enhance visual appeal';
    } else {
      score = 85;
    }
    
    return { score, recommendation };
  }

  private detectTrustSignals($: cheerio.CheerioAPI): any {
    const present: string[] = [];
    const missing: string[] = [];
    
    const signals = {
      'SSL Certificate': $('link[rel="canonical"]').attr('href')?.startsWith('https://') || false,
      'Contact Information': $('*:contains("contact"), *:contains("email"), *:contains("phone")').length > 0,
      'Privacy Policy': $('a[href*="privacy"]').length > 0,
      'Terms of Service': $('a[href*="terms"]').length > 0,
      'Testimonials': $('*:contains("testimonial"), .testimonial').length > 0,
      'Security Badge': $('img[alt*="secure"], img[alt*="ssl"], img[alt*="verified"]').length > 0
    };
    
    Object.entries(signals).forEach(([signal, exists]) => {
      if (exists) present.push(signal);
      else missing.push(signal);
    });
    
    const score = (present.length / (present.length + missing.length)) * 100;
    
    return { score, present, missing };
  }

  private assessCTAClarity(ctas: cheerio.Cheerio<any>): number {
    if (ctas.length === 0) return 0;
    
    const ctaText = ctas.text().toLowerCase();
    const actionWords = ['buy', 'get', 'start', 'try', 'download', 'subscribe', 'contact', 'learn'];
    
    const hasActionWord = actionWords.some(word => ctaText.includes(word));
    
    if (hasActionWord && ctas.length >= 1 && ctas.length <= 3) return 90;
    if (hasActionWord) return 75;
    if (ctas.length > 0) return 60;
    return 30;
  }

  private countFreeInsights(criticalIssues: Issue[], quickWins: Recommendation[]): number {
    return criticalIssues.filter(i => !i.premium).length +
           quickWins.filter(r => !r.premium).length;
  }

  private countPremiumInsights(
    criticalIssues: Issue[], 
    quickWins: Recommendation[], 
    strategic: Recommendation[]
  ): number {
    return criticalIssues.filter(i => i.premium).length +
           quickWins.filter(r => r.premium).length +
           strategic.filter(r => r.premium).length;
  }
}

// Type exports
export type {
  AnalysisResult,
  ContentAnalysis,
  SEOAnalysis,
  PerformanceAnalysis,
  DesignAnalysis,
  PsychologyAnalysis,
  AccessibilityAnalysis,
  Issue,
  Recommendation
};

interface SpellingIssue {
  word: string;
  suggestion: string;
  position: number;
}

interface GrammarIssue {
  text: string;
  suggestion: string;
  type: string;
}

interface HeadingAnalysis {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  properHierarchy: boolean;
  score: number;
}

interface ColorContrastIssue {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
}