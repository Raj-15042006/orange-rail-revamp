import { Train } from '@/data/trains';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Calendar } from 'lucide-react';

interface TrainCardProps {
  train: Train;
}

export const TrainCard = ({ train }: TrainCardProps) => {
  const getTypeColor = (type: Train['type']) => {
    const colors = {
      'Rajdhani': 'bg-primary text-primary-foreground',
      'Shatabdi': 'bg-secondary text-secondary-foreground',
      'Express': 'bg-accent text-accent-foreground',
      'Superfast': 'bg-primary text-primary-foreground',
      'Local': 'bg-muted text-muted-foreground'
    };
    return colors[type];
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.02] animate-fade-in overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Train Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{train.number}</span>
                  <Badge className={getTypeColor(train.type)}>{train.type}</Badge>
                </div>
                <h3 className="text-xl font-semibold text-foreground mt-1">{train.name}</h3>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">From</span>
                <span className="font-semibold text-foreground">{train.from}</span>
                <span className="text-primary font-bold text-lg">{train.departure}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-1 min-w-[100px]">
                <ArrowRight className="h-5 w-5 text-primary mb-1" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{train.duration}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-muted-foreground">To</span>
                <span className="font-semibold text-foreground">{train.to}</span>
                <span className="text-primary font-bold text-lg">{train.arrival}</span>
              </div>
            </div>

            {/* Days & Classes */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Runs:</span>
              </div>
              {train.days.map(day => (
                <Badge key={day} variant="outline" className="text-xs">{day}</Badge>
              ))}
              <span className="text-muted-foreground mx-2">|</span>
              <span className="text-muted-foreground">Classes:</span>
              {train.classes.map(cls => (
                <Badge key={cls} variant="secondary" className="text-xs">{cls}</Badge>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-2 md:items-end">
            <Button 
              variant="default" 
              className="w-full md:w-auto"
              onClick={() => window.location.href = `/train/${train.number}`}
            >
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
