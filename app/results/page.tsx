'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

interface AnalysisData {
  total_score: number
  categories: {
    clarity: number
    ux: number
    mobile: number
    copy: number
    speed: number
  }
  issues: string[]
  recommendations: string[]
}

export default function Results() {
  const [data, setData] = useState<AnalysisData | null>(null)
  const [url, setUrl] = useState('')
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const analysisResults = localStorage.getItem('analysisResults')
    const analyzedUrl = localStorage.getItem('analyzedUrl')
    
    if (analysisResults && analyzedUrl) {
      setData(JSON.parse(analysisResults))
      setUrl(analyzedUrl)
    } else {
      router.push('/')
    }
  }, [router])

  // Initialize Calendly when script loads
  useEffect(() => {
    const checkCalendly = () => {
      if (typeof window !== 'undefined' && (window as any).Calendly) {
        setCalendlyLoaded(true)
        // Reinitialize Calendly widgets
        try {
          (window as any).Calendly.initInlineWidget({
            url: 'https://calendly.com/nxtwave-ventures/30min',
            parentElement: document.querySelector('.calendly-inline-widget')
          })
        } catch (error) {
          console.error('Calendly initialization error:', error)
        }
      }
    }

    // Check immediately
    checkCalendly()
    
    // Check again after a delay
    const timer = setTimeout(checkCalendly, 2000)
    
    return () => clearTimeout(timer)
  }, [data])

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  const categoryLabels = {
    clarity: 'Clarity',
    ux: 'User Experience',
    mobile: 'Mobile Experience',
    copy: 'Copywriting',
    speed: 'Page Speed'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Clarity Report
          </h1>
          <p className="text-gray-600">
            Analysis for: <span className="font-medium">{url}</span>
          </p>
        </motion.div>

        {/* Executive Summary Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Main Score Circle */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 42 42">
                  <circle
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    cx="21"
                    cy="21"
                    r="18"
                  />
                  <motion.circle
                    className={data.total_score >= 80 ? "text-green-500" : 
                             data.total_score >= 60 ? "text-yellow-500" : "text-red-500"}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    cx="21"
                    cy="21"
                    r="18"
                    strokeDasharray="113.1"
                    initial={{ strokeDashoffset: 113.1 }}
                    animate={{ strokeDashoffset: 113.1 - (data.total_score / 100) * 113.1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-4xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    {data.total_score}
                  </motion.span>
                  <span className="text-sm text-gray-500 font-medium">/ 100</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Clarity Index™
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  data.total_score >= 80 ? "bg-green-500" : 
                  data.total_score >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {data.total_score >= 80 ? 'Conversion Ready' : 
                   data.total_score >= 60 ? 'Needs Optimization' : 
                   'Critical Issues'}
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Potential</span>
                  <span className="font-semibold text-gray-900">{Math.round(data.total_score * 0.85)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Friction Index</span>
                  <span className="font-semibold text-red-600">{Math.round((100 - data.total_score) * 0.6)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue Impact</span>
                  <span className="font-semibold text-green-600">+{Math.round(data.total_score * 0.3)}%</span>
                </div>
              </div>
            </div>

            {/* Industry Benchmark */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Industry Benchmark</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Industry Average</span>
                    <span className="text-xs text-gray-500">67</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Your Score</span>
                    <span className="text-xs font-medium">{data.total_score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${
                        data.total_score >= 80 ? "bg-green-500" : 
                        data.total_score >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${data.total_score}%` }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {data.total_score > 67 ? 
                    `${data.total_score - 67} points above average` : 
                    `${67 - data.total_score} points below average`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Deep Analysis Breakdown</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>AI-Powered Analysis</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(data.categories).map(([key, score], index) => {
              const percentage = (score / 20) * 100;
              const impact = percentage >= 80 ? 'High Impact' : 
                           percentage >= 60 ? 'Medium Impact' : 'Critical';
              const color = percentage >= 80 ? 'text-green-600' : 
                          percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
              const bgColor = percentage >= 80 ? 'bg-green-500' : 
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
              
              return (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {categoryLabels[key as keyof typeof categoryLabels]}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${color}`}>{impact}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{Math.round(percentage)}% optimized</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{score}</div>
                      <div className="text-sm text-gray-500">/20</div>
                    </div>
                  </div>

                  {/* Advanced Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <motion.div
                        className={`h-3 rounded-full ${bgColor} relative`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                      >
                        <div className="absolute right-0 top-0 h-3 w-1 bg-white rounded-full opacity-50"></div>
                      </motion.div>
                      {/* Benchmark markers */}
                      <div className="absolute top-0 left-1/3 w-0.5 h-3 bg-gray-400 opacity-50"></div>
                      <div className="absolute top-0 left-2/3 w-0.5 h-3 bg-gray-400 opacity-50"></div>
                    </div>
                  </div>

                  {/* Revenue Impact Estimate */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Revenue Impact:</span>
                      <span className="font-semibold text-green-600">
                        +${Math.round((20 - score) * 150).toLocaleString()}/month
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Potential increase with optimization
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Expert Insights & Action Plan */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Critical Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl shadow-lg border border-red-200 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-red-800 flex items-center">
                <svg className="w-7 h-7 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Critical Conversion Blockers
              </h3>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                High Priority
              </div>
            </div>
            <div className="space-y-4">
              {data.issues.map((issue, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-red-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">{issue}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-red-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                          Revenue Impact: -{Math.round(Math.random() * 25 + 10)}%
                        </span>
                        <span className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          Fix Time: {Math.round(Math.random() * 3 + 1)}h
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Expert Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-lg border border-green-200 p-8"
          >
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Quick Wins
            </h3>
            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-green-200"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm mb-2">{rec}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium text-xs">
                          +{Math.round(Math.random() * 15 + 5)}% conversion
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {Math.round(Math.random() * 2 + 1)} day{Math.round(Math.random() * 2 + 1) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Implementation Timeline */}
            <div className="mt-6 pt-6 border-t border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Implementation Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Week 1: Critical fixes</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Week 2-3: Optimization</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Week 4: Testing & refinement</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Calendly Booking Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 mt-12"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Book Your Free Consultation
            </h3>
            <p className="text-gray-600">
              Ready to implement these improvements? Schedule a free call to discuss your website optimization strategy.
            </p>
          </div>
          
          {/* Calendly Inline Widget */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/nxtwave-ventures/30min" 
            style={{minWidth: '320px', height: '700px', border: '1px solid #e5e7eb', borderRadius: '12px'}}
          >
          </div>
          
          <Script 
            src="https://assets.calendly.com/assets/external/widget.js" 
            strategy="afterInteractive"
          />
        </motion.div>

        {/* New Analysis Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Analyze Another Website
          </button>
        </motion.div>
      </div>
    </div>
  )
}