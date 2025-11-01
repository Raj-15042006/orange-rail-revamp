import Papa from 'papaparse';

export interface TrnRow {
  number: string;
  name: string;
  offName: string;
  localName: string;
  hindiName: string;
  fromStnCode: string;
  fromStnName: string;
  toStnCode: string;
  toStnName: string;
  type: string;
  zone: string;
  returnNumber: string;
  classesOffered: string;
  departureDaysOfWeek: string;
  rake: string;
  rakeType: string;
  rakeNotes: string;
  pantry: string;
  pantryNote: string;
  linenBedding: string;
  linenBeddingDet: string;
  polyline: string;
  inaugDateNum: string;
  runDateFromNum: string;
  runDateToNum: string;
  cancelled: string;
  updatedOnNum: string;
}

export interface StnRow {
  code: string;
  name: string;
  offName: string;
  alias: string;
  localName: string;
  zone: string;
  address: string;
  nearestStations: string;
  trackType: string;
  lat: string;
  lng: string;
  priority: string;
  type: string;
  updatedOnNum: string;
}

export interface SchRow {
  number: string;
  stnCode: string;
  km: string;
  arrTime: string;
  depTime: string;
  halt: string;
  dayNum: string;
}

let trnData: TrnRow[] | null = null;
let stnData: StnRow[] | null = null;
let schData: SchRow[] | null = null;
let scheduleIndex: Map<string, SchRow[]> | null = null;

function getDaysOfWeek(dayMask: number): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activeDays: string[] = [];
  for (let i = 0; i < days.length; i++) {
    if ((dayMask >> i) & 1) {
      activeDays.push(days[i]);
    }
  }
  return activeDays;
}

async function loadCSV<T>(path: string): Promise<T[]> {
  const response = await fetch(path);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export async function initCSVData() {
  if (!trnData) {
    trnData = await loadCSV<TrnRow>('/data/Trn.csv');
    console.log(`Loaded ${trnData.length} trains from CSV`);
  }
  
  if (!stnData) {
    stnData = await loadCSV<StnRow>('/data/Stn.csv');
    console.log(`Loaded ${stnData.length} stations from CSV`);
  }
  
  if (!schData) {
    schData = await loadCSV<SchRow>('/data/Sch.csv');
    console.log(`Loaded ${schData.length} schedule entries from CSV`);
    
    // Build index for O(1) schedule lookups
    scheduleIndex = new Map();
    schData.forEach((sch, index) => {
      // Trim whitespace from train number as CSV might have spacing issues
      const trainNumber = String(sch.number).trim();
      
      if (!trainNumber) {
        if (index < 5) console.warn('Empty train number at index', index, sch);
        return;
      }
      
      if (!scheduleIndex!.has(trainNumber)) {
        scheduleIndex!.set(trainNumber, []);
      }
      scheduleIndex!.get(trainNumber)!.push(sch);
    });
    console.log(`Indexed ${scheduleIndex.size} train schedules from ${schData.length} entries`);
    
    // Debug: check if specific train exists
    const sample = scheduleIndex.get('12971');
    if (sample) {
      console.log(`Train 12971 has ${sample.length} stops`);
    } else {
      console.warn('Train 12971 not found in index');
      // Check if data exists with different format
      const found = schData.find(s => String(s.number).includes('12971'));
      if (found) console.log('Found 12971 in raw data:', found);
    }
  }
  
  return { trnData, stnData, schData };
}

export function getTrnData(): TrnRow[] {
  if (!trnData) throw new Error('Train data not initialized');
  return trnData;
}

export function getStnData(): StnRow[] {
  if (!stnData) throw new Error('Station data not initialized');
  return stnData;
}

export function getSchData(): SchRow[] {
  if (!schData) throw new Error('Schedule data not initialized');
  return schData;
}

export function getTrainSchedule(trainNumber: string): SchRow[] {
  if (!scheduleIndex) {
    console.warn('Schedule index not initialized');
    return [];
  }
  
  const trimmedNumber = String(trainNumber).trim();
  const schedule = scheduleIndex.get(trimmedNumber);
  
  if (!schedule) {
    console.warn(`No schedule found for train ${trimmedNumber}. Index has ${scheduleIndex.size} trains`);
  }
  
  return schedule || [];
}

export function getTrainByNumber(trainNumber: string): TrnRow | undefined {
  if (!trnData) throw new Error('Train data not initialized');
  return trnData.find(train => train.number === trainNumber);
}

export function getStationByCode(stationCode: string): StnRow | undefined {
  if (!stnData) throw new Error('Station data not initialized');
  return stnData.find(station => station.code === stationCode);
}

export function searchTrains(from?: string, to?: string, day?: string): TrnRow[] {
  if (!trnData) return [];
  
  return trnData.filter(train => {
    const matchesFrom = !from || 
      train.fromStnCode.toLowerCase().includes(from.toLowerCase()) ||
      train.fromStnName.toLowerCase().includes(from.toLowerCase());
    
    const matchesTo = !to || 
      train.toStnCode.toLowerCase().includes(to.toLowerCase()) ||
      train.toStnName.toLowerCase().includes(to.toLowerCase());
    
    const matchesDay = !day || getDaysOfWeek(parseInt(train.departureDaysOfWeek) || 0).includes(day);
    
    return matchesFrom && matchesTo && matchesDay;
  });
}

export { getDaysOfWeek };
