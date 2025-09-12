import { useEffect, useRef, useState } from "react"; # dirffrnt brush strokes
import { Canvas as FabricCanvas, Circle, Rect, Line, IText } from "fabric";
import { Button } from "@/components/ui/button"; # mad it accessable for all devices
import { Palette, Square, Circle as CircleIcon, Brush, Eraser, Type, Minus, Undo, Redo, ZoomIn, ZoomOut, Grid, MoreHorizontal } from "lucide-react"; # add more features to draw on
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArtCanvasProps {
  activeColor: string;
  activeTool: "select" | "draw" | "rectangle" | "circle" | "line" | "text" | "eraser";
  brushSize: number;
  activePattern: "none" | "grid" | "dots" | "lines";
  onToolChange: (tool: "select" | "draw" | "rectangle" | "circle" | "line" | "text" | "eraser") => void;
  onBrushSizeChange: (size: number) => void;
  onPatternChange: (pattern: "none" | "grid" | "dots" | "lines") => void;
}

export const ArtCanvas = ({ activeColor, activeTool, brushSize, activePattern, onToolChange, onBrushSizeChange, onPatternChange }: ArtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<{ x: number; y: number } | null>(null);

  const applyPattern = (canvas: FabricCanvas, pattern: string) => {
    const ctx = canvas.getContext();
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Clear any existing pattern
    canvas.backgroundColor = "#ffffff";
    
    if (pattern === "grid") {
      const gridSize = 20;
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 0.5;
      
      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (pattern === "dots") {
      const dotSpacing = 20;
      ctx.fillStyle = "#d1d5db";
      
      for (let x = dotSpacing; x < width; x += dotSpacing) {
        for (let y = dotSpacing; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    } else if (pattern === "lines") {
      const lineSpacing = 25;
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 0.5;
      
      // Horizontal lines only
      for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    canvas.renderAll();
  };

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
      canvas.freeDrawingBrush.width = brushSize;
    }

    // Apply initial pattern
    applyPattern(canvas, activePattern);

    // Set up line drawing listeners
    canvas.on('mouse:down', (options) => {
      if (activeTool === 'line' && options.e) {
        setIsDrawingLine(true);
        const pointer = canvas.getPointer(options.e);
        setLineStartPoint({ x: pointer.x, y: pointer.y });
      }
    });

    canvas.on('mouse:up', (options) => {
      if (activeTool === 'line' && isDrawingLine && lineStartPoint && options.e) {
        const pointer = canvas.getPointer(options.e);
        const line = new Line([lineStartPoint.x, lineStartPoint.y, pointer.x, pointer.y], {
          stroke: activeColor,
          strokeWidth: brushSize,
          selectable: true,
        });
        canvas.add(line);
        setIsDrawingLine(false);
        setLineStartPoint(null);
      }
    });

    // Set up text tool double-click
    canvas.on('mouse:dblclick', (options) => {
      if (activeTool === 'text' && options.e) {
        const pointer = canvas.getPointer(options.e);
        const text = new IText('Click to edit', {
          left: pointer.x,
          top: pointer.y,
          fill: activeColor,
          fontSize: Math.max(brushSize * 3, 16),
          selectable: true,
          editable: true,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
      }
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw" || activeTool === "eraser";
    
    if ((activeTool === "draw" || activeTool === "eraser") && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeTool === "eraser" ? "#ffffff" : activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;
    applyPattern(fabricCanvas, activePattern);
  }, [activePattern, fabricCanvas]);

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

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleRedo = () => {
    // Note: A full undo/redo system would require maintaining a history stack
    // This is a simplified version for demonstration
    console.log("Redo functionality would be implemented with a proper history system");
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.max(zoom / 1.2, 0.3));
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-lg flex-wrap">
        <div className="flex items-center gap-2">
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
            variant={activeTool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => handleToolClick("eraser")}
            className="transition-all duration-200"
          >
            <Eraser className="w-4 h-4" />
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

          <Button
            variant={activeTool === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => handleToolClick("line")}
            className="transition-all duration-200"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <Button
            variant={activeTool === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => handleToolClick("text")}
            className="transition-all duration-200"
          >
            <Type className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Pattern Control */}
        <div className="flex items-center gap-3 min-w-32">
          <span className="text-sm text-muted-foreground">Pattern:</span>
          <Select value={activePattern} onValueChange={onPatternChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="lines">Lines</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Brush Size Control */}
        <div className="flex items-center gap-3 min-w-32">
          <span className="text-sm text-muted-foreground">Size:</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            max={50}
            min={1}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono w-6 text-center">{brushSize}</span>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            className="transition-all duration-200"
          >
            <Undo className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            className="transition-all duration-200"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="transition-all duration-200"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="transition-all duration-200"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="transition-all duration-200"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Tool Instructions */}
      {activeTool === "line" && (
        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
          <p className="text-sm text-accent-foreground">
            <strong>Line Tool:</strong> Click and drag to draw straight lines
          </p>
        </div>
      )}

      {activeTool === "text" && (
        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
          <p className="text-sm text-accent-foreground">
            <strong>Text Tool:</strong> Double-click anywhere on the canvas to add text
          </p>
        </div>
      )}

      {activeTool === "eraser" && (
        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
          <p className="text-sm text-accent-foreground">
            <strong>Eraser Tool:</strong> Draw to erase parts of your artwork
          </p>
        </div>
      )}

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
