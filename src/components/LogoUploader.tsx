
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoUploaderProps {
  onImageUploaded: (dataUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onImageUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, []);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, []);
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processFile = (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or SVG file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onImageUploaded(e.target.result);
        toast({
          title: "Logo uploaded",
          description: "Your logo has been successfully uploaded.",
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Sample logos
  const sampleLogos = [
    { name: 'Simple Logo', path: '/placeholder.svg' },
  ];
  
  const loadSampleLogo = (path: string) => {
    fetch(path)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            onImageUploaded(e.target.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error loading sample logo:', error);
        toast({
          title: "Error",
          description: "Failed to load sample logo",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Card className="panel transition-all duration-300 w-full animate-scale-in">
      <CardContent className="p-6">
        <div 
          className={`
            flex flex-col items-center justify-center w-full p-8 
            border-2 border-dashed rounded-xl transition-all duration-200 
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mt-2">Upload your logo</h3>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            Drag & drop your image here, or click to browse
          </p>
          
          <div className="flex gap-2 mt-2">
            <Button 
              variant="secondary" 
              onClick={openFileDialog}
              className="interactive"
            >
              Choose File
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/svg+xml"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="w-full mt-8">
            <div className="flex items-center">
              <div className="flex-grow h-px bg-border" />
              <span className="px-3 text-xs text-muted-foreground uppercase">Or use a sample</span>
              <div className="flex-grow h-px bg-border" />
            </div>
            
            <div className="flex gap-3 mt-4 justify-center">
              {sampleLogos.map((logo) => (
                <Button 
                  key={logo.name}
                  variant="outline" 
                  size="sm"
                  className="flex gap-2 interactive"
                  onClick={() => loadSampleLogo(logo.path)}
                >
                  <ImageIcon className="h-4 w-4" />
                  {logo.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoUploader;
