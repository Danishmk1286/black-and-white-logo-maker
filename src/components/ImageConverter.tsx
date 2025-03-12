
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { convertToBlackAndWhite } from '@/lib/imageUtils';

interface ImageConverterProps {
  originalImage: string;
  isBlackAndWhite: boolean;
  onToggleBlackAndWhite: (value: boolean) => void;
  onConvertedImage: (dataUrl: string) => void;
}

const ImageConverter: React.FC<ImageConverterProps> = ({ 
  originalImage, 
  isBlackAndWhite, 
  onToggleBlackAndWhite,
  onConvertedImage
}) => {
  
  const handleToggleChange = async (checked: boolean) => {
    onToggleBlackAndWhite(checked);
    
    if (checked && originalImage) {
      // Create image element
      const img = new Image();
      img.onload = async () => {
        const bwImage = await convertToBlackAndWhite(img);
        onConvertedImage(bwImage);
      };
      img.src = originalImage;
    }
  };
  
  return (
    <Card className="panel w-full animate-scale-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Black & White Conversion</h3>
            <p className="text-sm text-muted-foreground">Convert your logo to black and white</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="bw-mode" className="cursor-pointer">
              {isBlackAndWhite ? 'Black & White' : 'Original'}
            </Label>
            <Switch
              id="bw-mode"
              checked={isBlackAndWhite}
              onCheckedChange={handleToggleChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageConverter;
