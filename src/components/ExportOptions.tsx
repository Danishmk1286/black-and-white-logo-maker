
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileImage, FileCode, FileText } from 'lucide-react';
import { 
  convertToSVG, 
  downloadFile,
  exportAsImage
} from '@/lib/imageUtils';
import { useToast } from '@/hooks/use-toast';

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
  
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-center">Export Options</h3>
          
          <Tabs defaultValue="svg" className="w-full" onValueChange={(value) => setFormat(value as any)}>
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="svg" className="flex items-center gap-1">
                <FileCode className="h-4 w-4" />
                <span>SVG</span>
              </TabsTrigger>
              <TabsTrigger value="png" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                <span>PNG</span>
              </TabsTrigger>
              <TabsTrigger value="jpg" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                <span>JPG</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="pt-6 space-y-6">
              <div className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-bg" 
                    className="h-5 w-5"
                    checked={includeBackground}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setIncludeBackground(checked);
                      }
                    }}
                  />
                  <Label htmlFor="include-bg" className="text-base font-medium cursor-pointer">
                    Include background in export
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-7">
                  {includeBackground 
                    ? "Background will be included in the exported file." 
                    : "Logo will be exported with a transparent background."}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo-variant" className="text-base block">Logo Variant</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    id="black-variant"
                    variant={logoVariant === 'black' ? 'default' : 'outline'}
                    className="flex-1 py-6"
                    onClick={() => setLogoVariant('black')}
                  >
                    Black Logo
                    {includeBackground && <span className="text-xs block mt-1">({whiteBackgroundColor} background)</span>}
                  </Button>
                  <Button
                    id="white-variant"
                    variant={logoVariant === 'white' ? 'default' : 'outline'}
                    className="flex-1 py-6"
                    onClick={() => setLogoVariant('white')}
                  >
                    White Logo
                    {includeBackground && <span className="text-xs block mt-1">({blackBackgroundColor} background)</span>}
                  </Button>
                </div>
              </div>
              
              <Button
                className="w-full flex items-center justify-center gap-2 py-6 text-lg"
                onClick={handleExport}
                disabled={!originalImageUrl}
              >
                <Download className="h-5 w-5" />
                <span>Download as {format.toUpperCase()}</span>
              </Button>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
