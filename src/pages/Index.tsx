import { useState, useRef } from "react";
import { ArtCanvas } from "@/components/ArtCanvas";
import { ColorPicker } from "@/components/ColorPicker";
import { AIArtGenerator } from "@/components/AIArtGenerator";
import { AIPromptGenerator } from "@/components/AIPromptGenerator";
import { DebugAI } from "@/components/DebugAI";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, Sparkles, Bug } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "line" | "text" | "eraser" | "triangle" | "star" | "spray" | "marker" | "highlighter">("draw");
  const [brushSize, setBrushSize] = useState(5);
  const [activePattern, setActivePattern] = useState<"none" | "grid" | "dots" | "lines">("none");
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const addImageToCanvasRef = useRef<((imageUrl: string) => Promise<void>) | null>(null);

  const handleSave = () => {
    toast("Artwork saved to gallery!", {
      description: "Your creative masterpiece has been saved successfully.",
    });
  };

  const handleExport = () => {
    toast("Artwork exported!", {
      description: "Your artwork has been downloaded as an image.",
    });
  };

  const handleImageGenerated = async (imageUrl: string) => {
    if (addImageToCanvasRef.current) {
      await addImageToCanvasRef.current(imageUrl);
      setShowAIGenerator(false);
      toast.success("AI artwork added to canvas!");
    }
  };

  const handleCanvasImageAdder = (addImageFunction: (imageUrl: string) => Promise<void>) => {
    addImageToCanvasRef.current = addImageFunction;
  };

  return (
    <div className="min-h-screen bg-gradient-canvas p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift bg-300% bg-gradient-to-r">
            ArtStudio
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Unleash your creativity with our intuitive digital art platform. 
            Create, design, and bring your imagination to life.
          </p>
        </div>

        {/* Mobile-First Tabs Layout */}
        <Tabs defaultValue="canvas" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="ai-art">AI Art</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-1">
              <Bug className="w-4 h-4" />
              Debug
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas">
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-8">
              
              {/* Canvas Area - First on Mobile */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <ArtCanvas 
                  activeColor={activeColor}
                  activeTool={activeTool}
                  brushSize={brushSize}
                  activePattern={activePattern}
                  onToolChange={setActiveTool}
                  onBrushSizeChange={setBrushSize}
                  onPatternChange={setActivePattern}
                  onRegisterImageAdder={handleCanvasImageAdder}
                />
              </div>

              {/* Side Panel - Below Canvas on Mobile */}
              <div className="lg:col-span-1 order-2 lg:order-1 space-y-4 sm:space-y-6">
                
                {/* Compact Color Panel */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border shadow-creative">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-card-foreground text-sm sm:text-base">Color Palette</h3>
                  <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-4">
                    <ColorPicker color={activeColor} onChange={setActiveColor} />
                    <div className="text-xs sm:text-sm text-muted-foreground text-center">
                      {activeColor}
                    </div>
                  </div>
                </div>

                {/* Mobile: Combined Tool Status */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border shadow-creative">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-card-foreground text-sm sm:text-base">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Tool:</span>
                      <span className="text-sm sm:text-base font-semibold capitalize text-primary">{activeTool}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Size:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold">{brushSize}px</span>
                        <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-primary" 
                             style={{ 
                               width: `${Math.min(Math.max(brushSize / 2, 8), 24)}px`, 
                               height: `${Math.min(Math.max(brushSize / 2, 8), 24)}px`,
                               backgroundColor: activeColor 
                             }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Pattern:</span>
                      <span className="text-sm sm:text-base font-semibold capitalize text-primary">
                        {activePattern === "none" ? "Plain" : activePattern}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions - Horizontal on Mobile */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border shadow-creative">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-card-foreground text-sm sm:text-base">Actions</h3>
                  <div className="flex sm:flex-col gap-2 sm:gap-3">
                    <Button 
                      onClick={handleSave}
                      className="flex-1 sm:w-full bg-gradient-primary hover:opacity-90 transition-opacity text-xs sm:text-sm"
                      size="sm"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Save
                    </Button>
                    <Button 
                      onClick={handleExport}
                      variant="outline"
                      className="flex-1 sm:w-full text-xs sm:text-sm"
                      size="sm"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Desktop Only: Extended Info */}
                <div className="hidden lg:block bg-card p-6 rounded-xl border shadow-creative">
                  <h3 className="font-semibold mb-4 text-card-foreground">Background Info</h3>
                  <div className="text-center">
                    <div className="text-lg font-semibold capitalize text-primary mb-2">
                      {activePattern === "none" ? "Plain Canvas" : activePattern}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activePattern === "grid" && "Perfect for technical drawings"}
                      {activePattern === "dots" && "Great for sketching guides"}  
                      {activePattern === "lines" && "Ideal for writing or lined art"}
                      {activePattern === "none" && "Clean blank canvas"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-art">
            <div className="max-w-4xl mx-auto">
              <AIArtGenerator onImageGenerated={handleImageGenerated} />
            </div>
          </TabsContent>

          <TabsContent value="prompts">
            <div className="max-w-4xl mx-auto">
              <AIPromptGenerator />
            </div>
          </TabsContent>

          <TabsContent value="debug">
            <div className="flex justify-center">
              <DebugAI />
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Creative Tips */}
        <div className="bg-card p-6 rounded-xl border shadow-creative">
          <h3 className="font-semibold mb-4 text-card-foreground">Creative Tools Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow"></div>
              <strong>Brush:</strong> Freehand drawing with adjustable size
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-glow"></div>
              <strong>Shapes:</strong> Perfect circles and rectangles
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-glow"></div>
              <strong>Line:</strong> Click and drag for straight lines
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-glow rounded-full animate-glow"></div>
              <strong>Text:</strong> Double-click canvas to add text
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-glow"></div>
              <strong>Eraser:</strong> Remove parts of your artwork
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-glow"></div>
              <strong>Zoom:</strong> Get closer to your work for details
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ring rounded-full animate-glow"></div>
              <strong>Undo:</strong> Remove the last element added
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-border rounded-full animate-glow"></div>
              <strong>Size:</strong> Adjust brush thickness (1-50px)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;