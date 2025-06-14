import { Navigation } from "@/components/navigation"
import { NominationsPage } from "@/components/nominations-page"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"

export default function NominationsPageRoute() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CodeDecorations />
      <FloatingCode />
      <Navigation />
      <div className="relative z-10">
        <NominationsPage />
      </div>
    </div>
  )
}
