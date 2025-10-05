import { Train } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <Train className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RailSearch</h1>
            <p className="text-xs text-muted-foreground">Find Your Journey</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            PNR Status
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Live Status
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Schedule
          </a>
        </nav>

        <Button variant="default">Sign In</Button>
      </div>
    </header>
  );
};
