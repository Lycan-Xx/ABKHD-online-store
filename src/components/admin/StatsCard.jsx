import React from 'react'

const StatsCard = ({ title, value, icon, description, variant = 'default' }) => {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-verified',
    warning: 'text-warning',
    destructive: 'text-destructive'
  }

  const bgVariantStyles = {
    default: 'bg-primary/10',
    success: 'bg-verified/10',
    warning: 'bg-warning/10',
    destructive: 'bg-destructive/10'
  }

  return (
    <div className="rounded-xl border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgVariantStyles[variant]}`}>
          <i className={`${icon} text-xl ${variantStyles[variant]}`}></i>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
