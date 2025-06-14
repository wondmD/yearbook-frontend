"use client"

import { useEffect, useState } from "react"

export function CodeRain() {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; animationDelay: number; char: string }>>([])

  const codeChars = [
    "function()",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "class",
    "import",
    "export",
    "return",
    "async",
    "await",
    "=>",
    "{}",
    "[]",
    "()",
    "console.log",
    "useState",
    "useEffect",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "JS",
    "API",
    "JSON",
    "SQL",
    "Git",
    "npm",
    "yarn",
    "webpack",
    "babel",
    "redux",
    "express",
    "mongodb",
    "mysql",
    "docker",
    "aws",
    "linux",
    "ubuntu",
    "vim",
    "vscode",
    "github",
    "stackoverflow",
    "debug",
    "compile",
    "runtime",
    "algorithm",
    "datastructure",
    "array",
    "object",
    "string",
    "boolean",
    "integer",
    "float",
    "null",
    "undefined",
    "true",
    "false",
    "try",
    "catch",
    "finally",
    "throw",
    "new",
    "this",
    "super",
    "extends",
    "implements",
    "interface",
    "enum",
    "type",
    "generic",
    "promise",
    "callback",
    "closure",
    "scope",
    "hoisting",
    "prototype",
    "inheritance",
    "polymorphism",
    "encapsulation",
    "abstraction",
  ]

  useEffect(() => {
    const newDrops = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      char: codeChars[Math.floor(Math.random() * codeChars.length)],
    }))
    setDrops(newDrops)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-blue-400/20 text-sm font-mono animate-bounce"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.animationDelay}s`,
            animationDuration: "3s",
            animationIterationCount: "infinite",
            top: "-20px",
            transform: "translateY(100vh)",
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  )
}
