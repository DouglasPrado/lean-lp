"use client"

import { cn } from "@/lib/utils"

// Gradient pairs — customize per project brand colors
// Replace with distinct brand colors for maximum visual impact
// Example neon: ["#39ff14","#00ffff"], ["#ff073a","#ff6ec7"], ["#faff00","#00f0ff"]
const gradientPairs = [
  ["hsl(var(--primary))", "hsl(var(--primary) / 0.5)"],
  ["hsl(var(--chart-1, var(--primary) / 0.8))", "hsl(var(--chart-2, var(--primary) / 0.4))"],
  ["hsl(var(--chart-3, var(--primary) / 0.6))", "hsl(var(--primary))"],
] as const

interface TextColorProps {
  /** Exactly 3 words/phrases to cycle through with gradient animation */
  words: [string, string, string]
  className?: string
}

export function TextColor({ words, className }: TextColorProps) {
  return (
    <>
      <TextColorStyles />
      <span
        className={cn(
          "inline-flex flex-wrap items-center justify-center select-none",
          className
        )}
      >
        {words.map((word, i) => (
          <span key={i} className="relative px-1 sm:px-2">
            {/* Solid text — visible when gradient is hidden */}
            <span
              style={{ animation: `tc-bg-${i + 1} 8s infinite` }}
            >
              {word}
            </span>

            {/* Gradient text — cycles in with color */}
            <span
              className="absolute inset-0 px-1 sm:px-2 bg-clip-text text-transparent"
              style={{
                animation: `tc-fg-${i + 1} 8s infinite`,
                backgroundImage: `linear-gradient(to right, ${gradientPairs[i][0]}, ${gradientPairs[i][1]})`,
              }}
              aria-hidden
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </>
  )
}

function TextColorStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes tc-fg-1 { from,16.667%,to{opacity:1} 33.333%,83.333%{opacity:0} }
          @keyframes tc-fg-2 { from,to{opacity:0} 33.333%,50%{opacity:1} 16.667%,66.667%{opacity:0} }
          @keyframes tc-fg-3 { from,50%,to{opacity:0} 66.667%,83.333%{opacity:1} }
          @keyframes tc-bg-1 { from,16.667%,to{opacity:0} 25%,91.667%{opacity:1} }
          @keyframes tc-bg-2 { from,to{opacity:1} 33.333%,50%{opacity:0} 25%,58.333%{opacity:1} }
          @keyframes tc-bg-3 { from,58.333%,91.667%,to{opacity:1} 66.667%,83.333%{opacity:0} }
        `,
      }}
    />
  )
}
