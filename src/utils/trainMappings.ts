// Zone code mappings (numeric to abbreviation)
export const ZONE_MAPPINGS: Record<string, string> = {
  '1': 'CR',      // Central Railway
  '2': 'ECR',     // East Central Railway
  '3': 'ECoR',    // East Coast Railway
  '4': 'ER',      // Eastern Railway
  '5': 'NCR',     // North Central Railway
  '6': 'NER',     // North Eastern Railway
  '7': 'NFR',     // Northeast Frontier Railway
  '8': 'NR',      // Northern Railway
  '9': 'NWR',     // North Western Railway
  '10': 'SCR',    // South Central Railway
  '11': 'SECR',   // South East Central Railway
  '12': 'SER',    // South Eastern Railway
  '13': 'SWR',    // South Western Railway
  '14': 'SR',     // Southern Railway
  '15': 'WCR',    // West Central Railway
  '16': 'WR',     // Western Railway
  '17': 'KR',     // Konkan Railway
  '18': 'Metro',  // Metro Railway
};

export const ZONE_FULL_NAMES: Record<string, string> = {
  'CR': 'Central Railway',
  'ECR': 'East Central Railway',
  'ECoR': 'East Coast Railway',
  'ER': 'Eastern Railway',
  'NCR': 'North Central Railway',
  'NER': 'North Eastern Railway',
  'NFR': 'Northeast Frontier Railway',
  'NR': 'Northern Railway',
  'NWR': 'North Western Railway',
  'SCR': 'South Central Railway',
  'SECR': 'South East Central Railway',
  'SER': 'South Eastern Railway',
  'SWR': 'South Western Railway',
  'SR': 'Southern Railway',
  'WCR': 'West Central Railway',
  'WR': 'Western Railway',
  'KR': 'Konkan Railway',
  'Metro': 'Metro Railway',
};

// Train type mappings (numeric to text)
export const TRAIN_TYPE_MAPPINGS: Record<string, string> = {
  '1': 'Rajdhani',
  '2': 'Shatabdi',
  '3': 'Duronto',
  '4': 'Garib Rath',
  '5': 'Jan Shatabdi',
  '6': 'Express',
  '7': 'Mail',
  '8': 'Passenger',
  '9': 'MEMU',
  '10': 'DEMU',
  '11': 'EMU/Local',
  '12': 'Humsafar',
  '13': 'Tejas',
  '14': 'Gatimaan',
  '15': 'Antyodaya',
  '16': 'Uday',
  '17': 'Kavi Guru',
  '18': 'Vande Bharat',
  '19': 'Yuva',
  '20': 'Double Decker',
  '21': 'Sampark Kranti',
  '22': 'Sampark Kranti SF',
  '23': 'Premium',
  '24': 'SF Express',
  '25': 'Special',
  '26': 'Tejas Rajdhani',
  '27': 'Vistadome',
  '28': 'Heritage',
};

// Rake type mappings (numeric to text)
export const RAKE_TYPE_MAPPINGS: Record<string, string> = {
  '0': 'ICF',
  '1': 'LHB',
  '2': 'MEMU',
  '3': 'Vande Bharat',
  '4': 'DEMU',
  '5': 'EMU',
  '6': 'ICF Non-AC',
  '7': 'LHB AC',
  '8': 'Push-Pull',
};

export const RAKE_TYPE_DESCRIPTIONS: Record<string, string> = {
  'ICF': 'Integral Coach Factory (Conventional)',
  'LHB': 'Linke Hofmann Busch (Modern)',
  'MEMU': 'Mainline Electric Multiple Unit',
  'Vande Bharat': 'Semi High-Speed Train-18/20',
  'DEMU': 'Diesel Electric Multiple Unit',
  'EMU': 'Electric Multiple Unit',
  'ICF Non-AC': 'ICF Non-AC Coaches',
  'LHB AC': 'LHB Full AC Rake',
  'Push-Pull': 'Push-Pull Configuration',
};

export function getZoneCode(zoneNumber: string): string {
  return ZONE_MAPPINGS[zoneNumber] || zoneNumber;
}

export function getZoneFullName(zoneCode: string): string {
  return ZONE_FULL_NAMES[zoneCode] || zoneCode;
}

export function getTrainType(typeNumber: string): string {
  return TRAIN_TYPE_MAPPINGS[typeNumber] || `Type ${typeNumber}`;
}

export function getRakeType(rakeTypeNumber: string): string {
  return RAKE_TYPE_MAPPINGS[rakeTypeNumber] || rakeTypeNumber;
}

export function getRakeTypeDescription(rakeType: string): string {
  return RAKE_TYPE_DESCRIPTIONS[rakeType] || '';
}
