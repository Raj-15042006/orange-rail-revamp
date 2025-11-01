import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Train } from '@/data/trains';
import { ArrowLeft, Clock, Calendar, MapPin, Star, Train as TrainIcon, Gauge, Sparkles, Users, History } from 'lucide-react';
import { useTrainCSVData } from '@/hooks/useTrainCSVData';
import { getTrainByNumber, getDaysOfWeek, getTrainSchedule, getStationByCode } from '@/services/csvData';

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const { dataReady, isLoading } = useTrainCSVData();
  
  const trnRow = dataReady ? getTrainByNumber(trainNumber || '') : undefined;
  
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
  
  // Get schedule with optimized lookup
  const schedule = trnRow && dataReady ? getTrainSchedule(trnRow.number) : [];
  const sortedSchedule = schedule.length > 0 
    ? [...schedule].sort((a, b) => parseFloat(a.km) - parseFloat(b.km))
    : [];
  
  const stopsData = sortedSchedule.map(sch => {
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

        {/* Station Ratings */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Train Schedule */}
          <Card className="lg:col-span-2 p-6 shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Route Information
            </h2>
            {train.stops.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
                  <div>Station</div>
                  <div>Code</div>
                  <div>Arrival</div>
                  <div>Departure</div>
                  <div>Halt</div>
                  <div>Day</div>
                </div>
                {train.stops.map((stop, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-6 gap-2 py-3 border-b border-border hover:bg-accent/50 transition-colors rounded-lg px-2"
                  >
                    <div className="font-semibold text-foreground">{stop.name}</div>
                    <div className="text-primary font-mono font-bold">{stop.code}</div>
                    <div className="text-foreground">{stop.arrival}</div>
                    <div className="text-foreground">{stop.departure}</div>
                    <div className="text-muted-foreground">{stop.halt}</div>
                    <div>
                      <Badge variant="outline" className="text-xs">Day {stop.day}</Badge>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-2">
                {train.coachTypes.map((coach, idx) => (
                  <div key={idx} className="text-sm text-foreground bg-accent/50 px-3 py-2 rounded">
                    {coach}
                  </div>
                ))}
              </div>
            </Card>

            {/* Engine */}
            <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Locomotive Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Engine</p>
                  <p className="text-sm text-foreground font-medium">{train.engine}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Home Shed</p>
                  <p className="text-sm text-foreground font-medium">{train.engineShed}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Train History */}
        <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Train History
          </h2>
          <p className="text-foreground leading-relaxed">{train.history}</p>
        </Card>

        {/* Crossings & Overtakes */}
        {(train.crossings || train.overtakes) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {train.crossings && train.crossings.length > 0 && (
              <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Train Crossings
                </h3>
                <ul className="space-y-2">
                  {train.crossings.map((crossing, idx) => (
                    <li key={idx} className="text-sm text-foreground bg-accent/50 px-3 py-2 rounded">
                      {crossing}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {train.overtakes && train.overtakes.length > 0 && (
              <Card className="p-6 shadow-[var(--shadow-card)] animate-fade-in">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrainIcon className="h-5 w-5 text-primary" />
                  Train Overtakes
                </h3>
                <ul className="space-y-2">
                  {train.overtakes.map((overtake, idx) => (
                    <li key={idx} className="text-sm text-foreground bg-accent/50 px-3 py-2 rounded">
                      {overtake}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
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
