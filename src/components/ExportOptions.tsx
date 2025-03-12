
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileImage, FileCode } from 'lucide-react';
import { 
  convertToSVG, 
  dataURLtoBlob, 
  downloadFile 
} from '@/lib/imageUtils';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  imageUrl: string;
  originalImageUrl: string;
  backgroundColor: string;
  isBlackAndWhite: boolean;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  imageUrl, 
  originalImageUrl,
  backgroundColor, 
  isBlackAndWhite 
}) => {
  const { toast } = useToast();
  
  const handleExportSVG = async (withBackground: boolean) => {
    try {
      const currentImage = isBlackAndWhite ? imageUrl : originalImageUrl;
      const svgUrl = await convertToSVG(
        currentImage, 
        withBackground ? backgroundColor : undefined
      );
      
      const filename = `logo_${isBlackAndWhite ? 'bw' : 'color'}_${withBackground ? 'with_bg' : 'transparent'}.svg`;
      downloadFile(svgUrl, filename);
      
      toast({
        title: "Success!",
        description: `SVG ${withBackground ? 'with background' : 'transparent'} downloaded successfully`,
      });
    } catch (error) {
      console.error('Error exporting SVG:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your SVG.",
        variant: "destructive",
      });
    }
  };
  
  const handleExportPNG = () => {
    try {
      const currentImage = isBlackAndWhite ? imageUrl : originalImageUrl;
      const filename = `logo_${isBlackAndWhite ? 'bw' : 'color'}.png`;
      downloadFile(currentImage, filename);
      
      toast({
        title: "Success!",
        description: "PNG downloaded successfully",
      });
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your PNG.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Export Options</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleExportSVG(true)}
              disabled={!imageUrl}
            >
              <FileCode className="h-4 w-4" />
              <span>SVG with Background</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleExportSVG(false)}
              disabled={!imageUrl}
            >
              <FileCode className="h-4 w-4" />
              <span>SVG Transparent</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleExportPNG}
              disabled={!imageUrl}
            >
              <FileImage className="h-4 w-4" />
              <span>PNG Export</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
