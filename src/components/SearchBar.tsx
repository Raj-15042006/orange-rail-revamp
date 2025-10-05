import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ArrowRight, Calendar } from 'lucide-react';

interface SearchBarProps {
  onSearch: (from: string, to: string, day: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleSearch = () => {
    onSearch(from, to, selectedDay);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">From Station / Code</label>
          <Input
            type="text"
            placeholder="e.g., New Delhi or NDLS"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-12"
          />
        </div>

        <ArrowRight className="hidden md:block h-6 w-6 text-primary mb-4" />

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">To Station / Code</label>
          <Input
            type="text"
            placeholder="e.g., Mumbai or BCT"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Filter by Day</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Days</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
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
