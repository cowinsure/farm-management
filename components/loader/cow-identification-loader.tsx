"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Progress } from "../ui/progress"
import { Eye, Database, Brain, FileText, Wifi } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Uploading Image",
    description: "Securely uploading your cow image to our servers",
    icon: Wifi,
    minDuration: 2000,
    maxDuration: 8000,
  },
  {
    id: 2,
    title: "Image Processing",
    description: "Analyzing image quality and preparing for identification",
    icon: Eye,
    minDuration: 3000,
    maxDuration: 10000,
  },
  {
    id: 3,
    title: "Feature Extraction",
    description: "AI is identifying unique facial features and markings",
    icon: Brain,
    minDuration: 5000,
    maxDuration: 15000,
  },
  {
    id: 4,
    title: "Database Matching",
    description: "Comparing features against registered cattle database",
    icon: Database,
    minDuration: 8000,
    maxDuration: 20000,
  },
  {
    id: 5,
    title: "Finalizing Results",
    description: "Compiling identification results and confidence scores",
    icon: FileText,
    minDuration: 2000,
    maxDuration: 5000,
  },
]

export default function CowIdentificationLoader() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const startTime = Date.now()

    // Update elapsed time every second
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    // Simulate realistic step progression
    let stepIndex = 0
    const progressStep = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex)
        setStepProgress(0)

        const step = steps[stepIndex]
        const stepDuration = Math.random() * (step.maxDuration - step.minDuration) + step.minDuration

        // Animate step progress
        const stepStartTime = Date.now()
        const stepProgressInterval = setInterval(() => {
          const stepElapsed = Date.now() - stepStartTime
          const stepProgressPercent = Math.min((stepElapsed / stepDuration) * 100, 100)
          setStepProgress(stepProgressPercent)

          // Update overall progress
          const overallProgress = ((stepIndex + stepProgressPercent / 100) / steps.length) * 100
          setProgress(overallProgress)

          if (stepProgressPercent >= 100) {
            clearInterval(stepProgressInterval)
            stepIndex++
            setTimeout(progressStep, 500) // Small delay between steps
          }
        }, 100)
      }
    }

    progressStep()

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-4 overflow-y-auto h-[90vh] ">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"
                style={{ animationDuration: "2s" }}
              ></div>
              <div className="absolute inset-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐄</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Identifying Your Cow</h2>
            <p className="text-gray-600">Our AI is analyzing the image to identify your cattle</p>
            <p className="text-sm text-gray-500 mt-2">Processing time: {formatTime(elapsedTime)}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                Processing... This may take a few moments depending on image complexity
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = currentStep === index
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                      isCompleted
                        ? "bg-green-50 border border-green-200"
                        : isCurrent
                          ? "bg-blue-50 border border-blue-200 shadow-md"
                          : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          isCompleted ? "text-green-800" : isCurrent ? "text-blue-800" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                      {isCurrent && (
                        <div className="mt-2">
                          <Progress value={stepProgress} className="h-1" />
                        </div>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Processing in Progress</h4>
                  <p className="text-sm text-yellow-700">
                    Please keep this page open while we identify your cow. Processing time varies based on image
                    complexity and server load. Typical range: 10-60 seconds.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-center text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-semibold text-gray-700">Current Step</div>
                <div className="text-blue-600">
                  {currentStep + 1} of {steps.length}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-semibold text-gray-700">Elapsed Time</div>
                <div className="text-green-600">{formatTime(elapsedTime)}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-semibold text-gray-700">Status</div>
                <div className="text-orange-600">Processing</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
