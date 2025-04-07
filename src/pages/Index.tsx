
import React, { useState, useEffect } from 'react';
import LogoUploader from '@/components/LogoUploader';
import ExportOptions from '@/components/ExportOptions';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [whiteBackgroundColor, setWhiteBackgroundColor] = useState('#FFFFFF');
  const [blackBackgroundColor, setBlackBackgroundColor] = useState('#000000');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleImageUploaded = (dataUrl: string) => {
    // Set loading state to true
    setIsLoading(true);
    setProgress(0);
    
    // Store the image URL temporarily
    const tempImageUrl = dataUrl;
    
    // Reset the image so loading state is visible
    setOriginalImageUrl(null);
    
    // Simulate a 3-second loading process with progress updates
    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return prev + 3.33; // Roughly 30 steps over 3 seconds
      });
    }, 100);
    
    // After 3 seconds, set the image URL and finish loading
    setTimeout(() => {
      setOriginalImageUrl(tempImageUrl);
      setIsLoading(false);
      setProgress(100);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="container max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8 md:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Black & White Logo Maker</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Transform your logos into black and white variants.
          </p>
        </header>

        <div className="space-y-4 sm:space-y-6">
          <div className="w-full border-2 border-dashed border-border rounded-lg p-3 sm:p-4 md:p-6 transition-all duration-200 hover:border-primary">
            <LogoUploader onImageUploaded={handleImageUploaded} />
            
            {!originalImageUrl && !isLoading && (
              <div className="mt-4 sm:mt-6 text-center">
                <h2 className="text-base sm:text-lg font-medium text-primary">Upload your logo to get started</h2>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Once you upload your logo, we'll process it and generate black and white variants for you.
                </p>
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="py-6 sm:py-8 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-medium">Processing your logo...</h3>
              <div className="w-full max-w-xs sm:max-w-md">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
                  Generating black and white variants
                </p>
              </div>
            </div>
          )}
          
          {originalImageUrl && !isLoading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-medium text-base">Black Logo Preview</h3>
                    <div className="flex items-center gap-2">
                      <label htmlFor="blackBgColor" className="text-xs sm:text-sm">Background:</label>
                      <input 
                        type="color" 
                        id="blackBgColor" 
                        value={whiteBackgroundColor} 
                        onChange={(e) => setWhiteBackgroundColor(e.target.value)}
                        className="w-6 h-6 sm:w-8 sm:h-8 border-0 p-0 rounded cursor-pointer" 
                      />
                      <span className="text-xs font-mono">{whiteBackgroundColor}</span>
                    </div>
                  </div>
                  <div 
                    className="w-full h-48 sm:h-64 md:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border"
                    style={{ backgroundColor: whiteBackgroundColor }}
                  >
                    {originalImageUrl && (
                      <img 
                        src={originalImageUrl} 
                        alt="Black on white preview" 
                        className="max-w-full max-h-full object-contain p-2 sm:p-4" 
                        style={{
                          filter: 'brightness(0) saturate(100%)'
                        }} 
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-medium text-base">White Logo Preview</h3>
                    <div className="flex items-center gap-2">
                      <label htmlFor="whiteBgColor" className="text-xs sm:text-sm">Background:</label>
                      <input 
                        type="color" 
                        id="whiteBgColor" 
                        value={blackBackgroundColor} 
                        onChange={(e) => setBlackBackgroundColor(e.target.value)}
                        className="w-6 h-6 sm:w-8 sm:h-8 border-0 p-0 rounded cursor-pointer" 
                      />
                      <span className="text-xs font-mono">{blackBackgroundColor}</span>
                    </div>
                  </div>
                  <div 
                    className="w-full h-48 sm:h-64 md:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border"
                    style={{ backgroundColor: blackBackgroundColor }}
                  >
                    {originalImageUrl && (
                      <img 
                        src={originalImageUrl} 
                        alt="White on black preview" 
                        className="max-w-full max-h-full object-contain p-2 sm:p-4" 
                        style={{
                          filter: 'brightness(0) saturate(100%) invert(1)'
                        }} 
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <ExportOptions 
                originalImageUrl={originalImageUrl} 
                whiteBackgroundColor={whiteBackgroundColor}
                blackBackgroundColor={blackBackgroundColor}
              />
            </>
          )}
        </div>

        <footer className="mt-8 sm:mt-12 md:mt-16 text-center text-xs sm:text-sm text-muted-foreground py-4">
          <p>© {new Date().getFullYear()} Black & White Maker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
