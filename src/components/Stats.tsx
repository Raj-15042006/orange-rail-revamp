import { Card } from '@/components/ui/card';
import { Train, Users, MapPin, Clock } from 'lucide-react';

export const Stats = () => {
  const stats = [
    { icon: Train, label: 'Active Trains', value: '12,000+', color: 'text-primary' },
    { icon: MapPin, label: 'Railway Stations', value: '8,000+', color: 'text-secondary' },
    { icon: Users, label: 'Daily Passengers', value: '23M+', color: 'text-accent' },
    { icon: Clock, label: 'On-Time Rate', value: '95%', color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="p-6 text-center hover:shadow-[var(--shadow-card)] transition-all duration-300 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 mb-3 group-hover:scale-110 transition-transform ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};
