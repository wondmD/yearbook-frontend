// This file contains dummy data for local development
// It will be replaced with actual API calls when connecting to Django

export interface Member {
  id: number
  name: string
  nickname: string
  bio: string
  location: string
  interests: string[]
  image: string
  funFact: string
}

export interface Event {
  id: number
  title: string
  date: string
  location: string
  description: string
  fullDescription: string
  attendees: number
  photos: number
  highlights: string[]
  image: string
  gallery: string[]
}

export interface Memory {
  id: number
  title: string
  description: string
  image: string
  date: string
  location: string
  likes: number
  tags: string[]
}

export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  teamMembers: string[]
  technologies: string[]
  image: string
  githubUrl: string
  liveUrl: string
  completionDate: string
  category: string
  features: string[]
}

export const dummyMembers: Member[] = [
  {
    id: 1,
    name: "Alex Johnson",
    nickname: "Bug Hunter Supreme",
    bio: "The debugging wizard who can find bugs faster than they can hide. Known for surviving on coffee and Stack Overflow.",
    location: "Addis Ababa, Ethiopia",
    interests: ["Full Stack", "AI/ML", "Coffee"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Once debugged code in their sleep",
  },
  {
    id: 2,
    name: "Sarah Chen",
    nickname: "Pixel Perfectionist",
    bio: "Frontend magician who makes pixels dance. Can center a div blindfolded and has strong opinions about semicolons.",
    location: "Adama, Ethiopia",
    interests: ["React", "UI/UX", "Design"],
    image: "/placeholder.svg?height=300&width=300",
    funFact: "Has 47 different shades of blue in her color palette",
  },
  // Add more members as needed
]

export const dummyEvents: Event[] = [
  {
    id: 1,
    title: "50 Day Celebration",
    date: "March 15, 2024",
    location: "Main Auditorium",
    description:
      "Our first major milestone celebration! We made it through the first 50 days of college with flying colors (and lots of coffee).",
    fullDescription:
      "What an incredible day! Our 50-day celebration marked the first major milestone of our CSE journey. The auditorium was packed with excited students, proud faculty, and enough pizza to feed a small army. We had ice-breaker games that actually broke the ice (and some friendships 😄), group photos where everyone tried to look serious but failed miserably, and speeches that ranged from inspiring to hilariously awkward. The highlight was definitely when Professor Ahmed tried to explain recursion using pizza slices - we're still confused but we got free pizza! This day officially marked us as 'real' CSE students, whatever that means.",
    attendees: 58,
    photos: 45,
    highlights: ["Welcome speeches", "Ice breaker games", "Group photos", "Pizza party"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  // Add more events as needed
]

export const dummyMemories: Memory[] = [
  {
    id: 1,
    title: "First Day Chaos",
    description:
      "Remember our very first day? We were all lost, confused, and trying to find the CSE building. Half of us ended up in the wrong department, and the other half were still looking for parking. This photo captures the exact moment we realized we had no idea what we were doing, but we were doing it together! 😅",
    image: "/placeholder.svg?height=400&width=600",
    date: "September 15, 2021",
    location: "ASTU Campus",
    likes: 45,
    tags: ["FirstDay", "Memories", "Chaos"],
  },
  // Add more memories as needed
]

export const dummyProjects: Project[] = [
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
  // Add more projects as needed
]
