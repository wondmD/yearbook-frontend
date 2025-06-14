"use client"

export function CodeDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Brackets */}
      <div className="absolute top-20 left-10 text-blue-200/20 text-6xl font-mono animate-bounce">{"{"}</div>
      <div className="absolute top-32 right-20 text-purple-200/20 text-6xl font-mono animate-bounce delay-1000">
        {"}"}
      </div>
      <div className="absolute bottom-40 left-16 text-green-200/20 text-5xl font-mono animate-pulse">{"["}</div>
      <div className="absolute bottom-52 right-12 text-yellow-200/20 text-5xl font-mono animate-pulse delay-500">
        {"]"}
      </div>

      {/* Floating Semicolons */}
      <div className="absolute top-1/3 left-1/4 text-red-200/20 text-4xl font-mono animate-ping">;</div>
      <div className="absolute top-2/3 right-1/4 text-indigo-200/20 text-4xl font-mono animate-ping delay-700">;</div>

      {/* Binary Numbers */}
      <div className="absolute top-1/4 right-1/3 text-gray-200/10 text-2xl font-mono animate-pulse">
        01001000 01100101 01101100 01101100 01101111
      </div>
      <div className="absolute bottom-1/4 left-1/3 text-gray-200/10 text-2xl font-mono animate-pulse delay-1000">
        01000011 01010011 01000101
      </div>

      {/* Code Symbols */}
      <div className="absolute top-1/2 left-1/6 text-blue-300/15 text-3xl font-mono animate-spin slow">{"<>"}</div>
      <div className="absolute top-3/4 right-1/6 text-purple-300/15 text-3xl font-mono animate-spin slow delay-500">
        {"()"}
      </div>

      {/* Terminal Cursor */}
      <div className="absolute bottom-1/3 left-1/2 text-green-400/30 text-2xl font-mono animate-pulse">█</div>
    </div>
  )
}
