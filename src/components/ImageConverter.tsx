
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { convertToCustomColor } from '@/lib/imageUtils';

interface ImageConverterProps {
  originalImage: string | null;
  logoColor: string;
  onLogoColorChange: (color: string) => void;
  onConvertedImage: (dataUrl: string) => void;
}

const ImageConverter: React.FC<ImageConverterProps> = ({ 
  originalImage, 
  logoColor,
  onLogoColorChange,
  onConvertedImage
}) => {
  const [hexValue, setHexValue] = useState(logoColor);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);
    
    // Only update if valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      onLogoColorChange(value);
      
      if (originalImage) {
        // Create image element
        const img = new Image();
        img.onload = async () => {
          const customColorImage = await convertToCustomColor(img, value);
          onConvertedImage(customColorImage);
        };
        img.src = originalImage;
      }
    }
  };
  
  // Preset colors for logo
  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
    '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
  ];
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Logo Color</h3>
              <p className="text-sm text-muted-foreground">Customize the color of your logo</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="logo-color">Color</Label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: hexValue }}
              />
              <div className="flex-1">
                <Input
                  id="logo-color"
                  type="text"
                  value={hexValue}
                  onChange={handleColorChange}
                  placeholder="#000000"
                  className="w-full"
                  disabled={!originalImage}
                />
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
                    onLogoColorChange(color);
                    
                    if (originalImage) {
                      const img = new Image();
                      img.onload = async () => {
                        const customColorImage = await convertToCustomColor(img, color);
                        onConvertedImage(customColorImage);
                      };
                      img.src = originalImage;
                    }
                  }}
                  disabled={!originalImage}
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

export default ImageConverter;
