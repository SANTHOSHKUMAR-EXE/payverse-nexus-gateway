
import React from "react";
import { Button } from "@/components/ui/button";
import { Computer, Smartphone } from "lucide-react";

interface ModeSelectorProps {
  onSelectMode: (mode: "desktop" | "mobile") => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 border">
        <h2 className="text-2xl font-bold text-center mb-8">
          Select Display Mode
        </h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            onClick={() => onSelectMode("desktop")}
            className="flex flex-col items-center justify-center py-8 px-4"
            variant="outline"
            size="lg"
          >
            <Computer className="h-12 w-12 mb-3" />
            <span className="text-lg font-medium">Desktop</span>
          </Button>
          
          <Button
            onClick={() => onSelectMode("mobile")}
            className="flex flex-col items-center justify-center py-8 px-4"
            variant="outline"
            size="lg"
          >
            <Smartphone className="h-12 w-12 mb-3" />
            <span className="text-lg font-medium">Mobile</span>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm text-center mt-6">
          Choose the mode that best suits your current device
        </p>
      </div>
    </div>
  );
};

export default ModeSelector;
