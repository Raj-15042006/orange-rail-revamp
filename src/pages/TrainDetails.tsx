import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleTrains } from '@/data/trains';
import { ArrowLeft, Clock, Calendar, MapPin, Star, Train as TrainIcon, Gauge, Sparkles, Users, History } from 'lucide-react';

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const train = sampleTrains.find(t => t.number === trainNumber);

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
              Complete Journey Schedule
            </h2>
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
                Locomotive
              </h3>
              <p className="text-sm text-foreground">{train.engine}</p>
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
