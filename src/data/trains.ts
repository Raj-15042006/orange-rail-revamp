export interface Station {
  code: string;
  name: string;
  arrival: string;
  departure: string;
  halt: string;
  distance: number;
  day: number;
}

export interface TrainRating {
  railfanning: number;
  cleanliness: number;
  punctuality: number;
  comfort: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  type: 'Express' | 'Superfast' | 'Local' | 'Rajdhani' | 'Shatabdi';
  days: string[];
  classes: string[];
  stops: Station[];
  ratings: TrainRating;
  coachTypes: string[];
  engine: string;
  history: string;
  crossings?: string[];
  overtakes?: string[];
}

export const sampleTrains: Train[] = [
  {
    id: '1',
    number: '12301',
    name: 'Howrah Rajdhani Express',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Howrah',
    toCode: 'HWH',
    departure: '16:55',
    arrival: '10:05',
    duration: '17h 10m',
    type: 'Rajdhani',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A'],
    stops: [
      { code: 'NDLS', name: 'New Delhi', arrival: 'Source', departure: '16:55', halt: '--', distance: 0, day: 1 },
      { code: 'CNB', name: 'Kanpur Central', arrival: '22:50', departure: '22:55', halt: '5m', distance: 441, day: 1 },
      { code: 'MGS', name: 'Mughal Sarai', arrival: '03:15', departure: '03:25', halt: '10m', distance: 764, day: 2 },
      { code: 'DHN', name: 'Dhanbad', arrival: '07:00', departure: '07:05', halt: '5m', distance: 1009, day: 2 },
      { code: 'HWH', name: 'Howrah', arrival: '10:05', departure: 'Destination', halt: '--', distance: 1441, day: 2 }
    ],
    ratings: { railfanning: 4.5, cleanliness: 4.8, punctuality: 4.6, comfort: 4.9 },
    coachTypes: ['1AC', '2AC', '3AC', 'Pantry Car'],
    engine: 'WAP-7 (Primary), WAP-5 (Secondary)',
    history: 'Introduced in 1969, the Howrah Rajdhani is one of India\'s premium train services connecting the capital with Kolkata. It was the first Rajdhani Express service and set standards for speed and comfort.',
    crossings: ['12302 Howrah Rajdhani (Return) at Kanpur', '12951 Mumbai Rajdhani at Mughal Sarai'],
    overtakes: ['12303 Poorva Express at Dhanbad']
  },
  {
    id: '2',
    number: '12951',
    name: 'Mumbai Rajdhani',
    from: 'Mumbai Central',
    fromCode: 'BCT',
    to: 'New Delhi',
    toCode: 'NDLS',
    departure: '16:25',
    arrival: '08:35',
    duration: '16h 10m',
    type: 'Rajdhani',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A'],
    stops: [
      { code: 'BCT', name: 'Mumbai Central', arrival: 'Source', departure: '16:25', halt: '--', distance: 0, day: 1 },
      { code: 'BRC', name: 'Vadodara', arrival: '21:30', departure: '21:35', halt: '5m', distance: 392, day: 1 },
      { code: 'RTM', name: 'Ratlam', arrival: '01:15', departure: '01:20', halt: '5m', distance: 655, day: 2 },
      { code: 'KOTA', name: 'Kota', arrival: '04:45', departure: '04:50', halt: '5m', distance: 912, day: 2 },
      { code: 'NDLS', name: 'New Delhi', arrival: '08:35', departure: 'Destination', halt: '--', distance: 1384, day: 2 }
    ],
    ratings: { railfanning: 4.3, cleanliness: 4.7, punctuality: 4.5, comfort: 4.8 },
    coachTypes: ['1AC', '2AC', '3AC', 'Pantry Car'],
    engine: 'WAP-5 (Primary), WAP-7 (Secondary)',
    history: 'Launched in 1972, this Rajdhani connects India\'s financial capital with the political capital, serving business travelers and tourists with high-speed service.',
    crossings: ['12952 Mumbai Rajdhani (Return) at Vadodara'],
    overtakes: ['12955 Jaipur Superfast at Kota']
  },
  {
    id: '3',
    number: '12002',
    name: 'Bhopal Shatabdi',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Bhopal',
    toCode: 'BPL',
    departure: '06:15',
    arrival: '13:45',
    duration: '7h 30m',
    type: 'Shatabdi',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['CC', 'EC'],
    stops: [
      { code: 'NDLS', name: 'New Delhi', arrival: 'Source', departure: '06:15', halt: '--', distance: 0, day: 1 },
      { code: 'AGC', name: 'Agra Cantt', arrival: '08:40', departure: '08:45', halt: '5m', distance: 195, day: 1 },
      { code: 'GWL', name: 'Gwalior', arrival: '10:15', departure: '10:20', halt: '5m', distance: 319, day: 1 },
      { code: 'JHS', name: 'Jhansi', arrival: '11:45', departure: '11:50', halt: '5m', distance: 415, day: 1 },
      { code: 'BPL', name: 'Bhopal', arrival: '13:45', departure: 'Destination', halt: '--', distance: 707, day: 1 }
    ],
    ratings: { railfanning: 4.2, cleanliness: 4.9, punctuality: 4.8, comfort: 4.7 },
    coachTypes: ['Chair Car', 'Executive Class', 'Pantry Car'],
    engine: 'WAP-7',
    history: 'One of India\'s premium day trains, the Bhopal Shatabdi has been serving passengers since 1988, offering high-speed daytime travel with onboard meals.',
    crossings: ['12001 Bhopal Shatabdi (Return) at Gwalior']
  },
  {
    id: '4',
    number: '12430',
    name: 'Lucknow Express',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Lucknow',
    toCode: 'LKO',
    departure: '22:15',
    arrival: '06:55',
    duration: '8h 40m',
    type: 'Express',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { code: 'NDLS', name: 'New Delhi', arrival: 'Source', departure: '22:15', halt: '--', distance: 0, day: 1 },
      { code: 'CNB', name: 'Kanpur Central', arrival: '03:40', departure: '03:45', halt: '5m', distance: 441, day: 2 },
      { code: 'LKO', name: 'Lucknow', arrival: '06:55', departure: 'Destination', halt: '--', distance: 499, day: 2 }
    ],
    ratings: { railfanning: 3.8, cleanliness: 4.2, punctuality: 4.1, comfort: 4.0 },
    coachTypes: ['1AC', '2AC', '3AC', 'Sleeper', 'General'],
    engine: 'WAP-4',
    history: 'A reliable overnight service connecting Delhi with Lucknow since 1984, popular among business and leisure travelers.',
    crossings: ['12429 Lucknow Express (Return) at Kanpur']
  },
  {
    id: '5',
    number: '12009',
    name: 'Shatabdi Express',
    from: 'Mumbai Central',
    fromCode: 'BCT',
    to: 'Ahmedabad',
    toCode: 'ADI',
    departure: '06:25',
    arrival: '13:00',
    duration: '6h 35m',
    type: 'Shatabdi',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['CC', 'EC'],
    stops: [
      { code: 'BCT', name: 'Mumbai Central', arrival: 'Source', departure: '06:25', halt: '--', distance: 0, day: 1 },
      { code: 'BRC', name: 'Vadodara', arrival: '11:25', departure: '11:30', halt: '5m', distance: 392, day: 1 },
      { code: 'ADI', name: 'Ahmedabad', arrival: '13:00', departure: 'Destination', halt: '--', distance: 491, day: 1 }
    ],
    ratings: { railfanning: 4.0, cleanliness: 4.8, punctuality: 4.7, comfort: 4.6 },
    coachTypes: ['Chair Car', 'Executive Class', 'Pantry Car'],
    engine: 'WAP-5',
    history: 'This premium day service connects Gujarat\'s largest city with Mumbai, serving business travelers since 1991.',
    crossings: ['12010 Shatabdi Express (Return) at Vadodara']
  },
  {
    id: '6',
    number: '22691',
    name: 'Bangalore Rajdhani',
    from: 'Bangalore',
    fromCode: 'SBC',
    to: 'New Delhi',
    toCode: 'NDLS',
    departure: '20:00',
    arrival: '05:55',
    duration: '33h 55m',
    type: 'Rajdhani',
    days: ['Wed', 'Fri', 'Sun'],
    classes: ['1A', '2A', '3A'],
    stops: [
      { code: 'SBC', name: 'Bangalore', arrival: 'Source', departure: '20:00', halt: '--', distance: 0, day: 1 },
      { code: 'GTL', name: 'Guntakal', arrival: '01:30', departure: '01:35', halt: '5m', distance: 330, day: 2 },
      { code: 'SC', name: 'Secunderabad', arrival: '06:15', departure: '06:25', halt: '10m', distance: 612, day: 2 },
      { code: 'NGP', name: 'Nagpur', arrival: '14:55', departure: '15:05', halt: '10m', distance: 1122, day: 2 },
      { code: 'BPL', name: 'Bhopal', arrival: '21:40', departure: '21:45', halt: '5m', distance: 1634, day: 2 },
      { code: 'NDLS', name: 'New Delhi', arrival: '05:55', departure: 'Destination', halt: '--', distance: 2341, day: 3 }
    ],
    ratings: { railfanning: 4.6, cleanliness: 4.7, punctuality: 4.3, comfort: 4.8 },
    coachTypes: ['1AC', '2AC', '3AC', 'Pantry Car'],
    engine: 'WAP-7',
    history: 'Connecting South India with the capital since 1999, this tri-weekly service is known for its scenic route through multiple states.',
    crossings: ['22692 Bangalore Rajdhani (Return) at Nagpur', '12430 Lucknow Express at Bhopal']
  },
  {
    id: '7',
    number: '12621',
    name: 'Tamil Nadu Express',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Chennai',
    toCode: 'MAS',
    departure: '22:30',
    arrival: '07:05',
    duration: '32h 35m',
    type: 'Superfast',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { code: 'NDLS', name: 'New Delhi', arrival: 'Source', departure: '22:30', halt: '--', distance: 0, day: 1 },
      { code: 'AGC', name: 'Agra Cantt', arrival: '01:20', departure: '01:25', halt: '5m', distance: 195, day: 2 },
      { code: 'JHS', name: 'Jhansi', arrival: '04:30', departure: '04:40', halt: '10m', distance: 415, day: 2 },
      { code: 'BPL', name: 'Bhopal', arrival: '08:40', departure: '08:50', halt: '10m', distance: 707, day: 2 },
      { code: 'NGP', name: 'Nagpur', arrival: '15:15', departure: '15:25', halt: '10m', distance: 1078, day: 2 },
      { code: 'BZA', name: 'Vijayawada', arrival: '04:10', departure: '04:15', halt: '5m', distance: 1751, day: 3 },
      { code: 'MAS', name: 'Chennai', arrival: '07:05', departure: 'Destination', halt: '--', distance: 2194, day: 3 }
    ],
    ratings: { railfanning: 4.4, cleanliness: 4.3, punctuality: 4.2, comfort: 4.3 },
    coachTypes: ['1AC', '2AC', '3AC', 'Sleeper', 'General', 'Pantry Car'],
    engine: 'WAP-4 (Primary), WAP-7 (Secondary)',
    history: 'One of India\'s oldest and most iconic trains, running since 1965, connecting the capital with Chennai through the heart of India.',
    crossings: ['12622 Tamil Nadu Express (Return) at Nagpur', '22691 Bangalore Rajdhani at Bhopal'],
    overtakes: ['12615 Grand Trunk Express at Vijayawada']
  },
  {
    id: '8',
    number: '12259',
    name: 'Duronto Express',
    from: 'Sealdah',
    fromCode: 'SDAH',
    to: 'New Delhi',
    toCode: 'NDLS',
    departure: '16:50',
    arrival: '10:25',
    duration: '17h 35m',
    type: 'Express',
    days: ['Mon', 'Wed', 'Fri', 'Sat'],
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { code: 'SDAH', name: 'Sealdah', arrival: 'Source', departure: '16:50', halt: '--', distance: 0, day: 1 },
      { code: 'KOAA', name: 'Kolkata', arrival: '17:15', departure: '17:20', halt: '5m', distance: 8, day: 1 },
      { code: 'ASN', name: 'Asansol', arrival: '20:00', departure: '20:05', halt: '5m', distance: 213, day: 1 },
      { code: 'DHN', name: 'Dhanbad', arrival: '21:15', departure: '21:20', halt: '5m', distance: 260, day: 1 },
      { code: 'MGS', name: 'Mughal Sarai', arrival: '01:30', departure: '01:40', halt: '10m', distance: 632, day: 2 },
      { code: 'NDLS', name: 'New Delhi', arrival: '10:25', departure: 'Destination', halt: '--', distance: 1441, day: 2 }
    ],
    ratings: { railfanning: 4.1, cleanliness: 4.4, punctuality: 4.0, comfort: 4.2 },
    coachTypes: ['1AC', '2AC', '3AC', 'Sleeper', 'Pantry Car'],
    engine: 'WAP-7',
    history: 'Part of the Duronto Express series launched in 2009, offering non-stop express service with limited halts for faster connectivity.',
    crossings: ['12260 Duronto Express (Return) at Asansol', '12301 Howrah Rajdhani at Mughal Sarai']
  }
];
