import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ArrowLeftRight, Zap, MapPin, Clock } from 'lucide-react';
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
      const stopCode = String(intermediateStop.code).trim();
      const xoInfo = crossingsData.filter(xo => String(xo.stnCode).trim() === stopCode);
      return {
        ...intermediateStop,
        originalIndex: currentIdx + 1 + i,
        xoInfo,
      };
    });

    const haltCode = String(halt.code).trim();
    const xoInfo = crossingsData.filter(xo => String(xo.stnCode).trim() === haltCode);
    
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

  const XOBadges = ({ xoInfo, compact = false }: { xoInfo: XORow[], compact?: boolean }) => {
    if (!xoInfo || xoInfo.length === 0) return null;
    
    return (
      <div className={`flex flex-wrap gap-1.5 ${compact ? 'mt-1' : 'mt-2'}`}>
        {xoInfo.map((xo, idx) => {
          const xoType = getXOTypeLabel(xo.type);
          const XOIcon = xoType.icon;
          const runDays = getDaysFromMask(xo.departureDaysOfWeek);
          const trainNum = String(xo.trnNumberXO).trim();
          
          return (
            <div 
              key={`${trainNum}-${xo.stnCode}-${idx}`} 
              className={`flex flex-col gap-0.5 text-xs px-2 py-1.5 rounded ${xoType.color} text-white shadow-sm`}
            >
              <div className="flex items-center gap-1">
                <XOIcon className="h-3 w-3" />
                <span className="font-semibold">{xoType.label}: #{trainNum}</span>
              </div>
              <span className="text-[10px] opacity-90">{runDays}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* Desktop Header - Hidden on mobile/tablet */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b border-border sticky top-0 bg-card z-10 px-2">
        <div>Station</div>
        <div>Code</div>
        <div className="font-mono">Arrival (24h)</div>
        <div className="font-mono">Departure (24h)</div>
        <div>Halt</div>
        <div>Distance (km)</div>
        <div>Day</div>
      </div>
      
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-2">
          {/* Halt Station - Responsive Card */}
          <div className="bg-primary/5 hover:bg-primary/10 transition-colors rounded-lg p-3 border border-border/50">
            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-primary font-mono font-bold text-sm">{section.halt.code}</span>
                    <Badge variant="outline" className="text-xs">Day {section.halt.day}</Badge>
                  </div>
                  <h4 className="font-bold text-foreground mt-1 truncate">{section.halt.name}</h4>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  {section.halt.distance.toFixed(1)} km
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono tabular-nums">{section.halt.arrival}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono tabular-nums">{section.halt.departure}</span>
                </div>
                {section.halt.halt !== '--' && (
                  <span className="text-xs text-accent-foreground font-medium bg-accent/30 px-2 py-0.5 rounded">
                    {section.halt.halt}
                  </span>
                )}
              </div>
              
              <XOBadges xoInfo={section.xoInfo} />
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-2 items-center">
              <div className="font-bold text-foreground truncate">{section.halt.name}</div>
              <div className="text-primary font-mono font-bold">{section.halt.code}</div>
              <div className="text-foreground font-mono tabular-nums">{section.halt.arrival}</div>
              <div className="text-foreground font-mono tabular-nums">{section.halt.departure}</div>
              <div className="text-accent-foreground font-semibold">{section.halt.halt}</div>
              <div className="text-muted-foreground">{section.halt.distance.toFixed(1)}</div>
              <div>
                <Badge variant="outline" className="text-xs">Day {section.halt.day}</Badge>
              </div>
            </div>
            
            {/* Desktop XO Badges */}
            <div className="hidden lg:block">
              <XOBadges xoInfo={section.xoInfo} />
            </div>
          </div>

          {/* Intermediate Stations (Expandable) */}
          {section.intermediates.length > 0 && (
            <div className="ml-2 sm:ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(sectionIdx)}
                className="w-full justify-start text-xs text-muted-foreground hover:text-foreground px-2"
              >
                {expandedSections.has(sectionIdx) ? (
                  <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 shrink-0" />
                )}
                <span className="truncate">{section.intermediates.length} intermediate station(s)</span>
              </Button>
              
              {expandedSections.has(sectionIdx) && (
                <div className="ml-2 sm:ml-4 space-y-1.5 animate-fade-in mt-1">
                  {section.intermediates.map((intermediate, idx) => (
                    <div key={idx} className="space-y-1">
                      {/* Mobile/Tablet Intermediate */}
                      <div className="lg:hidden bg-muted/30 rounded-md p-2.5 border border-border/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono text-xs">{intermediate.code}</span>
                              <Badge variant="outline" className="text-[10px] opacity-70">Day {intermediate.day}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mt-0.5 truncate">{intermediate.name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground/70 shrink-0">
                            {intermediate.distance.toFixed(1)} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          <span className="font-mono tabular-nums">{intermediate.arrival}</span>
                          <span>→</span>
                          <span className="font-mono tabular-nums">{intermediate.departure}</span>
                        </div>
                        {intermediate.xoInfo && <XOBadges xoInfo={intermediate.xoInfo} />}
                      </div>

                      {/* Desktop Intermediate */}
                      <div className="hidden lg:block">
                        <div className="grid grid-cols-7 gap-2 py-2 border-b border-border/30 hover:bg-accent/20 transition-colors rounded px-2 text-sm">
                          <div className="text-muted-foreground truncate">{intermediate.name}</div>
                          <div className="text-muted-foreground font-mono">{intermediate.code}</div>
                          <div className="text-muted-foreground font-mono tabular-nums">{intermediate.arrival}</div>
                          <div className="text-muted-foreground font-mono tabular-nums">{intermediate.departure}</div>
                          <div className="text-muted-foreground/70">{intermediate.halt}</div>
                          <div className="text-muted-foreground/70">{intermediate.distance.toFixed(1)}</div>
                          <div>
                            <Badge variant="outline" className="text-xs opacity-70">Day {intermediate.day}</Badge>
                          </div>
                        </div>
                        {intermediate.xoInfo && intermediate.xoInfo.length > 0 && (
                          <div className="ml-2 mb-1">
                            <XOBadges xoInfo={intermediate.xoInfo} />
                          </div>
                        )}
                      </div>
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
