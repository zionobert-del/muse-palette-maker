import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Code, Palette, Wand2, Zap, Copy, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface EditSuggestion {
  id: string;
  type: "ui" | "functionality" | "style" | "component";
  title: string;
  description: string;
  code?: string;
  preview?: string;
  difficulty: "easy" | "medium" | "hard";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: EditSuggestion[];
}

export const WebEditor = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your unlimited web development assistant. I can help you edit, improve, and customize this artwork application. What would you like to change or add?",
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = async (userMessage: string): Promise<{ content: string; suggestions: EditSuggestion[] }> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const suggestions: EditSuggestion[] = [];
    const lowerMessage = userMessage.toLowerCase();

    // Generate contextual suggestions based on user input
    if (lowerMessage.includes("color") || lowerMessage.includes("theme")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "style",
        title: "Update Color Scheme",
        description: "Implement a new color palette with custom gradients",
        code: `// Custom color variables in index.css\n:root {\n  --primary: 210 100% 60%;\n  --gradient-primary: linear-gradient(135deg, hsl(210 100% 60%), hsl(280 100% 70%));\n}`,
        difficulty: "easy"
      });
    }

    if (lowerMessage.includes("button") || lowerMessage.includes("ui")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "ui",
        title: "Enhanced Button Component",
        description: "Add animated buttons with hover effects",
        code: `<Button className="bg-gradient-primary hover:scale-105 transition-transform duration-200">\n  Enhanced Button\n</Button>`,
        difficulty: "easy"
      });
    }

    if (lowerMessage.includes("animation") || lowerMessage.includes("effect")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "style",
        title: "Add Floating Animation",
        description: "Create smooth floating animations for UI elements",
        code: `@keyframes float {\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-10px); }\n}\n\n.animate-float {\n  animation: float 3s ease-in-out infinite;\n}`,
        difficulty: "medium"
      });
    }

    if (lowerMessage.includes("component") || lowerMessage.includes("feature")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "component",
        title: "New Interactive Component",
        description: "Build a custom component with advanced functionality",
        code: `const InteractiveWidget = () => {\n  const [active, setActive] = useState(false);\n  \n  return (\n    <div className="interactive-widget">\n      {/* Component implementation */}\n    </div>\n  );\n};`,
        difficulty: "hard"
      });
    }

    // Always add at least one general suggestion
    if (suggestions.length === 0) {
      suggestions.push({
        id: Math.random().toString(),
        type: "functionality",
        title: "Enhance User Experience",
        description: "Improve the overall user interface and interactions",
        code: `// Add smooth transitions and micro-interactions\n.transition-all {\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}`,
        difficulty: "medium"
      });
    }

    const responses = [
      `I understand you want to ${userMessage.toLowerCase()}. Here are some suggestions to improve your application:`,
      `Great idea! I can help you implement ${userMessage.toLowerCase()}. Let me provide some code solutions:`,
      `That's a fantastic request! Here's how we can enhance your webpage with ${userMessage.toLowerCase()}:`,
      `Perfect! I'll help you ${userMessage.toLowerCase()}. Check out these implementation options:`,
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsProcessing(true);
    setRequestCount(prev => prev + 1);

    try {
      const { content, suggestions } = await generateResponse(currentMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
        suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to process request. Please try again.");
    } finally {
      setIsProcessing(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-accent text-accent-foreground";
      case "medium": return "bg-secondary text-secondary-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ui": return <Palette className="w-4 h-4" />;
      case "functionality": return <Zap className="w-4 h-4" />;
      case "style": return <Wand2 className="w-4 h-4" />;
      case "component": return <Code className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-primary-foreground border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-3">
            <Bot className="w-8 h-8" />
            AI Web Editor
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Unlimited requests • Instant modifications • Intelligent suggestions
          </CardDescription>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="text-sm">
              Requests: {requestCount}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              ♾️ Unlimited
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Assistant Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className={message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}>
                        {message.role === "assistant" ? <Bot className="w-4 h-4" /> : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4 animate-pulse" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe what you want to change or add..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isProcessing || !currentMessage.trim()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Panel */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Code Suggestions
            </CardTitle>
            <CardDescription>
              Ready-to-use code snippets and implementations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-4">
                {messages
                  .filter(m => m.suggestions && m.suggestions.length > 0)
                  .reverse()
                  .slice(0, 10)
                  .map((message) =>
                    message.suggestions?.map((suggestion) => (
                      <Card key={suggestion.id} className="border border-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(suggestion.type)}
                              <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                            </div>
                            <Badge className={getDifficultyColor(suggestion.difficulty)}>
                              {suggestion.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {suggestion.description}
                          </CardDescription>
                        </CardHeader>
                        {suggestion.code && (
                          <CardContent className="pt-0">
                            <div className="relative">
                              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                <code>{suggestion.code}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() => handleCopyCode(suggestion.code!)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                
                {messages.filter(m => m.suggestions && m.suggestions.length > 0).length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Start a conversation to see AI-generated code suggestions
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common modifications you can request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Change Colors", action: "change the color scheme to blue and purple" },
              { label: "Add Animation", action: "add smooth animations to buttons" },
              { label: "New Component", action: "create a new interactive widget" },
              { label: "Improve Layout", action: "make the layout more responsive" },
              { label: "Add Features", action: "add a search functionality" },
              { label: "Style Updates", action: "update the typography and spacing" },
              { label: "Performance", action: "optimize the application performance" },
              { label: "Accessibility", action: "improve accessibility features" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setCurrentMessage(item.action)}
              >
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span className="text-xs">{item.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};