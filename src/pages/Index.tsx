import { useState } from "react";
import { ArtCanvas } from "@/components/ArtCanvas";
import { ColorPicker } from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("draw");

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
              onToolChange={setActiveTool}
            />
          </div>
        </div>

        {/* Creative Tips */}
        <div className="bg-card p-6 rounded-xl border shadow-creative">
          <h3 className="font-semibold mb-3 text-card-foreground">Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow"></div>
              Use the brush tool for freehand drawing
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-glow"></div>
              Add shapes with rectangle and circle tools
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-glow"></div>
              Click colors to change your brush color
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;