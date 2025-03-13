
import React, { useState } from 'react';
import LogoUploader from '@/components/LogoUploader';
import ExportOptions from '@/components/ExportOptions';

const Index = () => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [whiteBackgroundColor, setWhiteBackgroundColor] = useState('#FFFFFF');
  const [blackBackgroundColor, setBlackBackgroundColor] = useState('#000000');
  
  const handleImageUploaded = (dataUrl: string) => {
    setOriginalImageUrl(dataUrl);
  };
  
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 md:py-12">
      <div className="container max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Black & White Logo Maker</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transform your logos into black and white variants.
          </p>
        </header>

        <div className="space-y-6">
          <div className="w-full border-2 border-dashed border-border rounded-lg p-6 transition-all duration-200 hover:border-primary">
            <LogoUploader onImageUploaded={handleImageUploaded} />
            
            {!originalImageUrl && (
              <div className="mt-6 text-center">
                <h2 className="text-lg font-medium text-primary">Upload your logo to get started</h2>
                <p className="text-muted-foreground mt-2">
                  Once you upload your logo, you'll see black and white previews and be able to customize and export them.
                </p>
              </div>
            )}
          </div>
          
          {originalImageUrl && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Black Logo Preview</h3>
                    <div className="flex items-center gap-2">
                      <label htmlFor="blackBgColor" className="text-sm">Background:</label>
                      <input 
                        type="color" 
                        id="blackBgColor" 
                        value={whiteBackgroundColor} 
                        onChange={(e) => setWhiteBackgroundColor(e.target.value)}
                        className="w-8 h-8 border-0 p-0 rounded cursor-pointer" 
                      />
                      <span className="text-xs font-mono">{whiteBackgroundColor}</span>
                    </div>
                  </div>
                  <div 
                    className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border"
                    style={{ backgroundColor: whiteBackgroundColor }}
                  >
                    {originalImageUrl && (
                      <img 
                        src={originalImageUrl} 
                        alt="Black on white preview" 
                        className="max-w-full max-h-full object-contain p-4" 
                        style={{
                          filter: 'brightness(0) saturate(100%)'
                        }} 
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">White Logo Preview</h3>
                    <div className="flex items-center gap-2">
                      <label htmlFor="whiteBgColor" className="text-sm">Background:</label>
                      <input 
                        type="color" 
                        id="whiteBgColor" 
                        value={blackBackgroundColor} 
                        onChange={(e) => setBlackBackgroundColor(e.target.value)}
                        className="w-8 h-8 border-0 p-0 rounded cursor-pointer" 
                      />
                      <span className="text-xs font-mono">{blackBackgroundColor}</span>
                    </div>
                  </div>
                  <div 
                    className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border"
                    style={{ backgroundColor: blackBackgroundColor }}
                  >
                    {originalImageUrl && (
                      <img 
                        src={originalImageUrl} 
                        alt="White on black preview" 
                        className="max-w-full max-h-full object-contain p-4" 
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

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Black & White Maker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
