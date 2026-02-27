import React from 'react'

const SimpleChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const chartHeight = 200
  const barWidth = 60
  const gap = 20
  const chartWidth = data.length * (barWidth + gap)

  return (
    <div className="overflow-x-auto">
      <svg 
        viewBox={`0 0 ${Math.max(chartWidth, 300)} ${chartHeight + 60}`}
        className="w-full min-w-[300px]"
        style={{ maxHeight: '280px' }}
      >
        {/* Y-axis labels */}
        <text x="0" y="15" className="fill-muted-foreground text-xs">{maxCount}</text>
        <text x="0" y={chartHeight / 2} className="fill-muted-foreground text-xs">{Math.round(maxCount / 2)}</text>
        <text x="0" y={chartHeight - 5} className="fill-muted-foreground text-xs">0</text>

        {/* Grid lines */}
        <line 
          x1="30" y1="10" 
          x2={chartWidth + 30} y2="10" 
          stroke="hsl(var(--border))" 
          strokeDasharray="4"
        />
        <line 
          x1="30" y1={chartHeight / 2} 
          x2={chartWidth + 30} y2={chartHeight / 2} 
          stroke="hsl(var(--border))" 
          strokeDasharray="4"
        />
        <line 
          x1="30" y1={chartHeight} 
          x2={chartWidth + 30} y2={chartHeight} 
          stroke="hsl(var(--border))"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * (chartHeight - 20)
          const x = 40 + index * (barWidth + gap)
          const y = chartHeight - barHeight

          return (
            <g key={item.name}>
              {/* Bar background */}
              <rect
                x={x}
                y={10}
                width={barWidth}
                height={chartHeight - 10}
                fill="hsl(var(--muted))"
                rx="4"
              />
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="hsl(var(--primary))"
                rx="4"
                className="transition-all duration-300 hover:opacity-80"
              />
              {/* Value label */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className="fill-foreground text-xs font-medium"
              >
                {item.count}
              </text>
              {/* Category label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {item.name?.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default SimpleChart
