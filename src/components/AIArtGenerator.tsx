import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateAIArt } from "@/services/aiArtService";

interface AIArtGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

export const AIArtGenerator = ({ onImageGenerated }: AIArtGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate art");
      return;
    }

    setIsGenerating(true);
    
    try {
      const imageUrl = await generateAIArt(prompt);
      onImageGenerated(imageUrl);
      
      toast.success("AI art generated successfully!");
      setPrompt("");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate AI art. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Art Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="ai-prompt" className="text-sm font-medium text-muted-foreground">
            Describe your artwork
          </label>
          <Textarea
            id="ai-prompt"
            placeholder="A beautiful landscape with mountains and a lake at sunset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={isGenerating}
          />
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Art
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Generated artwork will be added to your canvas
        </p>
      </CardContent>
    </Card>
  );
};