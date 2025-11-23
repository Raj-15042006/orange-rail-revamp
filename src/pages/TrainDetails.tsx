import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScheduleTable } from '@/components/ScheduleTable';
import { Train } from '@/data/trains';
import { ArrowLeft, Clock, Calendar, MapPin, Star, Train as TrainIcon, Gauge, Sparkles, Users, History } from 'lucide-react';
import { useTrainCSVData } from '@/hooks/useTrainCSVData';
import { getTrainByNumber, getDaysOfWeek, getTrainSchedule, getStationByCode, getTrainXO } from '@/services/csvData';

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const { dataReady, isLoading } = useTrainCSVData();
  
  const trnRow = dataReady ? getTrainByNumber(trainNumber || '') : undefined;
  
  // Helper function to format time from minutes to 24-hour HH:MM format
  const formatTime = (minutes: string | number): string => {
    const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    if (isNaN(mins) || mins === -1) return 'N/A';
    
    // Handle times that go past midnight (>1440 minutes)
    const normalizedMins = mins % 1440;
    const hours = Math.floor(normalizedMins / 60);
    const minsRemainder = normalizedMins % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minsRemainder.toString().padStart(2, '0')}`;
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

  // Helper function to calculate halt time
  const calculateHalt = (arrTime: string, depTime: string): string => {
    const arr = parseInt(arrTime) || 0;
    const dep = parseInt(depTime) || 0;
    const haltMinutes = dep - arr;
    return haltMinutes > 0 ? `${haltMinutes} min` : '--';
  };
  
  // Get schedule with optimized lookup
  const schedule = trnRow && dataReady ? getTrainSchedule(trnRow.number) : [];
  const sortedSchedule = schedule.length > 0 
    ? [...schedule].sort((a, b) => parseFloat(a.km) - parseFloat(b.km))
    : [];

  // Get crossings and overtakes
  const trainXO = trnRow && dataReady ? getTrainXO(trnRow.number) : [];
  
  const stopsData = sortedSchedule.map(sch => {
    const station = getStationByCode(sch.stnCode);
    return {
      code: sch.stnCode,
      name: station?.name || sch.stnCode,
      arrival: formatTime(sch.arrTime),
      departure: formatTime(sch.depTime),
      halt: calculateHalt(sch.arrTime, sch.depTime),
      distance: parseFloat(sch.km) || 0,
      day: parseInt(sch.dayNum) || 0,
    };
  });
  
  const train: Train | undefined = trnRow ? {
    id: trnRow.number,
    number: trnRow.number,
    name: trnRow.name,
    from: trnRow.fromStnName,
    fromCode: trnRow.fromStnCode,
    to: trnRow.toStnName,
    toCode: trnRow.toStnCode,
    departure: stopsData.length > 0 ? stopsData[0].departure : 'N/A',
    arrival: stopsData.length > 0 ? stopsData[stopsData.length - 1].arrival : 'N/A',
    duration: sortedSchedule.length > 1 
      ? calculateDuration(sortedSchedule[0].depTime, sortedSchedule[sortedSchedule.length - 1].arrTime)
      : 'N/A',
    type: 'Express',
    days: getDaysOfWeek(parseInt(trnRow.departureDaysOfWeek) || 0),
    classes: trnRow.classesOffered ? trnRow.classesOffered.split('') : [],
    stops: stopsData,
    ratings: { railfanning: 0, cleanliness: 0, punctuality: 0, comfort: 0 },
    coachTypes: trnRow.rake ? trnRow.rake.split(' ') : [],
    engine: 'N/A',
    engineShed: 'N/A',
    history: trnRow.rakeNotes || 'N/A',
  } : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-hero)]">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading train details...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-[var(--gradient-hero)]">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Train Not Found</h2>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </Card>
        </main>
      </div>
    );
  }

  const RatingMeter = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold text-primary">{value}/5</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Train Header */}
        <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">{train.number}</span>
                <Badge className="bg-primary text-primary-foreground">{train.type}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{train.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{train.from} ({train.fromCode}) → {train.to} ({train.toCode})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                <Clock className="h-6 w-6" />
                {train.duration}
              </div>
            </div>
          </div>
        </Card>

        {/* Station Ratings - Hidden as no data available */}
        {false && (
          <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Station Ratings & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RatingMeter label="Railfanning" value={train.ratings.railfanning} icon={Sparkles} />
              <RatingMeter label="Cleanliness" value={train.ratings.cleanliness} icon={Sparkles} />
              <RatingMeter label="Punctuality" value={train.ratings.punctuality} icon={Clock} />
              <RatingMeter label="Comfort" value={train.ratings.comfort} icon={Users} />
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Train Schedule */}
          <Card className="lg:col-span-2 p-6 shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Route Information
            </h2>
            {train.stops.length > 0 ? (
              <ScheduleTable 
                stops={train.stops} 
                rawSchedule={sortedSchedule}
                crossingsData={trainXO}
              />
            ) : (
              <p className="text-muted-foreground">Detailed schedule information not available</p>
            )}
          </Card>

          {/* Train Info Sidebar */}
          <div className="space-y-6">
            {/* Running Days */}
            <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Running Days
              </h3>
              <div className="flex flex-wrap gap-2">
                {train.days.map(day => (
                  <Badge key={day} className="bg-primary text-primary-foreground">{day}</Badge>
                ))}
              </div>
            </Card>

            {/* Classes */}
            <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <TrainIcon className="h-5 w-5 text-primary" />
                Available Classes
              </h3>
              <div className="flex flex-wrap gap-2">
                {train.classes.map(cls => (
                  <Badge key={cls} variant="secondary">{cls}</Badge>
                ))}
              </div>
            </Card>

            {/* Coach Types */}
            <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <TrainIcon className="h-5 w-5 text-primary" />
                Coach Composition
              </h3>
              {trnRow?.rake ? (
                <div className="space-y-2">
                  {trnRow.rake.split(' ').map((coach, idx) => (
                    <div key={idx} className="text-sm text-foreground bg-accent/50 px-3 py-2 rounded">
                      {coach}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No coach information available</p>
              )}
            </Card>

            {/* Zone & Type */}
            <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Train Details
              </h3>
              <div className="space-y-3">
                {trnRow?.zone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Zone</p>
                    <Badge className="bg-primary text-primary-foreground">{trnRow.zone}</Badge>
                  </div>
                )}
                {trnRow?.type && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Train Type</p>
                    <p className="text-sm text-foreground font-medium">{trnRow.type}</p>
                  </div>
                )}
                {trnRow?.rakeType && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rake Type</p>
                    <p className="text-sm text-foreground font-medium">{trnRow.rakeType}</p>
                  </div>
                )}
                {trnRow?.pantry && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pantry</p>
                    <Badge variant={trnRow.pantry === 'Y' ? 'default' : 'secondary'}>
                      {trnRow.pantry === 'Y' ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                )}
                {trnRow?.linenBedding && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Linen & Bedding</p>
                    <Badge variant={trnRow.linenBedding === 'Y' ? 'default' : 'secondary'}>
                      {trnRow.linenBedding === 'Y' ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Train History */}
        <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Train History & Notes
          </h2>
          <div className="space-y-4">
            {trnRow?.rakeNotes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Rake Notes</p>
                <p className="text-foreground leading-relaxed">{trnRow.rakeNotes}</p>
              </div>
            )}
            {trnRow?.pantryNote && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Pantry Information</p>
                <p className="text-foreground leading-relaxed">{trnRow.pantryNote}</p>
              </div>
            )}
            {trnRow?.linenBeddingDet && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Linen & Bedding</p>
                <p className="text-foreground leading-relaxed">{trnRow.linenBeddingDet}</p>
              </div>
            )}
            {trnRow?.offName && trnRow.offName !== trnRow.name && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Official Name</p>
                <p className="text-foreground leading-relaxed">{trnRow.offName}</p>
              </div>
            )}
            {!trnRow?.rakeNotes && !trnRow?.pantryNote && !trnRow?.linenBeddingDet && (
              <p className="text-muted-foreground">No additional information available</p>
            )}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 RailSearch. Comprehensive train information platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default TrainDetails;
