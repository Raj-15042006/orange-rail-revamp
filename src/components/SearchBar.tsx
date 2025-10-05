import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ArrowRight, Calendar } from 'lucide-react';

interface SearchBarProps {
  onSearch: (from: string, to: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearch = () => {
    onSearch(from, to);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">From Station</label>
          <Input
            type="text"
            placeholder="Enter source station"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-12"
          />
        </div>

        <ArrowRight className="hidden md:block h-6 w-6 text-primary mb-4" />

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">To Station</label>
          <Input
            type="text"
            placeholder="Enter destination station"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Journey Date</label>
          <div className="relative">
            <Input
              type="date"
              className="h-12"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          onClick={handleSearch}
          className="w-full md:w-auto h-12 px-8"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Trains
        </Button>
      </div>
    </Card>
  );
};
