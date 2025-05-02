"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, AlertTriangle, ShieldAlert, Lightbulb, HelpCircle, Bot } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  timestamp: Date
}

type QuickQuestion = {
  id: number
  text: string
  icon: React.ReactNode
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Hello! I'm your AI Disaster Assistant. I can provide information about disaster preparedness, emergency protocols, and survival tips. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [chatHistory, setChatHistory] = useState<{ [key: string]: Message[] }>({})
  const [currentChat, setCurrentChat] = useState<string>("general")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()

    // Load chat history from localStorage
    const storedHistory = localStorage.getItem("chatHistory")
    if (storedHistory) {
      const history = JSON.parse(storedHistory)
      // Convert string timestamps back to Date objects
      Object.keys(history).forEach((key) => {
        history[key] = history[key].map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      })
      setChatHistory(history)

      // Set current messages to the general chat or create it if it doesn't exist
      if (history.general) {
        setMessages(history.general)
      } else {
        const initialMessage = {
          id: "welcome",
          role: "system",
          content:
            "Hello! I'm your AI Disaster Assistant. I can provide information about disaster preparedness, emergency protocols, and survival tips. How can I help you today?",
          timestamp: new Date(),
        }
        setMessages([initialMessage])
        setChatHistory((prev) => ({
          ...prev,
          general: [initialMessage],
        }))
      }
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Update chat history
    const updatedHistory = {
      ...chatHistory,
      [currentChat]: updatedMessages,
    }
    setChatHistory(updatedHistory)
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))

    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, this would use the OpenAI API
      // For demo purposes, we'll simulate a response
      setTimeout(async () => {
        let responseContent = ""

        // Simple pattern matching for demo purposes
        if (input.toLowerCase().includes("earthquake")) {
          responseContent =
            "During an earthquake, remember to DROP, COVER, and HOLD ON. Drop to the ground, take cover under a sturdy desk or table, and hold on until the shaking stops. Stay away from windows, exterior walls, and anything that could fall. If you're outdoors, move to an open area away from buildings, trees, and power lines."
        } else if (input.toLowerCase().includes("hurricane") || input.toLowerCase().includes("typhoon")) {
          responseContent =
            "For hurricane preparedness, create an emergency kit with water, non-perishable food, medications, flashlights, batteries, and important documents. Have an evacuation plan ready. Secure your home by boarding windows and bringing in outdoor furniture. Stay informed through weather alerts and follow evacuation orders from local authorities."
        } else if (input.toLowerCase().includes("flood")) {
          responseContent =
            "In case of flooding, move to higher ground immediately. Avoid walking or driving through flood waters - just 6 inches of moving water can knock you down, and 1 foot of water can sweep your vehicle away. Prepare by having emergency supplies ready and knowing evacuation routes. After a flood, be aware of contaminated water and damaged power lines."
        } else if (input.toLowerCase().includes("fire") || input.toLowerCase().includes("wildfire")) {
          responseContent =
            "For wildfires, create a defensible space around your home by clearing vegetation. Have an emergency kit ready and plan multiple evacuation routes. If ordered to evacuate, do so immediately. If trapped, call 911 and stay low to the ground where air is cleaner. After a fire, watch for hot spots and be cautious of structural damage."
        } else if (
          input.toLowerCase().includes("kit") ||
          input.toLowerCase().includes("supplies") ||
          input.toLowerCase().includes("prepare")
        ) {
          responseContent =
            "A basic emergency kit should include: 1) Water (one gallon per person per day for at least three days) 2) Non-perishable food (at least a three-day supply) 3) Battery-powered radio 4) Flashlight and extra batteries 5) First aid kit 6) Whistle to signal for help 7) Dust mask 8) Plastic sheeting and duct tape 9) Moist towelettes, garbage bags, and plastic ties 10) Wrench or pliers 11) Manual can opener 12) Local maps 13) Cell phone with chargers and a backup battery."
        } else {
          responseContent =
            "I'm here to help with disaster preparedness and emergency information. You can ask me about specific disasters like earthquakes, hurricanes, floods, or wildfires. I can also provide guidance on emergency kits, evacuation plans, and safety protocols. What specific information are you looking for?"
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        }

        const finalMessages = [...updatedMessages, assistantMessage]
        setMessages(finalMessages)

        // Update chat history again with the assistant's response
        const finalHistory = {
          ...updatedHistory,
          [currentChat]: finalMessages,
        }
        setChatHistory(finalHistory)
        localStorage.setItem("chatHistory", JSON.stringify(finalHistory))

        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)

      // Update chat history with the error message
      const finalHistory = {
        ...chatHistory,
        [currentChat]: finalMessages,
      }
      setChatHistory(finalHistory)
      localStorage.setItem("chatHistory", JSON.stringify(finalHistory))

      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions: QuickQuestion[] = [
    { id: 1, text: "What should be in an emergency kit?", icon: <ShieldAlert className="h-4 w-4" /> },
    { id: 2, text: "What to do during an earthquake?", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 3, text: "Hurricane preparation tips?", icon: <Lightbulb className="h-4 w-4" /> },
    { id: 4, text: "Flood safety guidelines?", icon: <HelpCircle className="h-4 w-4" /> },
  ]

  const switchChat = (chatId: string) => {
    // Save current messages to history
    const updatedHistory = {
      ...chatHistory,
      [currentChat]: messages,
    }
    setChatHistory(updatedHistory)
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))

    // Switch to selected chat
    setCurrentChat(chatId)

    // Load messages for selected chat or create new chat
    if (updatedHistory[chatId]) {
      setMessages(updatedHistory[chatId])
    } else {
      const initialMessage = {
        id: "welcome",
        role: "system",
        content: `Starting a new conversation about ${chatId}. How can I help you?`,
        timestamp: new Date(),
      }
      setMessages([initialMessage])
      setChatHistory((prev) => ({
        ...prev,
        [chatId]: [initialMessage],
      }))
    }
  }

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    switchChat(newChatId)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Disaster Chatbot</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Disaster Response Assistant</CardTitle>
                  <CardDescription>Ask about disaster preparedness and emergency protocols</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message, index) =>
                    message.role !== "system" ? (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="mb-1">{message.content}</div>
                          <div className="text-xs opacity-70 text-right">{formatTime(message.timestamp)}</div>
                        </div>
                      </div>
                    ) : index === 0 ? (
                      <div key={message.id} className="bg-muted/50 rounded-lg p-4 text-center">
                        <Bot className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <div className="text-lg font-medium">{message.content}</div>
                      </div>
                    ) : null,
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex w-full items-center space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm" variant="outline" onClick={createNewChat}>
                  New Chat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  key="general"
                  variant={currentChat === "general" ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => switchChat("general")}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>General</span>
                  </div>
                </Button>

                {Object.keys(chatHistory)
                  .filter((key) => key !== "general")
                  .map((chatId) => (
                    <Button
                      key={chatId}
                      variant={currentChat === chatId ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => switchChat(chatId)}
                    >
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span>Chat {chatId.split("-")[1]}</span>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>Common disaster-related questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput(question.text)
                      inputRef.current?.focus()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {question.icon}
                      <span>{question.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Information Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prepare">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prepare">Prepare</TabsTrigger>
                  <TabsTrigger value="respond">Respond</TabsTrigger>
                  <TabsTrigger value="recover">Recover</TabsTrigger>
                </TabsList>
                <TabsContent value="prepare" className="mt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to prepare an emergency kit?")
                      inputRef.current?.focus()
                    }}
                  >
                    Emergency Kit Essentials
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to create a family emergency plan?")
                      inputRef.current?.focus()
                    }}
                  >
                    Family Emergency Plan
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to prepare my home for disasters?")
                      inputRef.current?.focus()
                    }}
                  >
                    Home Preparation
                  </Button>
                </TabsContent>
                <TabsContent value="respond" className="mt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("What to do during an earthquake?")
                      inputRef.current?.focus()
                    }}
                  >
                    Earthquake Response
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to evacuate during a wildfire?")
                      inputRef.current?.focus()
                    }}
                  >
                    Wildfire Evacuation
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to stay safe during a flood?")
                      inputRef.current?.focus()
                    }}
                  >
                    Flood Safety
                  </Button>
                </TabsContent>
                <TabsContent value="recover" className="mt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to assess home damage after a disaster?")
                      inputRef.current?.focus()
                    }}
                  >
                    Damage Assessment
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("How to apply for disaster assistance?")
                      inputRef.current?.focus()
                    }}
                  >
                    Disaster Assistance
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput("Mental health resources after a disaster?")
                      inputRef.current?.focus()
                    }}
                  >
                    Mental Health Support
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
