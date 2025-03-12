
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PreviewProps {
  imageUrl: string | null;
  originalImageUrl: string | null;
  backgroundColor: string;
  isBlackAndWhite: boolean;
}

const Preview: React.FC<PreviewProps> = ({ 
  imageUrl, 
  originalImageUrl,
  backgroundColor,
  isBlackAndWhite
}) => {
  const displayImageUrl = isBlackAndWhite ? imageUrl : originalImageUrl;
  
  const containerStyle = {
    backgroundColor: backgroundColor,
    backgroundImage: backgroundColor === 'transparent' ? 
      'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px' : 
      'none',
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preview</h3>
          
          <div 
            className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden transition-colors duration-300 border border-border"
            style={containerStyle}
          >
            {displayImageUrl ? (
              <img 
                src={displayImageUrl} 
                alt="Logo preview" 
                className="max-w-full max-h-full object-contain p-4"
              />
            ) : (
              <div className="text-muted-foreground text-center p-4">
                <p>Upload a logo to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
