import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Palette, Square, Circle as CircleIcon, Brush, Eraser } from "lucide-react";

interface ArtCanvasProps {
  activeColor: string;
  activeTool: "select" | "draw" | "rectangle" | "circle";
  onToolChange: (tool: "select" | "draw" | "rectangle" | "circle") => void;
}

export const ArtCanvas = ({ activeColor, activeTool, onToolChange }: ArtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush right after canvas creation
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 3;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 3;
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    onToolChange(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 80,
        rx: 8,
        ry: 8,
      });
      fabricCanvas?.add(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas?.add(circle);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-lg">
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("select")}
          className="transition-all duration-200"
        >
          <Palette className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("draw")}
          className="transition-all duration-200"
        >
          <Brush className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === "rectangle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("rectangle")}
          className="transition-all duration-200"
        >
          <Square className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === "circle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("circle")}
          className="transition-all duration-200"
        >
          <CircleIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />
        
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          className="transition-all duration-200"
        >
          <Eraser className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-xl border-2 border-border shadow-creative bg-white">
        <canvas 
          ref={canvasRef} 
          className="max-w-full block"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
        />
      </div>
    </div>
  );
};