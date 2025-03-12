
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileImage, FileCode, FileText } from 'lucide-react';
import { 
  convertToSVG, 
  dataURLtoBlob, 
  downloadFile,
  exportAsImage
} from '@/lib/imageUtils';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  imageUrl: string;
  originalImageUrl: string;
  backgroundColor: string;
  logoColor: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  imageUrl, 
  originalImageUrl,
  backgroundColor, 
  logoColor 
}) => {
  const { toast } = useToast();
  const [includeBackground, setIncludeBackground] = useState(true);
  const [format, setFormat] = useState<'svg' | 'png' | 'jpg' | 'pdf'>('svg');
  
  const currentImage = imageUrl || originalImageUrl;
  
  const handleExport = async () => {
    try {
      if (!currentImage) {
        toast({
          title: "No image",
          description: "Please upload an image first.",
          variant: "destructive",
        });
        return;
      }
      
      const filename = `logo_${logoColor.replace('#', '')}_${includeBackground ? backgroundColor.replace('#', '') : 'transparent'}.${format}`;
      
      if (format === 'svg') {
        const svgUrl = await convertToSVG(
          currentImage, 
          includeBackground ? backgroundColor : undefined
        );
        
        downloadFile(svgUrl, filename);
      } else {
        const exportedImage = await exportAsImage(
          currentImage,
          format,
          includeBackground ? backgroundColor : 'transparent'
        );
        
        downloadFile(exportedImage, filename);
      }
      
      toast({
        title: "Success!",
        description: `Image exported as ${format.toUpperCase()} successfully`,
      });
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
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Export Options</h3>
          
          <Tabs defaultValue="svg" className="w-full" onValueChange={(value) => setFormat(value as any)}>
            <TabsList className="w-full grid grid-cols-4">
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
            
            <div className="pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="include-bg" 
                  checked={includeBackground}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      setIncludeBackground(checked);
                    }
                  }}
                />
                <Label htmlFor="include-bg" className="cursor-pointer">
                  Include background in export
                </Label>
              </div>
              
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleExport}
                disabled={!currentImage}
              >
                <Download className="h-4 w-4" />
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
