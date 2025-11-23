import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ArrowLeftRight, Zap } from 'lucide-react';
import { SchRow, XORow } from '@/services/csvData';

interface Station {
  code: string;
  name: string;
  arrival: string;
  departure: string;
  halt: string;
  distance: number;
  day: number;
}

interface ScheduleTableProps {
  stops: Station[];
  rawSchedule: SchRow[];
  crossingsData: XORow[];
}

export const ScheduleTable = ({ stops, rawSchedule, crossingsData }: ScheduleTableProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Separate halt stations and intermediate stations
  const haltStations = stops.map((stop, idx) => ({
    ...stop,
    originalIndex: idx,
    type: rawSchedule[idx]?.type || '0',
  })).filter(s => s.type === '0');

  // Group intermediate stations between halts
  const sections = haltStations.map((halt, idx) => {
    const currentIdx = halt.originalIndex;
    const nextHalt = haltStations[idx + 1];
    const nextIdx = nextHalt ? nextHalt.originalIndex : stops.length;
    
    const intermediates = stops.slice(currentIdx + 1, nextIdx).map((stop, i) => {
      const intermediateStop = stops[currentIdx + 1 + i];
      // Get crossings/overtakes for each intermediate station
      const xoInfo = crossingsData.filter(xo => xo.stnCode === intermediateStop.code);
      return {
        ...intermediateStop,
        originalIndex: currentIdx + 1 + i,
        xoInfo,
      };
    });

    // Get crossings/overtakes for this halt station
    const xoInfo = crossingsData.filter(xo => xo.stnCode === halt.code);
    
    return {
      halt,
      intermediates,
      xoInfo,
    };
  });

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getXOTypeLabel = (type: string) => {
    if (type === 'C') return { label: 'Crossing', icon: ArrowLeftRight, color: 'bg-blue-500' };
    if (type === 'O') return { label: 'Overtake', icon: Zap, color: 'bg-orange-500' };
    return { label: 'XO', icon: ArrowLeftRight, color: 'bg-gray-500' };
  };

  const getDaysFromMask = (dayMask: string): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mask = parseInt(dayMask) || 0;
    const activeDays: string[] = [];
    for (let i = 0; i < days.length; i++) {
      if ((mask >> i) & 1) {
        activeDays.push(days[i]);
      }
    }
    return activeDays.length === 7 ? 'Daily' : activeDays.join(', ');
  };

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b border-border sticky top-0 bg-card z-10 px-2">
        <div>Station</div>
        <div>Code</div>
        <div className="font-mono">Arrival (24h)</div>
        <div className="font-mono">Departure (24h)</div>
        <div>Halt</div>
        <div>Distance (km)</div>
        <div>Day</div>
      </div>
      
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-1">
          {/* Halt Station */}
          <div className="grid grid-cols-7 gap-2 py-3 border-b border-border bg-primary/5 hover:bg-primary/10 transition-colors rounded-lg px-2">
            <div className="font-bold text-foreground">{section.halt.name}</div>
            <div className="text-primary font-mono font-bold">{section.halt.code}</div>
            <div className="text-foreground font-mono tabular-nums">{section.halt.arrival}</div>
            <div className="text-foreground font-mono tabular-nums">{section.halt.departure}</div>
            <div className="text-accent-foreground font-semibold">{section.halt.halt}</div>
            <div className="text-muted-foreground">{section.halt.distance.toFixed(1)}</div>
            <div>
              <Badge variant="outline" className="text-xs">Day {section.halt.day}</Badge>
            </div>
          </div>

          {/* Crossings/Overtakes Info */}
          {section.xoInfo.length > 0 && (
            <div className="ml-4 mb-2 flex flex-wrap gap-2">
              {section.xoInfo.map((xo, idx) => {
                const xoType = getXOTypeLabel(xo.type);
                const XOIcon = xoType.icon;
                const runDays = getDaysFromMask(xo.departureDaysOfWeek);
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col gap-0.5 text-xs px-2 py-1.5 rounded ${xoType.color} text-white`}
                  >
                    <div className="flex items-center gap-1">
                      <XOIcon className="h-3 w-3" />
                      <span className="font-semibold">{xoType.label}: Train #{xo.trnNumberXO}</span>
                    </div>
                    <span className="text-[10px] opacity-90">On: {runDays}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Intermediate Stations (Expandable) */}
          {section.intermediates.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(sectionIdx)}
                className="w-full justify-start text-xs text-muted-foreground hover:text-foreground ml-2"
              >
                {expandedSections.has(sectionIdx) ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                {section.intermediates.length} intermediate station(s)
              </Button>
              
              {expandedSections.has(sectionIdx) && (
                <div className="ml-6 space-y-1 animate-fade-in">
                  {section.intermediates.map((intermediate, idx) => (
                    <div key={idx} className="space-y-1">
                      <div 
                        className="grid grid-cols-7 gap-2 py-2 border-b border-border/50 hover:bg-accent/30 transition-colors rounded px-2 text-sm"
                      >
                        <div className="text-muted-foreground">{intermediate.name}</div>
                        <div className="text-muted-foreground font-mono">{intermediate.code}</div>
                        <div className="text-muted-foreground font-mono tabular-nums">{intermediate.arrival}</div>
                        <div className="text-muted-foreground font-mono tabular-nums">{intermediate.departure}</div>
                        <div className="text-muted-foreground/70">{intermediate.halt}</div>
                        <div className="text-muted-foreground/70">{intermediate.distance.toFixed(1)}</div>
                        <div>
                          <Badge variant="outline" className="text-xs opacity-70">Day {intermediate.day}</Badge>
                        </div>
                      </div>
                      
                      {/* XO Info for intermediate stations */}
                      {intermediate.xoInfo && intermediate.xoInfo.length > 0 && (
                        <div className="ml-4 mb-2 flex flex-wrap gap-2">
                          {intermediate.xoInfo.map((xo, xoIdx) => {
                            const xoType = getXOTypeLabel(xo.type);
                            const XOIcon = xoType.icon;
                            const runDays = getDaysFromMask(xo.departureDaysOfWeek);
                            return (
                              <div 
                                key={xoIdx} 
                                className={`flex flex-col gap-0.5 text-xs px-2 py-1.5 rounded ${xoType.color} text-white`}
                              >
                                <div className="flex items-center gap-1">
                                  <XOIcon className="h-3 w-3" />
                                  <span className="font-semibold">{xoType.label}: Train #{xo.trnNumberXO}</span>
                                </div>
                                <span className="text-[10px] opacity-90">On: {runDays}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
