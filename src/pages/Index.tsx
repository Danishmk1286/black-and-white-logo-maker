import React, { useState } from 'react';
import LogoUploader from '@/components/LogoUploader';
import ExportOptions from '@/components/ExportOptions';
const Index = () => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const handleImageUploaded = (dataUrl: string) => {
    setOriginalImageUrl(dataUrl);
  };
  return <div className="min-h-screen bg-background py-8 px-4 sm:px-6 md:py-12">
      <div className="container max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Black & White Logo Maker</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transform your logos into black and white variants.
          </p>
        </header>

        <div className="space-y-6">
          <LogoUploader onImageUploaded={handleImageUploaded} />
          
          {originalImageUrl && <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border bg-white">
                  {originalImageUrl && <img src={originalImageUrl} alt="Black on white preview" className="max-w-full max-h-full object-contain p-4" style={{
                filter: 'brightness(0) saturate(100%)'
              }} />}
                </div>
                
                <div className="w-full h-64 sm:h-80 flex items-center justify-center rounded-lg overflow-hidden border border-border bg-black">
                  {originalImageUrl && <img src={originalImageUrl} alt="White on black preview" className="max-w-full max-h-full object-contain p-4" style={{
                filter: 'brightness(0) saturate(100%) invert(1)'
              }} />}
                </div>
              </div>
              
              <ExportOptions originalImageUrl={originalImageUrl} />
            </>}
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Black & White Maker. All rights reserved.</p>
        </footer>
      </div>
    </div>;
};
export default Index;