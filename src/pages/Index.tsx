import { useState } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TrainCard } from '@/components/TrainCard';
import { Stats } from '@/components/Stats';
import { sampleTrains } from '@/data/trains';
import { Train, Sparkles } from 'lucide-react';

const Index = () => {
  const [filteredTrains, setFilteredTrains] = useState(sampleTrains);

  const handleSearch = (from: string, to: string) => {
    if (!from && !to) {
      setFilteredTrains(sampleTrains);
      return;
    }

    const filtered = sampleTrains.filter(train => {
      const matchFrom = !from || train.from.toLowerCase().includes(from.toLowerCase());
      const matchTo = !to || train.to.toLowerCase().includes(to.toLowerCase());
      return matchFrom && matchTo;
    });

    setFilteredTrains(filtered);
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-float">
            <Sparkles className="h-4 w-4" />
            <span>Modern Train Booking Experience</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Train Journey
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search from thousands of trains across India. Get real-time updates, check availability, 
            and book your tickets instantly.
          </p>
        </section>

        {/* Search Section */}
        <section className="max-w-5xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Stats Section */}
        <section>
          <Stats />
        </section>

        {/* Results Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Train className="h-6 w-6 text-primary" />
                Available Trains
              </h2>
              <p className="text-muted-foreground mt-1">
                Showing {filteredTrains.length} trains
              </p>
            </div>
          </div>

          {filteredTrains.length > 0 ? (
            <div className="space-y-4">
              {filteredTrains.map((train, index) => (
                <div
                  key={train.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TrainCard train={train} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Train className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No trains found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 RailSearch. Modern train information platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
