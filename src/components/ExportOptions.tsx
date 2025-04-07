
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Download, FileImage, FileCode, FileText } from 'lucide-react';
import { 
  convertToSVG, 
  downloadFile,
  exportAsImage
} from '@/lib/imageUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExportOptionsProps {
  originalImageUrl: string;
  whiteBackgroundColor: string;
  blackBackgroundColor: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  originalImageUrl,
  whiteBackgroundColor,
  blackBackgroundColor
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [includeBackground, setIncludeBackground] = useState(true);
  const [format, setFormat] = useState<'svg' | 'png' | 'jpg' | 'pdf'>('svg');
  const [logoVariant, setLogoVariant] = useState<'black' | 'white'>('black');
  
  const handleExport = async () => {
    try {
      if (!originalImageUrl) {
        toast({
          title: "No image",
          description: "Please upload an image first.",
          variant: "destructive",
        });
        return;
      }
      
      // Create a temporary image to apply filters
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          toast({
            title: "Export failed",
            description: "Could not create canvas context.",
            variant: "destructive",
          });
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply background if needed
        if (includeBackground) {
          ctx.fillStyle = logoVariant === 'black' ? whiteBackgroundColor : blackBackgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw the image with appropriate filter
        if (logoVariant === 'black') {
          // For black logo variant
          ctx.filter = 'brightness(0) saturate(100%)';
        } else {
          // For white logo variant
          ctx.filter = 'brightness(0) saturate(100%) invert(1)';
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Reset filter after drawing
        ctx.filter = 'none';
        
        const processedImageUrl = canvas.toDataURL();
        const filename = `logo_${logoVariant}_${includeBackground ? 'with_bg' : 'no_bg'}.${format}`;
        
        if (format === 'svg') {
          const svgUrl = await convertToSVG(
            processedImageUrl, 
            includeBackground ? (logoVariant === 'black' ? whiteBackgroundColor : blackBackgroundColor) : undefined
          );
          
          downloadFile(svgUrl, filename);
        } else {
          const backgroundColor = includeBackground 
            ? (logoVariant === 'black' ? whiteBackgroundColor : blackBackgroundColor) 
            : 'transparent';
            
          const exportedImage = await exportAsImage(
            processedImageUrl,
            format,
            backgroundColor
          );
          
          downloadFile(exportedImage, filename);
        }
        
        toast({
          title: "Success!",
          description: `${logoVariant.toUpperCase()} logo exported as ${format.toUpperCase()} successfully`,
        });
      };
      
      img.src = originalImageUrl;
    } catch (error) {
      console.error('Error exporting image:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your image.",
        variant: "destructive",
      });
    }
  };
  
  const formatIcons = {
    svg: <FileCode className="h-4 w-4" />,
    png: <FileImage className="h-4 w-4" />,
    jpg: <FileImage className="h-4 w-4" />,
    pdf: <FileText className="h-4 w-4" />
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-medium text-center">Export Options</h3>
          
          {/* Format Selection */}
          <div className="w-full">
            <ToggleGroup 
              type="single" 
              value={format} 
              onValueChange={(value) => value && setFormat(value as any)}
              className="w-full grid grid-cols-4 gap-1"
            >
              <ToggleGroupItem value="svg" aria-label="SVG Format" className="flex flex-col items-center gap-1 py-2 px-1 sm:px-2 h-auto">
                <FileCode className="h-4 w-4" />
                <span className="text-xs sm:text-sm">SVG</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="png" aria-label="PNG Format" className="flex flex-col items-center gap-1 py-2 px-1 sm:px-2 h-auto">
                <FileImage className="h-4 w-4" />
                <span className="text-xs sm:text-sm">PNG</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="jpg" aria-label="JPG Format" className="flex flex-col items-center gap-1 py-2 px-1 sm:px-2 h-auto">
                <FileImage className="h-4 w-4" />
                <span className="text-xs sm:text-sm">JPG</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="pdf" aria-label="PDF Format" className="flex flex-col items-center gap-1 py-2 px-1 sm:px-2 h-auto">
                <FileText className="h-4 w-4" />
                <span className="text-xs sm:text-sm">PDF</span>
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="pt-4 sm:pt-6 space-y-4">
              {/* Background Option */}
              <div className="p-3 sm:p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="include-bg" 
                    className="h-5 w-5 mt-0.5"
                    checked={includeBackground}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setIncludeBackground(checked);
                      }
                    }}
                  />
                  <div>
                    <Label htmlFor="include-bg" className="text-sm sm:text-base font-medium cursor-pointer">
                      Include background in export
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {includeBackground 
                        ? "Background will be included in the exported file." 
                        : "Logo will be exported with a transparent background."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Logo Variant Selection */}
              <div className="space-y-2">
                <Label htmlFor="logo-variant" className="text-sm sm:text-base block">Logo Variant</Label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    id="black-variant"
                    variant={logoVariant === 'black' ? 'default' : 'outline'}
                    className="flex-1 py-2 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm h-auto"
                    onClick={() => setLogoVariant('black')}
                  >
                    <div className="flex flex-col items-center w-full">
                      <span className="font-medium">Black Logo</span>
                      {includeBackground && <span className="text-2xs sm:text-xs mt-1 opacity-80 truncate">({whiteBackgroundColor} background)</span>}
                    </div>
                  </Button>
                  <Button
                    id="white-variant"
                    variant={logoVariant === 'white' ? 'default' : 'outline'}
                    className="flex-1 py-2 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm h-auto"
                    onClick={() => setLogoVariant('white')}
                  >
                    <div className="flex flex-col items-center w-full">
                      <span className="font-medium">White Logo</span>
                      {includeBackground && <span className="text-2xs sm:text-xs mt-1 opacity-80 truncate">({blackBackgroundColor} background)</span>}
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Download Button */}
              <Button
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-5 text-base sm:text-lg h-auto"
                onClick={handleExport}
                disabled={!originalImageUrl}
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Download as {format.toUpperCase()}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
