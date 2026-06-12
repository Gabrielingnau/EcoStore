"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="group mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
        <ChevronLeft className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium">Voltar</span>
    </button>
  )
}