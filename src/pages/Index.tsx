import { useState } from "react";
import { ArtCanvas } from "@/components/ArtCanvas";
import { ColorPicker } from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "line" | "text" | "eraser">("draw");
  const [brushSize, setBrushSize] = useState(5);
  const [activePattern, setActivePattern] = useState<"none" | "grid" | "dots" | "lines">("none");

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

  return (
    <div className="min-h-screen bg-gradient-canvas p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift bg-300% bg-gradient-to-r">
            ArtStudio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unleash your creativity with our intuitive digital art platform. 
            Create, design, and bring your imagination to life.
          </p>
        </div>

        {/* Main Art Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-xl border shadow-creative">
              <h3 className="font-semibold mb-4 text-card-foreground">Color Palette</h3>
              <div className="flex flex-col items-center gap-4">
                <ColorPicker color={activeColor} onChange={setActiveColor} />
                <div className="text-sm text-muted-foreground text-center">
                  Current: {activeColor}
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-creative">
              <h3 className="font-semibold mb-4 text-card-foreground">Brush Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Brush Size: {brushSize}px</label>
                  <div className="w-8 h-8 rounded-full border-2 border-primary mx-auto mb-3" 
                       style={{ 
                         width: `${Math.max(brushSize, 8)}px`, 
                         height: `${Math.max(brushSize, 8)}px`,
                         backgroundColor: activeColor 
                       }} />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-creative"
                 style={{ backgroundColor: activeColor }}
            >
              <h3 className="font-semibold mb-4" style={{ color: activeColor === '#000000' ? '#ffffff' : '#000000' }}>
                Current Tool
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold capitalize" 
                     style={{ color: activeColor === '#000000' ? '#ffffff' : '#000000' }}>
                  {activeTool}
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-creative">
              <h3 className="font-semibold mb-4 text-card-foreground">Background Pattern</h3>
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

            <div className="bg-card p-6 rounded-xl border shadow-creative">
              <h3 className="font-semibold mb-4 text-card-foreground">Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleSave}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Artwork
                </Button>
                <Button 
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Image
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <ArtCanvas 
              activeColor={activeColor}
              activeTool={activeTool}
              brushSize={brushSize}
              activePattern={activePattern}
              onToolChange={setActiveTool}
              onBrushSizeChange={setBrushSize}
              onPatternChange={setActivePattern}
            />
          </div>
        </div>

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