
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PreviewProps {
  imageUrl: string | null;
  originalImageUrl: string | null;
  backgroundColor: string;
  logoColor: string;
}

const Preview: React.FC<PreviewProps> = ({ 
  imageUrl, 
  originalImageUrl,
  backgroundColor,
  logoColor
}) => {
  const displayImageUrl = imageUrl || originalImageUrl;
  
  const containerStyle = {
    backgroundColor: backgroundColor,
    backgroundImage: backgroundColor === 'transparent' ? 
      'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px' : 
      'none',
  };
  
  // Styles for the two default variants
  const blackOnWhiteStyle = {
    backgroundColor: '#FFFFFF',
  };
  
  const whiteOnBlackStyle = {
    backgroundColor: '#000000',
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preview</h3>
          
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="black-on-white">Black on White</TabsTrigger>
              <TabsTrigger value="white-on-black">White on Black</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custom">
              <div 
                className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden transition-colors duration-300 border border-border"
                style={containerStyle}
              >
                {displayImageUrl ? (
                  <img 
                    src={displayImageUrl} 
                    alt="Logo preview" 
                    className="max-w-full max-h-full object-contain p-4"
                    style={{ filter: logoColor === '#FFFFFF' ? 'drop-shadow(0 0 1px rgba(0,0,0,0.3))' : 'none' }}
                  />
                ) : (
                  <div className="text-muted-foreground text-center p-4">
                    <p>Upload a logo to see the preview</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="black-on-white">
              <div 
                className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden transition-colors duration-300 border border-border"
                style={blackOnWhiteStyle}
              >
                {originalImageUrl ? (
                  <img 
                    src={originalImageUrl} 
                    alt="Black on white preview" 
                    className="max-w-full max-h-full object-contain p-4"
                    style={{ 
                      filter: 'brightness(0) saturate(100%)',
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-center p-4">
                    <p>Upload a logo to see the preview</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="white-on-black">
              <div 
                className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden transition-colors duration-300 border border-border"
                style={whiteOnBlackStyle}
              >
                {originalImageUrl ? (
                  <img 
                    src={originalImageUrl} 
                    alt="White on black preview" 
                    className="max-w-full max-h-full object-contain p-4"
                    style={{ 
                      filter: 'brightness(0) saturate(100%) invert(1)',
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-center p-4 text-white">
                    <p>Upload a logo to see the preview</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
