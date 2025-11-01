import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TrainCard } from '@/components/TrainCard';
import { Stats } from '@/components/Stats';
import { Train as TrainType } from '@/data/trains';
import { Train, Sparkles, Database } from 'lucide-react';
import { useTrainCSVData } from '@/hooks/useTrainCSVData';
import { searchTrains, getDaysOfWeek, TrnRow, SchRow, getStationByCode, getTrainSchedule } from '@/services/csvData';

interface MergedTrainData extends TrnRow {
  departureTime: string;
  arrivalTime: string;
  stops: SchRow[];
}

const Index = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '', day: '' });
  
  // load all datasets together
  const { isLoading, error, trains, schedules, dataReady } = useTrainCSVData();

  const handleSearch = useCallback((from: string, to: string, day: string) => {
    setSearchParams({ from, to, day });
  }, []);

  // Optimized merge logic with indexed schedule lookups
  const filteredTrains = useMemo(() => {
    if (!dataReady) return [];
    const results = searchTrains(searchParams.from, searchParams.to, searchParams.day);

    // Limit results first before processing
    const limitedResults = results.slice(0, 50);

    // merge with Sch.csv data using indexed lookups
    const merged = limitedResults.map(trnRow => {
      const trainSchedule = getTrainSchedule(trnRow.number);
      
      if (trainSchedule.length === 0) {
        return { 
          ...trnRow, 
          departureTime: '-1',
          arrivalTime: '-1',
          stops: []
        };
      }
      
      // Sort by km to get first and last stops
      const sortedSchedule = [...trainSchedule].sort((a, b) => parseFloat(a.km) - parseFloat(b.km));
      const firstStop = sortedSchedule[0];
      const lastStop = sortedSchedule[sortedSchedule.length - 1];
      
      return { 
        ...trnRow, 
        departureTime: firstStop.depTime,
        arrivalTime: lastStop.arrTime,
        stops: sortedSchedule
      };
    });

    return merged;
  }, [dataReady, searchParams]);

  // Helper function to format time from minutes to HH:MM
  const formatTime = (minutes: string | number): string => {
    const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    if (isNaN(mins) || mins === -1) return 'N/A';
    const hours = Math.floor(mins / 60).toString().padStart(2, '0');
    const minsRemainder = (mins % 60).toString().padStart(2, '0');
    return `${hours}:${minsRemainder}`;
  };

  // Helper function to calculate duration
  const calculateDuration = (depTime: string, arrTime: string): string => {
    const dep = parseInt(depTime);
    const arr = parseInt(arrTime);
    if (isNaN(dep) || isNaN(arr)) return 'N/A';
    const durationMins = arr - dep;
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;
    return `${hours}h ${mins}m`;
  };

  const convertToTrain = useCallback((mergedData: MergedTrainData): TrainType => {
    const trainType = mergedData.type || 'Express';
    const validType: TrainType['type'] = 
      ['Express', 'Local', 'Rajdhani', 'Shatabdi', 'Superfast'].includes(trainType) 
        ? trainType as TrainType['type']
        : 'Express';

    // Convert schedule stops to station data
    const stopsData = mergedData.stops.map(sch => {
      const station = getStationByCode(sch.stnCode);
      return {
        code: sch.stnCode,
        name: station?.name || sch.stnCode,
        arrival: formatTime(sch.arrTime),
        departure: formatTime(sch.depTime),
        halt: sch.halt || '--',
        distance: parseFloat(sch.km) || 0,
        day: parseInt(sch.dayNum) || 0,
      };
    });

    return {
      id: mergedData.number,
      number: mergedData.number,
      name: mergedData.name,
      from: mergedData.fromStnName,
      fromCode: mergedData.fromStnCode,
      to: mergedData.toStnName,
      toCode: mergedData.toStnCode,
      departure: formatTime(mergedData.departureTime),
      arrival: formatTime(mergedData.arrivalTime),
      duration: calculateDuration(mergedData.departureTime, mergedData.arrivalTime),
      type: validType,
      days: getDaysOfWeek(parseInt(mergedData.departureDaysOfWeek) || 0),
      classes: mergedData.classesOffered ? mergedData.classesOffered.split('') : [],
      stops: stopsData,
      ratings: { railfanning: 0, cleanliness: 0, punctuality: 0, comfort: 0 },
      coachTypes: mergedData.rake ? mergedData.rake.split(' ') : [],
      engine: 'N/A',
      engineShed: 'N/A',
      history: mergedData.rakeNotes || 'N/A',
    };
  }, []);


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
                <span>Loading train and schedule data...</span>
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
                  ✓ Loaded {trains.length} trains and {schedules.length} schedules
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
                <div key={trnRow.number} style={{ animationDelay: `${index * 50}ms` }}>
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
