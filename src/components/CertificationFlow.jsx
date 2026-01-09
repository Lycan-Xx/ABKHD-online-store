import React, { useEffect, useRef, useState } from 'react'

const CertificationFlow = () => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const steps = [
    { icon: 'bi-globe', title: 'Source', desc: 'Trusted UK & China suppliers' },
    { icon: 'bi-search', title: 'Test', desc: 'Multi-point inspection' },
    { icon: 'bi-file-text', title: 'Disclose', desc: 'Document all defects' },
    { icon: 'bi-check-circle', title: 'Deliver', desc: 'Quality guaranteed' },
  ]

  return (
    <div ref={containerRef} className="relative py-8">
      {/* Desktop: Horizontal */}
      <div className="hidden md:block">
        <svg 
          viewBox="0 0 800 120" 
          className="w-full h-auto"
          style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
        >
          {/* Connection lines */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line
                x1={100 + i * 200 + 50}
                y1="60"
                x2={100 + (i + 1) * 200 - 50}
                y2="60"
                className="stroke-border"
                strokeWidth="2"
              />
              <line
                x1={100 + i * 200 + 50}
                y1="60"
                x2={100 + (i + 1) * 200 - 50}
                y2="60"
                className="stroke-primary certification-line"
                strokeWidth="2"
                strokeDasharray="8 8"
                style={{ 
                  animationDelay: `${i * 2}s`,
                  animationPlayState: isVisible ? 'running' : 'paused'
                }}
              />
            </g>
          ))}

          {/* Nodes */}
          {steps.map((step, i) => (
            <g key={i}>
              <circle
                cx={100 + i * 200}
                cy="60"
                r="40"
                className={`fill-card stroke-border certification-node`}
                strokeWidth="2"
                style={{ 
                  animationDelay: `${i * 2}s`,
                  animationPlayState: isVisible ? 'running' : 'paused'
                }}
              />
              <circle
                cx={100 + i * 200}
                cy="60"
                r="40"
                className="fill-transparent stroke-primary certification-pulse"
                strokeWidth="2"
                style={{ 
                  animationDelay: `${i * 2}s`,
                  animationPlayState: isVisible ? 'running' : 'paused'
                }}
              />
            </g>
          ))}
        </svg>

        {/* Labels below SVG */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="text-center certification-label"
              style={{ 
                animationDelay: `${i * 2}s`,
                animationPlayState: isVisible ? 'running' : 'paused'
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <i className={`bi ${step.icon} text-primary text-xl`}></i>
              </div>
              <h4 className="font-semibold text-sm">{step.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <div 
              className="flex items-start gap-4 certification-label"
              style={{ 
                animationDelay: `${i * 2}s`,
                animationPlayState: isVisible ? 'running' : 'paused'
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10 certification-node"
                  style={{ 
                    animationDelay: `${i * 2}s`,
                    animationPlayState: isVisible ? 'running' : 'paused'
                  }}
                >
                  <i className={`bi ${step.icon} text-primary text-xl`}></i>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-border relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-primary certification-line-vertical"
                      style={{ 
                        animationDelay: `${i * 2}s`,
                        animationPlayState: isVisible ? 'running' : 'paused'
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="pt-2 pb-6">
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loop indicator */}
      <div className="hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <i className="bi bi-arrow-repeat text-primary animate-spin" style={{ animationDuration: '3s' }}></i>
          <span>Continuous quality cycle</span>
        </div>
      </div>
    </div>
  )
}

export default CertificationFlow
