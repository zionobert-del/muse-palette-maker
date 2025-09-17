import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bug, Zap, CheckCircle, AlertTriangle, Code, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface DebugSuggestion {
  type: "error" | "warning" | "suggestion";
  title: string;
  description: string;
  code?: string;
  fix?: string;
}

export const DebugAI = () => {
  const [problemDescription, setProblemDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<DebugSuggestion[]>([]);

  const analyzeDrawingIssue = () => {
    // Simulate AI analysis of the current drawing issue
    const drawingAnalysis: DebugSuggestion[] = [
      {
        type: "error",
        title: "Fabric.js Drawing Mode Not Activating",
        description: "The drawing functionality isn't working because the canvas drawing mode isn't properly initialized.",
        code: `// Current issue in ArtCanvas.tsx
if (canvas.freeDrawingBrush) {
  canvas.freeDrawingBrush.color = activeColor;
  canvas.freeDrawingBrush.width = brushSize;
}`,
        fix: `// Try this fix:
// Ensure drawing mode is set AFTER brush configuration
canvas.isDrawingMode = true;
if (canvas.freeDrawingBrush) {
  canvas.freeDrawingBrush.color = activeColor;
  canvas.freeDrawingBrush.width = brushSize;
} else {
  // Force initialize brush if not available
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = activeColor;
  canvas.freeDrawingBrush.width = brushSize;
}`
      },
      {
        type: "warning",
        title: "Canvas Event Conflicts",
        description: "Multiple mouse event handlers might be interfering with drawing mode.",
        fix: "Remove or disable other mouse event listeners when in drawing mode."
      },
      {
        type: "suggestion",
        title: "Add Drawing Mode Validation",
        description: "Add validation to ensure drawing mode is properly set before user interaction.",
        code: `// Add this validation:
const validateDrawingMode = () => {
  if (activeTool === 'draw' && !fabricCanvas?.isDrawingMode) {
    console.warn('Drawing tool selected but canvas not in drawing mode');
    fabricCanvas.isDrawingMode = true;
  }
};`
      }
    ];

    setSuggestions(drawingAnalysis);
    toast.success("Drawing issue analyzed! Check the suggestions below.");
  };

  const analyzeCustomProblem = async () => {
    if (!problemDescription.trim()) {
      toast.error("Please describe the problem you're experiencing.");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const generalAnalysis: DebugSuggestion[] = [
        {
          type: "suggestion",
          title: "Common Debugging Steps",
          description: "Here are some general debugging approaches for your issue:",
          fix: `1. Check console for errors
2. Verify component state updates
3. Ensure event handlers are properly bound
4. Check for TypeScript type mismatches
5. Validate prop passing between components`
        },
        {
          type: "warning",
          title: "State Management",
          description: "Consider if the issue is related to state not updating correctly.",
          fix: "Use React DevTools to inspect component state and props in real-time."
        },
        {
          type: "suggestion",
          title: "Add Debug Logging",
          description: "Add console.log statements to trace the execution flow.",
          code: `// Add debugging logs:
console.log('Component rendered with props:', props);
console.log('State updated:', { oldState, newState });
console.log('Event triggered:', event);`
        }
      ];

      setSuggestions(generalAnalysis);
      setIsAnalyzing(false);
      toast.success("Problem analyzed! Check the suggestions below.");
    }, 2000);
  };

  const applySuggestion = (suggestion: DebugSuggestion) => {
    if (suggestion.fix) {
      navigator.clipboard.writeText(suggestion.fix);
      toast.success("Fix copied to clipboard!");
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "suggestion": return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center">
          <Bug className="w-5 h-5 text-primary" />
          Debug AI Assistant
          <Zap className="w-5 h-5 text-yellow-500" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered debugging to analyze and fix your code issues
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Fix for Drawing Issue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Fixes</h3>
          <Button 
            onClick={analyzeDrawingIssue}
            className="w-full"
            variant="outline"
          >
            <Code className="w-4 h-4 mr-2" />
            Analyze Drawing Tool Issue
          </Button>
        </div>

        <Separator />

        {/* Custom Problem Analysis */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Describe Your Problem</h3>
          <Textarea
            placeholder="Describe the issue you're experiencing... (e.g., 'Button not responding to clicks', 'Component not rendering', 'State not updating')"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={analyzeCustomProblem}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze Problem
              </>
            )}
          </Button>
        </div>

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Suggestions</h3>
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge variant={suggestion.type === "error" ? "destructive" : "secondary"}>
                            {suggestion.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                        
                        {suggestion.code && (
                          <div className="bg-muted p-3 rounded-md">
                            <code className="text-xs font-mono whitespace-pre-wrap">
                              {suggestion.code}
                            </code>
                          </div>
                        )}
                        
                        {suggestion.fix && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600">Suggested Fix:</p>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                              <code className="text-xs font-mono whitespace-pre-wrap text-green-800">
                                {suggestion.fix}
                              </code>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => applySuggestion(suggestion)}
                            >
                              Copy Fix
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};