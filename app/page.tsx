"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { GraduationCap, ArrowRight, Users, Calendar, Camera, Heart, Star, Code, Trophy, Video, Volume2, VolumeX } from "lucide-react"
import { useSession } from "next-auth/react"
import { Navigation } from "@/components/navigation"
import { CountdownTimer } from "@/components/countdown-timer"
import { ClassmatesPage } from "@/components/classmates-page"
import { EventsPage } from "@/components/events-page"
import { MemoriesPage } from "@/components/memories-page"
import { NominationsPage } from "@/components/nominations-page"
import { ProjectsPage } from "@/components/projects-page"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeRain } from "@/components/code-rain"
import { FloatingCode } from "@/components/floating-code"
import { TypingAnimation } from "@/components/typing-animation"
import { GroupPhotos } from "@/components/group-photos"
import { CodeDecorations } from "@/components/code-decorations"
import { toast } from "sonner"
import { getApiUrl } from "@/lib/api"

// Video Player Component
const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Format time in seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle video loaded
  const handleVideoCanPlay = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };
  
  // Update progress bar as video plays
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl relative group">
      {/* Loading Overlay */}
      <div className={`absolute inset-0 bg-black/80 flex items-center justify-center z-20 transition-opacity duration-300 ${isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading video...</p>
        </div>
      </div>
      
      {/* Video Element */}
      <video 
        id="journey-video"
        ref={videoRef}
        autoPlay 
        loop 
        muted
        playsInline
        className="w-full h-auto relative z-10"
        onCanPlay={handleVideoCanPlay}
        onTimeUpdate={handleVideoTimeUpdate}
      >
        <source src="/vid/video_2025-06-16_14-25-00.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div 
          className="h-1 bg-white/30 rounded-full mb-2 overflow-hidden cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button 
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <span className="text-sm text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Fullscreen"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a1 1 0 011-1h4a1 1 0 110 2H7v2a1 1 0 11-2 0zm5 5v2a1 1 0 11-2 0v-4a1 1 0 112 0v2h2a1 1 0 110 2h-4zm4-8a1 1 0 011 1v4a1 1 0 11-2 0V9h-2a1 1 0 110-2h4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("");
  const { data: session } = useSession();

  const handleAddContent = async (action: string) => {
    if (!session) {
      setAuthAction(action)
      setShowAuthModal(true)
      return;
    }

    try {
      // Fetch the user's profile to check approval status
      const response = await fetch(getApiUrl('profiles/me/'), {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profile = await response.json();
      
      if (!profile.is_approved) {
        // Show a toast notification that the user needs to wait for approval
        toast.error('Your profile is pending approval. Please wait for an admin to approve your account before adding content.');
        return;
      }

      // If we get here, the user is approved and can add content
      console.log(`Adding ${action} for user:`, session.user?.name);
      
      // Here you would typically open a modal or navigate to the content creation page
      // For now, we'll just log it
      toast.success(`You can now ${action}`);
      
    } catch (error) {
      console.error('Error checking profile status:', error);
      toast.error('An error occurred while checking your profile status');
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "classmates":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <ClassmatesPage onAddProfile={() => handleAddContent("add your profile")} />
          </div>
        )
      case "events":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <EventsPage onAddEvent={() => handleAddContent("add a new event")} />
          </div>
        )
      case "memories":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <MemoriesPage onAddMemory={() => handleAddContent("share a memory")} />
          </div>
        )
      case "nominations":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <NominationsPage />
          </div>
        )
      case "projects":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <ProjectsPage onAddProject={() => handleAddContent("submit your project")} />
          </div>
        )
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Code Animations */}
      <CodeRain />
      <FloatingCode />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white px-4 py-20 overflow-hidden">
        <CodeDecorations />
        <GroupPhotos />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Class Badge */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-sm border border-blue-700/50 rounded-full px-6 py-3">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-medium">Class of 2025 Digital Yearbook</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start mb-16">
            {/* Left Side - Main Title */}
            <div>
              <h1 className="text-6xl xl:text-8xl font-bold mb-8 text-white">
                <TypingAnimation text="ASTU" speed={200} />
              </h1>
              <h2 className="text-2xl md:text-4xl font-light text-blue-200 mb-8">
                <TypingAnimation text="YEARBOOK 2025" speed={100} />
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Celebrating four incredible years of friendship, innovation, and unforgettable memories in Computer
                Science & Engineering.
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setCurrentPage("classmates")}
              >
                Explore Your Yearbook <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Right Side - Countdown Timer */}
            <div className="lg:mt-8">
              <CountdownTimer />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
              <TypingAnimation text="ASTU" speed={200} />
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-blue-200 mb-8">
              <TypingAnimation text="YEARBOOK 2025" speed={100} />
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-12">
              Celebrating four incredible years of friendship, innovation, and unforgettable memories in Computer
              Science & Engineering.
            </p>

            {/* CTA Button */}
            <div className="text-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setCurrentPage("classmates")}
              >
                Explore Your Yearbook <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Countdown Timer for Mobile */}
            <CountdownTimer />
          </div>

          {/* Meet Our Amazing Graduates Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Heart className="h-6 w-6 text-pink-400" />
              <h3 className="text-2xl font-semibold">Meet Our Amazing Graduates</h3>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-2xl mb-8">
              {[
                "/images/amaizing/photo_2025-06-16_13-21-43.jpg",
                "/images/amaizing/photo_2025-06-16_13-22-45.jpg",
                "/images/amaizing/photo_2025-06-16_13-24-17.jpg",
                "/images/amaizing/photo_2025-06-16_13-51-59.jpg",
                "/images/amaizing/photo_2025-06-16_13-53-31.jpg",
                "/images/amaizing/photo_2025-06-16_13-55-09.jpg",
                "/images/amaizing/photo_2025-06-16_13-55-28.jpg",
                "/images/amaizing/ss.jpg"
              ].map((src, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <div className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-110 overflow-hidden">
                        <Image
                          src={src}
                          alt={`Graduate ${i + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                      <Image
                        src={src}
                        alt={`Graduate ${i + 1}`}
                        fill
                        className="object-contain p-4 bg-white rounded-lg"
                        unoptimized={src.endsWith('.gif')}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                        {/* <p className="text-lg font-medium">Graduate {i + 1}</p> */}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            <p className="text-blue-200 text-lg">
              <TypingAnimation text="And 100+ more incredible students waiting to reconnect with you!" speed={50} />
            </p>
          </div>

          {/* Video Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Video className="h-6 w-6 text-blue-400" />
                <h3 className="text-2xl font-semibold">Our Journey Together</h3>
              </div>
            </div>
            <VideoPlayer />
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce" />
                <h4 className="font-semibold mb-2 text-lg text-white">Connect With</h4>
                <p className="text-3xl font-bold text-white">100+ Classmates</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-200" />
                <h4 className="font-semibold mb-2 text-lg text-white">Relive</h4>
                <p className="text-3xl font-bold text-white">Epic Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 text-center">
                <Camera className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-400" />
                <h4 className="font-semibold mb-2 text-lg text-white">Browse</h4>
                <p className="text-3xl font-bold text-white">500+ Photos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-6 text-center">
                <Heart className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-600" />
                <h4 className="font-semibold mb-2 text-lg text-white">Share</h4>
                <p className="text-3xl font-bold text-white">Memories</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">
                100+
              </div>
              <div className="text-blue-200 text-lg">Brilliant Students</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">
                500+
              </div>
              <div className="text-blue-200 text-lg">Precious Photos</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">4</div>
              <div className="text-blue-200 text-lg">Amazing Years</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">∞</div>
              <div className="text-blue-200 text-lg">Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <TypingAnimation text="Explore Our Digital Yearbook" speed={80} />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("classmates")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-spin">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Our Squad</h3>
                <p className="text-gray-600">Meet the legends of CSE 2025</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:-rotate-1"
              onClick={() => setCurrentPage("events")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-bounce">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Epic Events</h3>
                <p className="text-gray-600">Relive our amazing moments</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("memories")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-pulse">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Memories</h3>
                <p className="text-gray-600">Photos with stories</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:-rotate-1"
              onClick={() => setCurrentPage("nominations")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-spin">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Fun Awards</h3>
                <p className="text-gray-600">Hilarious nominations</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("projects")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-bounce">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">GC Projects</h3>
                <p className="text-gray-600">Showcase our work</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            <TypingAnimation text="Our Journey in Numbers" speed={80} />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce">100+</div>
              <div className="text-gray-600">Amazing Students</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-100">15+</div>
              <div className="text-gray-600">Memorable Events</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-200">500+</div>
              <div className="text-gray-600">Photos Captured</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-300">4</div>
              <div className="text-gray-600">Years Together</div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 px-4 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            <TypingAnimation text="What's Inside Your Digital Yearbook" speed={60} />
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-xl">
            Discover all the amazing content waiting for you in our comprehensive digital yearbook experience.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-spin">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Student Profiles</h3>
                <p className="text-gray-600">Meet every graduate with their stories, achievements, and future plans</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-bounce">
                  <Calendar className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Event Highlights</h3>
                <p className="text-gray-600">Relive all the memorable events, celebrations, and milestones</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-pulse">
                  <Camera className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Photo Gallery</h3>
                <p className="text-gray-600">Browse hundreds of photos capturing our journey together</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-spin">
                  <Heart className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Memory Stories</h3>
                <p className="text-gray-600">Share and read personal memories and experiences</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800 to-blue-900 text-white relative overflow-hidden">
        <CodeDecorations />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Code className="h-16 w-16 mx-auto mb-6 text-blue-200 animate-spin" />
          <h2 className="text-3xl font-bold mb-4">
            <TypingAnimation text="Ready to Explore?" speed={100} />
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Dive into our collection of memories, stories, and the incredible journey we've shared together.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setCurrentPage("classmates")}
          >
            Start Exploring
          </Button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Page Content */}
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        <CodeDecorations />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400 animate-bounce" />
              <span className="text-2xl font-bold">ASTU Yearbook 2025</span>
            </div>
            <p className="text-gray-400 mb-4">Computer Science Engineering Department</p>
            <div className="flex justify-center items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
              <span>by the CSE Class of 2025</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              <TypingAnimation text="© 2025 ASTU. All memories preserved with love." speed={50} />
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action={authAction} />}
    </div>
  )
}
