"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WordDefinitionProps {
  word: {
    _id: string
    title: string
    slug: string
    pronunciation: string
    tooltip: string
    description: string
    plus_only: boolean
    finalized: boolean
    unlisted: boolean
    colors: Record<string, string>
    order: number
  }
  onClose: () => void
}

export default function WordDefinition({ word, onClose }: WordDefinitionProps) {
  return (
    <div className="sticky top-8 bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-foreground">{word.title}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Definition Content */}
      <div className="space-y-4">
        <div
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: word.description }}
        />
      </div>

      {/* Tooltip */}
      {word.tooltip && (
        <div className="mt-4 p-3 bg-muted rounded text-sm text-muted-foreground">
          <div dangerouslySetInnerHTML={{ __html: word.tooltip }} />
        </div>
      )}
    </div>
  )
}
