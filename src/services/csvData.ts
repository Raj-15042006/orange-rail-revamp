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
  trnNumber: string;
  stnCode: string;
  type: string;
  note: string;
  trackType: string;
  arrTime: string;
  depTime: string;
  dayNum: string;
  pfNum: string;
  km: string;
}

export interface XORow {
  trnNumber: string;
  stnCode: string;
  trnNumberXO: string;
  type: string;
  departureDaysOfWeek: string;
  updatedOnNum: string;
}

// Cached data and indices
let trnData: TrnRow[] | null = null;
let stnData: StnRow[] | null = null;
let schData: SchRow[] | null = null;
let xoData: XORow[] | null = null;

// Optimized indices for O(1) lookups
let scheduleIndex: Map<string, SchRow[]> | null = null;
let xoIndex: Map<string, XORow[]> | null = null;
let trainIndex: Map<string, TrnRow> | null = null;
let stationIndex: Map<string, StnRow> | null = null;

// Loading state to prevent duplicate loads
let isLoading = false;
let loadPromise: Promise<{
  trnData: TrnRow[];
  stnData: StnRow[];
  schData: SchRow[];
  xoData: XORow[];
}> | null = null;

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

// Build all indices in a single pass for better performance
function buildIndices() {
  if (trnData && !trainIndex) {
    trainIndex = new Map();
    trnData.forEach(train => {
      const num = String(train.number).trim();
      if (num) trainIndex!.set(num, train);
    });
    console.log(`Indexed ${trainIndex.size} trains`);
  }

  if (stnData && !stationIndex) {
    stationIndex = new Map();
    stnData.forEach(station => {
      const code = String(station.code).trim();
      if (code) stationIndex!.set(code, station);
    });
    console.log(`Indexed ${stationIndex.size} stations`);
  }

  if (schData && !scheduleIndex) {
    scheduleIndex = new Map();
    schData.forEach((sch) => {
      const trainNumber = String(sch.trnNumber).trim();
      if (!trainNumber) return;
      
      if (!scheduleIndex!.has(trainNumber)) {
        scheduleIndex!.set(trainNumber, []);
      }
      scheduleIndex!.get(trainNumber)!.push(sch);
    });
    console.log(`Indexed ${scheduleIndex.size} train schedules`);
  }

  if (xoData && !xoIndex) {
    xoIndex = new Map();
    xoData.forEach((xo) => {
      const trainNumber = String(xo.trnNumber).trim();
      if (!trainNumber) return;
      
      if (!xoIndex!.has(trainNumber)) {
        xoIndex!.set(trainNumber, []);
      }
      xoIndex!.get(trainNumber)!.push(xo);
    });
    console.log(`Indexed ${xoIndex.size} train crossings/overtakes with ${xoData.length} total entries`);
  }
}

export async function initCSVData() {
  // Return cached data if already loaded
  if (trnData && stnData && schData && xoData) {
    return { trnData, stnData, schData, xoData };
  }

  // Return existing promise if already loading
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  
  loadPromise = (async () => {
    try {
      // Load all CSVs in parallel for faster initialization
      const [trains, stations, schedules, crossings] = await Promise.all([
        trnData ? Promise.resolve(trnData) : loadCSV<TrnRow>('/data/Trn.csv'),
        stnData ? Promise.resolve(stnData) : loadCSV<StnRow>('/data/Stn.csv'),
        schData ? Promise.resolve(schData) : loadCSV<SchRow>('/data/Sch.csv'),
        xoData ? Promise.resolve(xoData) : loadCSV<XORow>('/data/XO.csv').catch(() => [] as XORow[]),
      ]);

      trnData = trains;
      stnData = stations;
      schData = schedules;
      xoData = crossings;

      console.log(`Loaded ${trnData.length} trains, ${stnData.length} stations, ${schData.length} schedules, ${xoData.length} XO entries`);

      // Build all indices after loading
      buildIndices();

      return { trnData, stnData, schData, xoData };
    } finally {
      isLoading = false;
    }
  })();

  return loadPromise;
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

export function getXOData(): XORow[] {
  if (!xoData) throw new Error('XO data not initialized');
  return xoData;
}

export function getTrainXO(trainNumber: string): XORow[] {
  if (!xoIndex) {
    console.warn('XO index not initialized');
    return [];
  }
  
  const trimmedNumber = String(trainNumber).trim();
  return xoIndex.get(trimmedNumber) || [];
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
  if (!trainIndex) {
    if (!trnData) throw new Error('Train data not initialized');
    // Fallback to linear search if index not built
    return trnData.find(train => train.number === trainNumber);
  }
  return trainIndex.get(String(trainNumber).trim());
}

export function getStationByCode(stationCode: string): StnRow | undefined {
  if (!stationIndex) {
    if (!stnData) throw new Error('Station data not initialized');
    // Fallback to linear search if index not built
    return stnData.find(station => station.code === stationCode);
  }
  return stationIndex.get(String(stationCode).trim());
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
