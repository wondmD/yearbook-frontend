"use client"

import { useEffect, useState } from "react"

export function FloatingCode() {
  const [codeSnippets, setCodeSnippets] = useState<
    Array<{ id: number; x: number; y: number; code: string; delay: number }>
  >([])

  const snippets = [
    "console.log('Hello CSE!');",
    "const graduates = 60;",
    "if (coding) { fun++; }",
    "while (learning) { grow(); }",
    "function celebrate() { 🎉 }",
    "let memories = [];",
    "class CSEStudent { }",
    "import { friendship } from 'life';",
    "const success = true;",
    "return happiness;",
    "async function graduate() { }",
    "const yearbook = new Map();",
    "for (let i = 0; i < 4; i++) { study(); }",
    "try { code(); } catch { debug(); }",
    "const reunion = new Date('2035-06-15');",
  ]

  useEffect(() => {
    const newSnippets = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      code: snippets[Math.floor(Math.random() * snippets.length)],
      delay: Math.random() * 3,
    }))
    setCodeSnippets(newSnippets)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {codeSnippets.map((snippet) => (
        <div
          key={snippet.id}
          className="absolute text-blue-300/10 text-xs font-mono animate-pulse"
          style={{
            left: `${snippet.x}%`,
            top: `${snippet.y}%`,
            animationDelay: `${snippet.delay}s`,
            animationDuration: "4s",
          }}
        >
          {snippet.code}
        </div>
      ))}
    </div>
  )
}
