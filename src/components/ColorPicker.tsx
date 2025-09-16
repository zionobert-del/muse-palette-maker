import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  // Grays & Blacks
  "#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777",
  "#888888", "#999999", "#aaaaaa", "#bbbbbb", "#cccccc", "#dddddd", "#eeeeee", "#ffffff",
  
  // Dark Reds
  "#330000", "#660000", "#990000", "#cc0000", "#ff0000", "#8b0000", "#a0142f", "#b22222",
  "#dc143c", "#f08080", "#cd5c5c", "#ff6b6b", "#ff8a80", "#ffcdd2", "#ffebee", "#fce4ec",
  
  // Bright Reds
  "#ff1744", "#f50057", "#e91e63", "#ad1457", "#880e4f", "#c2185b", "#e8396b", "#ff5722",
  "#d32f2f", "#f44336", "#ef5350", "#e57373", "#ef9a9a", "#ffcccb", "#ffa0a0", "#ff7f7f",
  
  // Oranges & Corals
  "#ff3d00", "#ff4500", "#ff5722", "#ff6600", "#ff7043", "#ff8500", "#ff9800", "#ffa500",
  "#ffab40", "#ffb347", "#ffc107", "#ffcc02", "#ffd54f", "#ffe082", "#fff176", "#fff59d",
  
  // Yellows & Golds
  "#ff6f00", "#ff8f00", "#ffa000", "#ffb300", "#ffc107", "#ffd600", "#ffea00", "#ffff00",
  "#ffff33", "#ffff66", "#ffff99", "#ffffcc", "#f4f4a1", "#fff9c4", "#fffde7", "#fffef7",
  
  // Light Greens
  "#f1f8e9", "#e8f5e8", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047",
  "#388e3c", "#2e7d32", "#1b5e20", "#00c853", "#69f0ae", "#b9f6ca", "#ccffcc", "#e0ffe0",
  
  // Dark Greens
  "#1b5e20", "#2e7d32", "#388e3c", "#43a047", "#4caf50", "#66bb6a", "#81c784", "#a5d6a7",
  "#006400", "#228b22", "#32cd32", "#00ff00", "#7fff00", "#9aff9a", "#98fb98", "#f0fff0",
  
  // Teals & Cyans
  "#00695c", "#00796b", "#00897b", "#009688", "#26a69a", "#4db6ac", "#80cbc4", "#b2dfdb",
  "#00ffff", "#00e5ff", "#00bcd4", "#0097a7", "#006064", "#40e0d0", "#20b2aa", "#008b8b",
  
  // Light Blues
  "#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2",
  "#1565c0", "#0d47a1", "#82b1ff", "#448aff", "#2979ff", "#2962ff", "#87ceeb", "#add8e6",
  
  // Dark Blues
  "#0d47a1", "#1565c0", "#1976d2", "#1e88e5", "#2196f3", "#42a5f5", "#64b5f6", "#90caf9",
  "#000080", "#0000cd", "#0000ff", "#4169e1", "#6495ed", "#4682b4", "#5f9ea0", "#6a5acd",
  
  // Purples & Violets
  "#4a148c", "#6a1b9a", "#7b1fa2", "#8e24aa", "#9c27b0", "#ab47bc", "#ba68c8", "#ce93d8",
  "#4b0082", "#663399", "#8a2be2", "#9400d3", "#9932cc", "#dda0dd", "#e6e6fa", "#f8f8ff",
  
  // Magentas & Pinks
  "#880e4f", "#ad1457", "#c2185b", "#d81b60", "#e91e63", "#ec407a", "#f06292", "#f48fb1",
  "#ff1493", "#ff69b4", "#ffb6c1", "#ffc0cb", "#ffd0dc", "#ffe4e1", "#fff0f5", "#fffafa",
  
  // Browns & Tans
  "#3e2723", "#4e342e", "#5d4037", "#6d4c41", "#795548", "#8d6e63", "#a1887f", "#bcaaa4",
  "#654321", "#8b4513", "#a0522d", "#cd853f", "#daa520", "#f4a460", "#deb887", "#f5deb3",
  
  // Exotic Colors
  "#ff4081", "#e040fb", "#7c4dff", "#536dfe", "#40c4ff", "#18ffff", "#64ffda", "#69f0ae",
  "#b2ff59", "#eeff41", "#ffff00", "#ffd740", "#ffab40", "#ff6e40", "#ff5252", "#ff1744",
  
  // Pastels
  "#f8bbd9", "#f5b7b1", "#fadbd8", "#fdeaa7", "#f9e79f", "#aed6f1", "#a9dfbf", "#d5a6bd",
  "#e8daef", "#d6eaf8", "#d1f2eb", "#fcf3cf", "#fdebd0", "#fadbd8", "#ebdef0", "#d5dbdb",
  
  // Neon Colors
  "#ff073a", "#ff0080", "#ff00ff", "#8000ff", "#0080ff", "#00ffff", "#00ff80", "#80ff00",
  "#ffff00", "#ff8000", "#ff4000", "#ff0040", "#40ff00", "#00ff40", "#0040ff", "#4000ff",
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-12 h-12 p-1 rounded-lg border-2 hover:scale-105 transition-all duration-200"
        >
          <div 
            className="w-full h-full rounded-md border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-10 border-0 p-0 rounded-md"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          
          <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className={`w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 ${
                  color === presetColor ? 'border-primary shadow-glow' : 'border-muted'
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};