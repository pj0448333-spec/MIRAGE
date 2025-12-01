"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Globe,
  Database,
  Copy,
  Search,
  ArrowLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProtectedImage {
  id: string
  name: string
  status: "protected" | "scanning" | "compromised" | "found_on_blockchain" | "found_on_web" | "revoked"
  uploadDate: string
  detections: number
  blockchainHash?: string
  cid?: string
  foundOnPlatforms?: string[]
  isTracked?: boolean
}

export default function MiragePage() {
  const [activeTab, setActiveTab] = useState<"home" | "dashboard" | "upload" | "track">("home")
  const [searchCID, setSearchCID] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    found: boolean
    platforms: string[]
    cid: string
  } | null>(null)
  const [protectedImages, setProtectedImages] = useState<ProtectedImage[]>([
    {
      id: "1",
      name: "profile_photo.jpg",
      status: "protected",
      uploadDate: "2024-01-15",
      detections: 0,
      blockchainHash: "0x1a2b3c4d5e6f...",
      cid: "QmYwAPJzv5CZsnA8rdHaSmKRvBohr5eFDAm4wD4yQ9ZuMd",
      isTracked: true,
    },
    {
      id: "2",
      name: "id_document.jpg",
      status: "found_on_blockchain",
      uploadDate: "2024-01-10",
      detections: 3,
      blockchainHash: "0x9f8e7d6c5b4a...",
      cid: "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
      foundOnPlatforms: ["Instagram", "Facebook", "AI Training Dataset"],
      isTracked: true,
    },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const copyCID = async (cid: string) => {
    try {
      await navigator.clipboard.writeText(cid)
      toast({
        title: "📋 CID Copied Successfully",
        description: `Content Identifier copied: ${cid.substring(0, 20)}...`,
      })
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = cid
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      toast({
        title: "📋 CID Copied",
        description: `Content Identifier copied: ${cid.substring(0, 20)}...`,
      })
    }
  }

  const handleBlockchainSearch = async () => {
    if (!searchCID.trim()) {
      toast({
        title: "❌ Invalid CID",
        description: "Please enter a valid Content Identifier to search.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setSearchResults(null)

    toast({
      title: "🔍 Searching Blockchain Networks",
      description: "Scanning Ethereum, Polygon, and IPFS networks for CID...",
    })

    setTimeout(() => {
      const isFound = Math.random() > 0.3

      if (isFound) {
        const foundPlatforms = [
          "Ethereum IPFS Gateway",
          "Polygon Network",
          "OpenSea NFT Marketplace",
          "AI Training Dataset",
          "Social Media Scraper",
          "Unauthorized Web Platform",
          "Image Repository",
        ]

        const randomPlatforms = foundPlatforms
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 1)

        setSearchResults({
          found: true,
          platforms: randomPlatforms,
          cid: searchCID,
        })

        toast({
          title: "⚠️ Image Found on Blockchain!",
          description: `Your image CID was detected on ${randomPlatforms.length} platform(s). You can now revoke it.`,
          variant: "destructive",
        })
      } else {
        setSearchResults({
          found: false,
          platforms: [],
          cid: searchCID,
        })

        toast({
          title: "✅ CID Not Found",
          description: "Your image CID was not detected on any monitored blockchain networks or platforms.",
        })
      }

      setIsSearching(false)
    }, 3000)
  }

  const handleRevokeFromSearch = () => {
    if (!searchResults) return

    toast({
      title: "🔄 Revocation Process Started",
      description: "Sending removal requests to all detected platforms...",
    })

    setTimeout(() => {
      toast({
        title: "🗑️ Image Successfully Revoked",
        description: "The image has been removed from all detected platforms and blockchain networks.",
      })

      setSearchResults({
        ...searchResults,
        found: false,
        platforms: [],
      })
    }, 2000)
  }

  const simulateTracking = (imageId: string) => {
    console.log("[v0] Starting CID tracking for image:", imageId)

    setTimeout(() => {
      setProtectedImages((prev) =>
        prev.map((img) => {
          if (img.id === imageId) {
            return { ...img, status: "scanning" }
          }
          return img
        }),
      )

      toast({
        title: "🔍 Scanning Blockchain",
        description: "Searching for image CID across blockchain networks...",
      })
    }, 2000)

    setTimeout(() => {
      const isFound = Math.random() > 0.5

      if (isFound) {
        setProtectedImages((prev) =>
          prev.map((img) => {
            if (img.id === imageId) {
              const foundOnPlatforms = ["Ethereum IPFS", "Polygon Network", "AI Training Dataset", "NFT Marketplace"]
              return {
                ...img,
                status: "found_on_blockchain",
                foundOnPlatforms,
                detections: Math.floor(Math.random() * 5) + 1,
              }
            }
            return img
          }),
        )

        toast({
          title: "⚠️ Image Found on Blockchain!",
          description: "CID detected on multiple blockchain networks. Manual action required.",
          variant: "destructive",
        })
      } else {
        setProtectedImages((prev) =>
          prev.map((img) => {
            if (img.id === imageId) {
              return { ...img, status: "protected" }
            }
            return img
          }),
        )

        toast({
          title: "✅ No Unauthorized Use Detected",
          description: "Your image CID was not found on any monitored platforms.",
        })
      }
    }, 5000)
  }

  const generateCID = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "Qm"
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] File upload triggered")
    const file = event.target.files?.[0]

    if (!file) {
      console.log("[v0] No file selected")
      return
    }

    console.log("[v0] File selected:", file.name, file.size, file.type)

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG, GIF).",
        variant: "destructive",
      })
      return
    }

    const newImage: ProtectedImage = {
      id: Date.now().toString(),
      name: file.name,
      status: "scanning",
      uploadDate: new Date().toISOString().split("T")[0],
      detections: 0,
      blockchainHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
      cid: generateCID(),
      isTracked: true,
    }

    setProtectedImages((prev) => [...prev, newImage])

    setTimeout(() => {
      setProtectedImages((prev) => prev.map((img) => (img.id === newImage.id ? { ...img, status: "protected" } : img)))
      toast({
        title: "✅ Image Protected!",
        description: `${file.name} has been watermarked and registered with CID: ${newImage.cid?.substring(0, 20)}...`,
      })

      simulateTracking(newImage.id)
    }, 3000)

    toast({
      title: "🔄 Processing Image",
      description: "Applying adversarial watermark, generating CID, and blockchain registration...",
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleTrackImage = (cid: string) => {
    setSearchCID(cid)
    setActiveTab("track")
    toast({
      title: "🔍 Ready to Track",
      description: "CID has been loaded. Click search to track this image across blockchain networks.",
    })
  }

  const handleChooseFile = () => {
    console.log("[v0] Choose file button clicked")
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] Drag over detected")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] File dropped")

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const mockEvent = {
        target: {
          files: [file],
        },
      } as React.ChangeEvent<HTMLInputElement>
      handleImageUpload(mockEvent)
    }
  }

  const handleManualRemoval = (imageId: string) => {
    setProtectedImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId) {
          return {
            ...img,
            status: "protected",
            detections: 0,
            foundOnPlatforms: [],
          }
        }
        return img
      }),
    )

    toast({
      title: "🔄 Removal Request Sent",
      description: "Manual removal requests have been sent to all detected platforms using your CID.",
    })
  }

  const handleKillSwitch = (imageId: string) => {
    setProtectedImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, status: "protected", detections: 0, foundOnPlatforms: [] } : img,
      ),
    )
    toast({
      title: "🔥 Kill Switch Activated",
      description: "Image access has been revoked across all verified systems using blockchain smart contracts.",
    })
  }

  const handleRevocation = (imageId: string) => {
    setProtectedImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, status: "revoked", detections: 0, foundOnPlatforms: [] } : img,
      ),
    )

    toast({
      title: "🗑️ Image Permanently Revoked",
      description: "CID has been deleted from blockchain and all tracking has been stopped permanently.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "protected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "scanning":
        return <Eye className="h-4 w-4 text-blue-500 animate-pulse" />
      case "compromised":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "found_on_blockchain":
        return <Database className="h-4 w-4 text-orange-500" />
      case "found_on_web":
        return <Globe className="h-4 w-4 text-purple-500" />
      case "revoked":
        return <Trash2 className="h-4 w-4 text-gray-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "protected":
        return "bg-green-100 text-green-800"
      case "scanning":
        return "bg-blue-100 text-blue-800"
      case "compromised":
        return "bg-red-100 text-red-800"
      case "found_on_blockchain":
        return "bg-orange-100 text-orange-800"
      case "found_on_web":
        return "bg-purple-100 text-purple-800"
      case "revoked":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (activeTab === "track") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900"> SovereignSight </h1>
              </div>
              <nav className="flex space-x-4">
                <Button variant="ghost" onClick={() => setActiveTab("home")}>
                  Home
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab("upload")}>
                  Upload Image
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("track")}>
                  Track Image
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setActiveTab("dashboard")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Image by CID</h2>
            <p className="text-gray-600">
              Search for your Content Identifier (CID) across blockchain networks and web platforms
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Blockchain CID Search
              </CardTitle>
              <CardDescription>
                Enter your image's Content Identifier to track its usage across blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter CID (e.g., QmYwAPJzv5CZsnA8rdHaSmKRvBohr5eFDAm4wD4yQ9ZuMd)"
                    value={searchCID}
                    onChange={(e) => setSearchCID(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleBlockchainSearch}
                    disabled={isSearching}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSearching ? (
                      <>
                        <Eye className="mr-2 h-4 w-4 animate-pulse" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  This will scan Ethereum, Polygon, IPFS networks, and web platforms for unauthorized usage.
                </p>
              </div>
            </CardContent>
          </Card>

          {searchResults && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {searchResults.found ? (
                    <>
                      <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                      Search Results - Image Found
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Search Results - No Unauthorized Use
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2">CID: {searchResults.cid}</p>
                    {searchResults.found ? (
                      <div className="space-y-3">
                        <p className="text-orange-600 font-medium">
                          ⚠️ Your image was found on {searchResults.platforms.length} platform(s):
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {searchResults.platforms.map((platform, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              {platform}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-3">
                            Your image is being used without authorization. You can revoke access to remove it from all
                            detected platforms.
                          </p>
                          <Button onClick={handleRevokeFromSearch} className="bg-red-600 hover:bg-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Revoke Image Access
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-green-600 font-medium">✅ No unauthorized use detected</p>
                        <p className="text-sm text-gray-600">
                          Your image CID was not found on any monitored blockchain networks or web platforms.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How CID Tracking Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Search Phase</p>
                    <p>We scan blockchain networks (Ethereum, Polygon) and IPFS gateways for your CID.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Detection Results</p>
                    <p>If found, we show you exactly where your image is being used without permission.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Revocation</p>
                    <p>Click "Revoke" to send removal requests to all detected platforms and blockchain networks.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (activeTab === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900"> SovereignSight</h1>
                <Badge variant="secondary" className="text-xs">
                  v2.0
                </Badge>
              </div>
              <nav className="flex space-x-4">
                <Button variant="ghost" onClick={() => setActiveTab("home")}>
                  Home
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>
                  Dashboard
                </Button>
                <Button onClick={() => setActiveTab("upload")}>Upload Image</Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Blockchain-Secured Digital Identity for the AI Era</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced CID-based tracking with user-controlled removal from blockchain networks and web platforms using
              smart contract enforcement.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={() => setActiveTab("upload")}>
                <Upload className="mr-2 h-5 w-5" />
                Protect Your Images
              </Button>
              <Button variant="outline" size="lg" onClick={() => setActiveTab("dashboard")}>
                View Dashboard
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-blue-600" />
                  CID Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your images across blockchain networks using Content Identifiers (CID) with real-time monitoring
                  and detection alerts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-purple-600" />
                  Manual Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You have full control over removal decisions. When unauthorized use is detected, choose when and how
                  to respond with manual removal requests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Smart Contract Kill Switch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instantly disable image access across all verified systems using Ethereum smart contracts with
                  permanent revocation capability.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Protection Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">15,000+</div>
                <div className="text-gray-600">CIDs Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-gray-600">User Control Success</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">5.2s</div>
                <div className="text-gray-600">Average Detection Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-gray-600">Blockchain Monitoring</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (activeTab === "upload") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">SovereignSight</h1>
              </div>
              <nav className="flex space-x-4">
                <Button variant="ghost" onClick={() => setActiveTab("home")}>
                  Home
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Upload Image
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Protect Your Image with CID Tracking</h2>
            <p className="text-gray-600">
              Upload your image to generate a unique CID and enable blockchain-based tracking with user-controlled
              removal
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Advanced Image Protection</CardTitle>
              <CardDescription>
                Supported formats: JPG, PNG, GIF (Max size: 10MB) • CID Generation • Blockchain Registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleChooseFile}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop your image here or click to browse</p>
                <p className="text-gray-500 mb-4">
                  Your image will be assigned a unique CID and tracked across blockchain networks
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                  Choose File
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Alternative: Direct File Selection</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                />
              </div>

              {protectedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Uploads:</h4>
                  <div className="space-y-2">
                    {protectedImages.slice(-3).map((image) => (
                      <div key={image.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(image.status)}
                          <div>
                            <span className="text-sm font-medium">{image.name}</span>
                            {image.cid && (
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-blue-600">CID: {image.cid.substring(0, 20)}...</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => copyCID(image.cid!)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                                  onClick={() => handleTrackImage(image.cid!)}
                                >
                                  Track Image
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(image.status)}>{image.status.replace("_", " ")}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Protection Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>CID generation & tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Blockchain registration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>User-controlled removal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Smart contract enforcement</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SovereignSight</h1>
            </div>
            <nav className="flex space-x-4">
              <Button variant="ghost" onClick={() => setActiveTab("home")}>
                Home
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => setActiveTab("upload")}>Upload Image</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Protection Dashboard</h2>
          <p className="text-gray-600">Monitor CID tracking, blockchain detection, and manage removal actions</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Blockchain CID Search
            </CardTitle>
            <CardDescription>
              Search for any Content Identifier (CID) across blockchain networks and web platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter CID to search (e.g., QmYwAPJzv5CZsnA8rdHaSmKRvBohr5eFDAm4wD4yQ9ZuMd)"
                value={searchCID}
                onChange={(e) => setSearchCID(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleBlockchainSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                {isSearching ? (
                  <>
                    <Eye className="mr-2 h-4 w-4 animate-pulse" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Blockchain
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Search results will show if the CID is found on blockchain networks, and you can then send it for
              revocation.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Protected</p>
                  <p className="text-2xl font-bold text-gray-900">{protectedImages.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Scans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {protectedImages.filter((img) => img.status === "scanning").length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Detections</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      protectedImages.filter(
                        (img) => img.status === "found_on_blockchain" || img.status === "found_on_web",
                      ).length
                    }
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Violations</p>
                  <p className="text-2xl font-bold text-red-600">
                    {protectedImages.reduce((sum, img) => sum + img.detections, 0)}
                  </p>
                </div>
                <Database className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Protected Images with CID Tracking</CardTitle>
            <CardDescription>Monitor blockchain detection and manage removal actions manually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {protectedImages.map((image) => (
                <div key={image.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(image.status)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{image.name}</p>
                      <p className="text-sm text-gray-500">Uploaded: {image.uploadDate}</p>

                      {image.cid && (
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-purple-600 font-mono">CID: {image.cid}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={() => copyCID(image.cid!)}
                            title="Copy CID to clipboard"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                            onClick={() => handleTrackImage(image.cid!)}
                            title="Track this image"
                          >
                            Track Image
                          </Button>
                        </div>
                      )}

                      {image.blockchainHash && <p className="text-xs text-blue-600">Hash: {image.blockchainHash}</p>}
                      {image.foundOnPlatforms && image.foundOnPlatforms.length > 0 && (
                        <p className="text-xs text-orange-600 mt-1">⚠️ Found on: {image.foundOnPlatforms.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(image.status)}>{image.status.replace("_", " ")}</Badge>

                    {image.detections > 0 && <Badge variant="destructive">{image.detections} violations</Badge>}

                    {(image.status === "found_on_blockchain" || image.status === "found_on_web") && (
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleManualRemoval(image.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Request Removal
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleKillSwitch(image.id)}>
                          Kill Switch
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRevocation(image.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    )}

                    {image.status === "revoked" && <Badge variant="secondary">Permanently Deleted</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
