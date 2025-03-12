
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

const Header: React.FC = () => {
  const { toast } = useToast();

  const showInfo = () => {
    toast({
      title: "About Black and White Maker",
      description: "Transform your logos to black and white with just a few clicks. Perfect for branding, design projects, and print materials.",
      duration: 5000,
    });
  };

  return (
    <header className="w-full py-6 px-6 md:px-10 flex justify-between items-center animate-fade-in">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Transform Your Logos</span>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">
          Black & White Maker
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={showInfo}
              >
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>About this tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
