export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  type: 'Express' | 'Superfast' | 'Local' | 'Rajdhani' | 'Shatabdi';
  days: string[];
  classes: string[];
}

export const sampleTrains: Train[] = [
  {
    id: '1',
    number: '12301',
    name: 'Howrah Rajdhani Express',
    from: 'New Delhi',
    to: 'Howrah',
    departure: '16:55',
    arrival: '10:05',
    duration: '17h 10m',
    type: 'Rajdhani',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A']
  },
  {
    id: '2',
    number: '12951',
    name: 'Mumbai Rajdhani',
    from: 'Mumbai Central',
    to: 'New Delhi',
    departure: '16:25',
    arrival: '08:35',
    duration: '16h 10m',
    type: 'Rajdhani',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A']
  },
  {
    id: '3',
    number: '12002',
    name: 'Bhopal Shatabdi',
    from: 'New Delhi',
    to: 'Bhopal',
    departure: '06:15',
    arrival: '13:45',
    duration: '7h 30m',
    type: 'Shatabdi',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['CC', 'EC']
  },
  {
    id: '4',
    number: '12430',
    name: 'Lucknow Express',
    from: 'New Delhi',
    to: 'Lucknow',
    departure: '22:15',
    arrival: '06:55',
    duration: '8h 40m',
    type: 'Express',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '5',
    number: '12009',
    name: 'Shatabdi Express',
    from: 'Mumbai Central',
    to: 'Ahmedabad',
    departure: '06:25',
    arrival: '13:00',
    duration: '6h 35m',
    type: 'Shatabdi',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['CC', 'EC']
  },
  {
    id: '6',
    number: '22691',
    name: 'Bangalore Rajdhani',
    from: 'Bangalore',
    to: 'New Delhi',
    departure: '20:00',
    arrival: '05:55',
    duration: '33h 55m',
    type: 'Rajdhani',
    days: ['Wed', 'Fri', 'Sun'],
    classes: ['1A', '2A', '3A']
  },
  {
    id: '7',
    number: '12621',
    name: 'Tamil Nadu Express',
    from: 'New Delhi',
    to: 'Chennai',
    departure: '22:30',
    arrival: '07:05',
    duration: '32h 35m',
    type: 'Superfast',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL']
  },
  {
    id: '8',
    number: '12259',
    name: 'Duronto Express',
    from: 'Sealdah',
    to: 'New Delhi',
    departure: '16:50',
    arrival: '10:25',
    duration: '17h 35m',
    type: 'Express',
    days: ['Mon', 'Wed', 'Fri', 'Sat'],
    classes: ['1A', '2A', '3A', 'SL']
  }
];
