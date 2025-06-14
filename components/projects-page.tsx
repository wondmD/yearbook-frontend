"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Users, Calendar, Plus, Code, Trophy } from "lucide-react"
import Image from "next/image"

interface ProjectsPageProps {
  onAddProject: () => void
}

const projects = [
  {
    id: 1,
    title: "Smart Campus Management System",
    description:
      "A comprehensive web application for managing campus resources, student information, and academic processes.",
    longDescription:
      "This project revolutionizes campus management by providing an integrated platform for students, faculty, and administrators. Features include real-time attendance tracking, grade management, resource booking, and communication tools. Built with modern web technologies and designed for scalability.",
    teamMembers: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez"],
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    image: "/placeholder.svg?height=300&width=500",
    githubUrl: "https://github.com/team/smart-campus",
    liveUrl: "https://smart-campus-demo.com",
    completionDate: "May 2025",
    category: "Web Development",
    features: ["User Authentication", "Real-time Dashboard", "Mobile Responsive", "API Integration"],
  },
  {
    id: 2,
    title: "AI-Powered Study Assistant",
    description:
      "An intelligent tutoring system that helps students learn programming concepts through personalized recommendations.",
    longDescription:
      "This innovative AI system analyzes student learning patterns and provides personalized study recommendations. It includes interactive coding exercises, progress tracking, and adaptive learning paths. The system uses machine learning algorithms to optimize the learning experience for each individual student.",
    teamMembers: ["Emily Davis", "David Kim", "Jessica Wang"],
    technologies: ["Python", "TensorFlow", "Flask", "React"],
    image: "/placeholder.svg?height=300&width=500",
    githubUrl: "https://github.com/team/ai-study-assistant",
    liveUrl: "https://ai-study-assistant.com",
    completionDate: "April 2025",
    category: "Artificial Intelligence",
    features: ["Personalized Learning", "Progress Analytics", "Interactive Exercises", "Smart Recommendations"],
  },
  {
    id: 3,
    title: "Blockchain Voting System",
    description: "A secure and transparent voting system built on blockchain technology for student elections.",
    longDescription:
      "This project implements a decentralized voting system that ensures transparency, security, and immutability of votes. The system uses smart contracts to automate the voting process and provides real-time results while maintaining voter privacy. It's designed to be scalable for various types of elections.",
    teamMembers: ["Ryan Thompson", "Priya Patel", "Nahom Tekle"],
    technologies: ["Solidity", "Web3.js", "React", "Ethereum"],
    image: "/placeholder.svg?height=300&width=500",
    githubUrl: "https://github.com/team/blockchain-voting",
    liveUrl: "https://blockchain-voting-demo.com",
    completionDate: "March 2025",
    category: "Blockchain",
    features: ["Decentralized", "Transparent", "Secure", "Real-time Results"],
  },
  {
    id: 4,
    title: "Mobile Health Tracker",
    description: "A cross-platform mobile app for tracking health metrics and providing wellness recommendations.",
    longDescription:
      "This comprehensive health tracking application helps users monitor their daily activities, nutrition, and wellness goals. It includes features like step counting, calorie tracking, water intake monitoring, and personalized health insights. The app integrates with wearable devices and provides detailed analytics.",
    teamMembers: ["Feven Tadesse", "Hermona Bekele", "Sitotaw Alemu"],
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    image: "/placeholder.svg?height=300&width=500",
    githubUrl: "https://github.com/team/health-tracker",
    liveUrl: "https://health-tracker-app.com",
    completionDate: "February 2025",
    category: "Mobile Development",
    features: ["Cross-platform", "Wearable Integration", "Health Analytics", "Goal Tracking"],
  },
]

export function ProjectsPage({ onAddProject }: ProjectsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
            <h1 className="text-4xl font-bold text-gray-900">Graduation Capstone Projects</h1>
            <Code className="h-12 w-12 text-blue-500 animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-300">
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              🚀 <strong>Showcase of Innovation!</strong> 🚀
              <br />
              Here are the incredible capstone projects created by our talented CSE 2025 graduates. Each project
              represents months of hard work, creativity, and technical excellence. From AI-powered solutions to
              blockchain innovations, our students have pushed the boundaries of what's possible! 💻✨
            </p>
          </div>
        </div>

        {/* Add Project Button */}
        <div className="text-center mb-8">
          <Button
            onClick={onAddProject}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit Your Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800">{project.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </CardTitle>
                <p className="text-gray-600">{project.description}</p>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Team Members:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.teamMembers.map((member, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Completed: {project.completionDate}
                </div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{project.longDescription}</p>

                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Got an Amazing Project?</h3>
            <p className="text-gray-600 mb-6">
              Showcase your capstone project and inspire future generations! Share your innovation, hard work, and
              technical achievements with the CSE community. 🌟
            </p>
            <Button
              onClick={onAddProject}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit Your Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
