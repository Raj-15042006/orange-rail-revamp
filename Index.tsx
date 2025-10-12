import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TrainCard } from '@/components/TrainCard';
import { Stats } from '@/components/Stats';
import { Train as TrainType } from '@/data/trains';
import { Train, Sparkles, Database } from 'lucide-react';
import { useTrainCSVData } from '@/hooks/useTrainCSVData';
import { searchTrains, getDaysOfWeek, TrnRow } from '@/services/csvData';

const Index = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '', day: '' });
  const { isLoading, error, trains, dataReady } = useTrainCSVData();

  const handleSearch = (from: string, to: string, day: string) => {
    setSearchParams({ from, to, day });
  };

  const filteredTrains = useMemo(() => {
    if (!dataReady) return [];
    const results = searchTrains(searchParams.from, searchParams.to, searchParams.day);
    return results.slice(0, 50); // Limit to 50 results for performance
  }, [dataReady, searchParams]);

  const convertToTrain = (trnRow: TrnRow): TrainType => ({
    id: trnRow.number,
    number: trnRow.number,
    name: trnRow.name,
    from: trnRow.fromStnName,
    fromCode: trnRow.fromStnCode,
    to: trnRow.toStnName,
    toCode: trnRow.toStnCode,
    departure: trnRow.todepTime,
    arrival: trnRow.toarrType,
    duration: '',
    type: trnRow.totrackType,
    days: getDaysOfWeek(parseInt(trnRow.departureDaysOfWeek) || 0),
    classes: trnRow.classesOffered ? trnRow.classesOffered.split('') : [],
    stops: [],
    ratings: { railfanning: 0, cleanliness: 0, punctuality: 0, comfort: 0 },
    coachTypes: trnRow.rake ? trnRow.rake.split(' ') : [],
    engine: 'N/A',
    engineShed: 'N/A',
    history: trnRow.rakeNotes || 'N/A',
  });

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
        <section className="max-w-5xl mx-auto space-y-4">
          <SearchBar onSearch={handleSearch} />
          
          {isLoading && (
            <div className="text-center py-3 px-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <Database className="h-4 w-4 animate-pulse" />
                <span>Loading IRCTC train data...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-3 px-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">Error: {error}</p>
            </div>
          )}
          
          {dataReady && (
            <div className="py-3 px-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <p className="text-sm text-primary font-medium">
                  ✓ Loaded {trains.length} trains from IRCTC database
                </p>
              </div>
            </div>
          )}
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

          {dataReady && filteredTrains.length > 0 ? (
            <div className="space-y-4">
              {filteredTrains.map((trnRow, index) => (
                <div
                  key={trnRow.number}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TrainCard train={convertToTrain(trnRow)} />
                </div>
              ))}
            </div>
          ) : dataReady && filteredTrains.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Train className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No trains found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : null}
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
