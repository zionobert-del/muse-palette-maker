import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  // Basic colors
  "#000000", "#333333", "#666666", "#999999", "#cccccc", "#ffffff",
  
  // Reds
  "#8b0000", "#b22222", "#dc143c", "#ff0000", "#ff6347", "#ff7f7f", "#ffa0a0", "#ffc0cb",
  
  // Oranges
  "#ff4500", "#ff6600", "#ff8500", "#ffa500", "#ffb347", "#ffd700", "#ffe135", "#fff8dc",
  
  // Yellows
  "#ffff00", "#ffff66", "#ffff99", "#ffffcc", "#f0e68c", "#bdb76b", "#daa520", "#b8860b",
  
  // Greens
  "#006400", "#228b22", "#32cd32", "#00ff00", "#7fff00", "#9aff9a", "#98fb98", "#f0fff0",
  "#00ff7f", "#00fa9a", "#40e0d0", "#20b2aa", "#008b8b", "#5f9ea0", "#4682b4", "#87ceeb",
  
  // Blues
  "#000080", "#0000cd", "#0000ff", "#4169e1", "#6495ed", "#87cefa", "#add8e6", "#e0f6ff",
  "#00bfff", "#1e90ff", "#6a5acd", "#7b68ee", "#9370db", "#ba55d3", "#da70d6", "#ee82ee",
  
  // Purples
  "#4b0082", "#663399", "#8a2be2", "#9400d3", "#9932cc", "#dda0dd", "#e6e6fa", "#f8f8ff",
  
  // Pinks
  "#ff1493", "#ff69b4", "#ffb6c1", "#ffc0cb", "#ffd0dc", "#ffe4e1", "#fff0f5", "#fffafa",
  
  // Browns
  "#654321", "#8b4513", "#a0522d", "#cd853f", "#daa520", "#f4a460", "#deb887", "#f5deb3",
  
  // Special colors
  "#ff00ff", "#00ffff", "#ff8000", "#8000ff", "#ff0080", "#80ff00", "#0080ff", "#ff4040",
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