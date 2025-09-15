import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Loader2, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";
import { generateDrawingPrompt, generateThematicPrompt } from "@/services/aiPromptService";

export const AIPromptGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("random");

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const generatedPrompt = selectedTheme === "random" 
        ? await generateDrawingPrompt()
        : await generateThematicPrompt(selectedTheme);
      
      setPrompt(generatedPrompt);
      toast.success("Creative prompt generated!");
    } catch (error) {
      console.error('Prompt generation error:', error);
      toast.error("Failed to generate prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-primary" />
          Creative Prompt Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="theme-select" className="text-sm font-medium text-muted-foreground">
            Choose a theme
          </label>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger id="theme-select">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random (Stories & Ideas)</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="scifi">Sci-Fi</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Prompt
            </>
          )}
        </Button>

        {prompt && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed flex-1">{prompt}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Get inspired with creative drawing ideas and stories
        </p>
      </CardContent>
    </Card>
  );
};