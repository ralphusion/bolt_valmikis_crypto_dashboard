import React from 'react'

export function StatsCard({ title, value, change, isPositive }) {
  return (
    <div className="bg-card rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-muted">{title}</h3>
        <span className="text-accent">↗</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  )
}
