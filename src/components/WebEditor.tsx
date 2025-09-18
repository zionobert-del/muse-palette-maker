import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Code, Palette, Wand2, Zap, Copy, CheckCircle2, ArrowRight, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";

interface EditSuggestion {
  id: string;
  type: "ui" | "functionality" | "style" | "component";
  title: string;
  description: string;
  code?: string;
  preview?: string;
  difficulty: "easy" | "medium" | "hard";
  action?: () => void;
  executable?: boolean;
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
      content: "Hello! I'm your unlimited web development assistant. I can actually modify this artwork application in real-time. Just tell me what you want to change and I'll apply it instantly!",
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [appliedChanges, setAppliedChanges] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Real-time page modification functions
  const applyColorScheme = (primary: string, secondary: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    toast.success("Color scheme updated!");
    setAppliedChanges(prev => [...prev, `Changed colors to ${primary} and ${secondary}`]);
  };

  const addFloatingAnimation = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-ai {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float-ai {
        animation: float-ai 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    // Apply to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.add('animate-float-ai'));
    
    toast.success("Floating animation added to buttons!");
    setAppliedChanges(prev => [...prev, "Added floating animations to buttons"]);
  };

  const addGlowEffect = () => {
    const style = document.createElement('style');
    style.textContent = `
      .ai-glow {
        box-shadow: 0 0 20px hsl(var(--primary) / 0.5);
        transition: box-shadow 0.3s ease;
      }
      .ai-glow:hover {
        box-shadow: 0 0 30px hsl(var(--primary) / 0.8);
      }
    `;
    document.head.appendChild(style);
    
    // Apply to cards
    const cards = document.querySelectorAll('[class*="card"]');
    cards.forEach(card => card.classList.add('ai-glow'));
    
    toast.success("Glow effects added to cards!");
    setAppliedChanges(prev => [...prev, "Added glow effects to cards"]);
  };

  const changeBackground = (gradientType: string) => {
    const body = document.body;
    const gradients = {
      sunset: 'linear-gradient(135deg, #ff7e7e, #ff9a56, #ffad56)',
      ocean: 'linear-gradient(135deg, #667eea, #764ba2)',
      forest: 'linear-gradient(135deg, #134e5e, #71b280)',
      space: 'linear-gradient(135deg, #2c3e50, #34495e, #9b59b6)'
    };
    
    body.style.background = gradients[gradientType as keyof typeof gradients] || gradients.sunset;
    toast.success(`Background changed to ${gradientType}!`);
    setAppliedChanges(prev => [...prev, `Changed background to ${gradientType} theme`]);
  };

  const generateResponse = async (userMessage: string): Promise<{ content: string; suggestions: EditSuggestion[] }> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const suggestions: EditSuggestion[] = [];
    const lowerMessage = userMessage.toLowerCase();

    // Generate executable suggestions based on user input
    if (lowerMessage.includes("color") || lowerMessage.includes("theme")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "style",
        title: "Blue & Purple Theme",
        description: "Apply a modern blue and purple color scheme",
        executable: true,
        action: () => applyColorScheme("210 100% 60%", "280 100% 70%"),
        difficulty: "easy"
      });
      suggestions.push({
        id: Math.random().toString(),
        type: "style", 
        title: "Green & Teal Theme",
        description: "Apply a fresh green and teal color scheme",
        executable: true,
        action: () => applyColorScheme("150 100% 40%", "180 100% 50%"),
        difficulty: "easy"
      });
    }

    if (lowerMessage.includes("animation") || lowerMessage.includes("float")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "style",
        title: "Add Floating Animation",
        description: "Make buttons float with smooth animations",
        executable: true,
        action: addFloatingAnimation,
        difficulty: "medium"
      });
    }

    if (lowerMessage.includes("glow") || lowerMessage.includes("effect")) {
      suggestions.push({
        id: Math.random().toString(),
        type: "style",
        title: "Add Glow Effects",
        description: "Add beautiful glow effects to cards",
        executable: true,
        action: addGlowEffect,
        difficulty: "medium"
      });
    }

    if (lowerMessage.includes("background") || lowerMessage.includes("gradient")) {
      ['sunset', 'ocean', 'forest', 'space'].forEach(theme => {
        suggestions.push({
          id: Math.random().toString(),
          type: "style",
          title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Background`,
          description: `Apply a beautiful ${theme} gradient background`,
          executable: true,
          action: () => changeBackground(theme),
          difficulty: "easy"
        });
      });
    }

    // Auto-execute simple requests
    if (lowerMessage.includes("make it blue")) {
      applyColorScheme("210 100% 60%", "280 100% 70%");
      return {
        content: "✅ Applied blue color scheme instantly! Your page now has a beautiful blue and purple theme.",
        suggestions: []
      };
    }

    if (lowerMessage.includes("add animation")) {
      addFloatingAnimation();
      return {
        content: "✅ Added floating animations instantly! All buttons now have smooth floating effects.",
        suggestions: []
      };
    }

    // Always add at least one executable suggestion
    if (suggestions.length === 0) {
      suggestions.push({
        id: Math.random().toString(),
        type: "functionality",
        title: "Add Glow Effects",
        description: "Enhance the UI with glowing elements",
        executable: true,
        action: addGlowEffect,
        difficulty: "medium"
      });
    }

    const responses = [
      `I can apply these changes instantly to your webpage:`,
      `Here are the modifications I can make right now:`,
      `Choose any of these changes to apply immediately:`,
      `These updates are ready to be applied to your page:`,
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
            <Badge variant="secondary" className="text-sm">
              Changes Applied: {appliedChanges.length}
            </Badge>
          </div>
          {appliedChanges.length > 0 && (
            <div className="mt-4 p-3 bg-primary-foreground/10 rounded-lg">
              <p className="text-sm text-primary-foreground/80 mb-2">Recent Changes:</p>
              <div className="text-xs space-y-1">
                {appliedChanges.slice(-3).map((change, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                        <CardContent className="pt-0">
                          <div className="flex gap-2">
                            {suggestion.executable && suggestion.action && (
                              <Button
                                size="sm"
                                className="bg-gradient-primary hover:opacity-90"
                                onClick={suggestion.action}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Apply Now
                              </Button>
                            )}
                            {suggestion.code && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyCode(suggestion.code!)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy Code
                              </Button>
                            )}
                          </div>
                          {suggestion.code && (
                            <div className="mt-3">
                              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                <code>{suggestion.code}</code>
                              </pre>
                            </div>
                          )}
                        </CardContent>
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
              { label: "Make it Blue", action: "make it blue" },
              { label: "Add Floating", action: "add animation" },
              { label: "Ocean Theme", action: "change background to ocean" },
              { label: "Add Glow", action: "add glow effects" },
              { label: "Purple Theme", action: "change colors to purple" },
              { label: "Sunset BG", action: "change background to sunset" },
              { label: "Forest Theme", action: "change background to forest" },
              { label: "Space Theme", action: "change background to space" },
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