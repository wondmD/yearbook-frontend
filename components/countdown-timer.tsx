"use client"

import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set reunion date to 10 years from graduation (2035)
    const reunionDate = new Date("2035-06-15T00:00:00")

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = reunionDate.getTime() - now

      if (distance > 0) {
        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365))
        const months = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
        const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ years, months, days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 lg:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-yellow-300 mb-2">
          🎉 CSE 2025 Reunion Countdown 🎉
        </h2>
        <p className="text-lg lg:text-xl text-yellow-100">See you all in 10 years!</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 text-center">
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.years}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Years</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.months}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Months</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.days}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Days</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.hours}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Hours</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.minutes}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Minutes</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 lg:p-4">
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 lg:mb-2">{timeLeft.seconds}</div>
          <div className="text-xs lg:text-sm text-yellow-200">Seconds</div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-base lg:text-lg text-yellow-100">
          Mark your calendars! June 15, 2035 - Let's reunite and celebrate our journey! 🚀
        </p>
      </div>
    </div>
  )
}
