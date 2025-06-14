import { GraduationCap, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">CSE Yearbook 2024</span>
          </div>
          <p className="text-gray-400 mb-4">Computer Science Engineering Department</p>
          <div className="flex justify-center items-center space-x-1 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>by the CSE Batch of 2024</span>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
            © 2024 CSE Department. All memories preserved with love.
          </div>
        </div>
      </div>
    </footer>
  )
}
