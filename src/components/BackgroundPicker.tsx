
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Sun, Moon, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundPickerProps {
  backgroundColor: string;
  onBackgroundChange: (color: string) => void;
}

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ 
  backgroundColor, 
  onBackgroundChange 
}) => {
  const [hexValue, setHexValue] = useState(backgroundColor);
  const { toast } = useToast();
  
  const presetColors = [
    '#FFFFFF', '#000000', '#F5F5F5', '#222222', 
    '#F0F0F0', '#333333', '#E0E0E0', '#444444'
  ];
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);
    
    // Only update if valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      onBackgroundChange(value);
    }
  };
  
  const handleTabChange = (value: string) => {
    // Set background based on tab
    if (value === 'light') {
      onBackgroundChange('#FFFFFF');
      setHexValue('#FFFFFF');
    } else if (value === 'dark') {
      onBackgroundChange('#000000');
      setHexValue('#000000');
    }
  };
  
  const copyHexToClipboard = () => {
    navigator.clipboard.writeText(hexValue);
    toast({
      title: "Copied!",
      description: `Color code ${hexValue} copied to clipboard`,
      duration: 2000,
    });
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Background</h3>
            
            <Tabs 
              defaultValue="custom" 
              onValueChange={handleTabChange}
              className="w-[260px]"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="light" className="flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Light</span>
                </TabsTrigger>
                <TabsTrigger value="dark" className="flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Dark</span>
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Custom</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="hex-color">Hex Color</Label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: hexValue }}
              />
              <div className="flex-1 relative">
                <Input
                  id="hex-color"
                  value={hexValue}
                  onChange={handleHexChange}
                  placeholder="#000000"
                  className="pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={copyHexToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Preset Colors</Label>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`
                    w-6 h-6 rounded-md border border-border transition-all hover:scale-110
                    ${color === hexValue ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setHexValue(color);
                    onBackgroundChange(color);
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundPicker;
