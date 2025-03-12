
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LogoUploader from '@/components/LogoUploader';
import ImageConverter from '@/components/ImageConverter';
import BackgroundPicker from '@/components/BackgroundPicker';
import Preview from '@/components/Preview';
import ExportOptions from '@/components/ExportOptions';

const Index = () => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [bwImageUrl, setBwImageUrl] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  const handleImageUploaded = (dataUrl: string) => {
    setOriginalImageUrl(dataUrl);
    setIsBlackAndWhite(false);
    setBwImageUrl(null);
  };

  const handleBwImageConverted = (dataUrl: string) => {
    setBwImageUrl(dataUrl);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 md:py-12">
      <div className="container max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Black & White Maker</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transform your logos to black and white, customize backgrounds, and export in high-quality formats.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <LogoUploader onImageUploaded={handleImageUploaded} />
            
            <ImageConverter 
              originalImage={originalImageUrl}
              isBlackAndWhite={isBlackAndWhite}
              onToggleBlackAndWhite={setIsBlackAndWhite}
              onConvertedImage={handleBwImageConverted}
            />
            
            <BackgroundPicker 
              backgroundColor={backgroundColor}
              onBackgroundChange={setBackgroundColor}
            />
          </div>
          
          <div className="space-y-6">
            <Preview 
              imageUrl={bwImageUrl}
              originalImageUrl={originalImageUrl}
              backgroundColor={backgroundColor}
              isBlackAndWhite={isBlackAndWhite}
            />
            
            <ExportOptions 
              imageUrl={bwImageUrl || ''}
              originalImageUrl={originalImageUrl || ''}
              backgroundColor={backgroundColor}
              isBlackAndWhite={isBlackAndWhite}
            />
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Black & White Maker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
