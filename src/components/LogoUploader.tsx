
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface LogoUploaderProps {
  onImageUploaded: (dataUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onImageUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
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
        // Success toast removed as requested
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div 
          className={`
            flex flex-col items-center justify-center w-full p-4 sm:p-8 
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
          
          <Button 
            variant="secondary" 
            onClick={openFileDialog}
            className="mb-4"
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
      </CardContent>
    </Card>
  );
};

export default LogoUploader;
