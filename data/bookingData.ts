import { addDays } from '../utils/dates';

export type CabinClass = 'Economy' | 'Premium economy' | 'Business' | 'First';
export type TripType = 'One way' | 'Round trip' | 'Multi-city';
export type TrainClass = 'Sleeper' | 'AC 3-tier' | 'AC 2-tier' | 'AC 1st' | 'First class' | 'Second class' | 'General';

/** A location to pick from the autocomplete: what to type and which option to click. */
export interface LocationPick {
    query: string;
    option: RegExp;
    /** Text the request summary shows once picked (e.g. the IATA code) */
    summary: string;
}

export interface FlightRequest {
    tripType: TripType;
    from: LocationPick;
    to: LocationPick;
    departDate: Date;
    returnDate?: Date;
    budget: number;
    adults: number;
    children: number;
    infants: number;
    cabinClass: CabinClass;
    nonStopOnly?: boolean;
    flexibleDates?: boolean;
    preferredAirline?: string;
    notes?: string;
}

export interface TrainRequest {
    from: LocationPick;
    to: LocationPick;
    journeyDate: Date;
    budget: number;
    adults: number;
    children: number;
    seniors: number;
    trainClass: TrainClass;
    travelInsurance?: boolean;
    quota?: string;
    berth?: string;
    food?: string;
    preferredDepartureTime?: string;
    notes?: string;
}

export interface HotelRequest {
    city: LocationPick;
    checkInDate: Date;
    checkOutDate: Date;
    budgetPerNight: number;
    rooms: number;
    adults: number;
    children: number;
    mustHaves?: string[];
    roomType?: string;
    bedPreference?: string;
    starRating?: string;
    cancellationPolicy?: string;
    preferredArea?: string;
    notes?: string;
}

export const airports = {
    delhi: { query: 'Del', option: /^New Delhi DEL/, summary: 'DEL' },
    mumbai: { query: 'Mum', option: /^Mumbai BOM/, summary: 'BOM' },
} satisfies Record<string, LocationPick>;

export const stations = {
    newDelhi: { query: 'NEW DELHI', option: /^NEW DELHI NDLS/, summary: 'NDLS' },
    mumbaiCentral: { query: 'MUMBAI CENTRAL', option: /^MUMBAI CENTRAL/, summary: 'MUMBAI CENTRAL' },
} satisfies Record<string, LocationPick>;

export const cities = {
    goa: { query: 'Goa', option: /^Vasco da Gama/, summary: 'Vasco da Gama' },
} satisfies Record<string, LocationPick>;

export const oneWayFlight: FlightRequest = {
    tripType: 'One way',
    from: airports.delhi,
    to: airports.mumbai,
    departDate: addDays(20),
    budget: 9000,
    adults: 2,
    children: 1,
    infants: 0,
    cabinClass: 'Business',
    preferredAirline: 'IndiGo',
    notes: 'Automated test request - please ignore.',
};

export const roundTripFlight: FlightRequest = {
    ...oneWayFlight,
    tripType: 'Round trip',
    returnDate: addDays(25),
    cabinClass: 'Economy',
    nonStopOnly: true,
};

export const defaultTrain: TrainRequest = {
    from: stations.newDelhi,
    to: stations.mumbaiCentral,
    journeyDate: addDays(10),
    budget: 1500,
    adults: 2,
    children: 0,
    seniors: 1,
    trainClass: 'AC 3-tier',
    travelInsurance: true,
    quota: 'Tatkal',
    berth: 'Lower',
    food: 'Vegetarian',
    preferredDepartureTime: '18:30',
    notes: 'Automated test request - please ignore.',
};

export const defaultHotel: HotelRequest = {
    city: cities.goa,
    checkInDate: addDays(20),
    checkOutDate: addDays(23),
    budgetPerNight: 4000,
    rooms: 1,
    adults: 2,
    children: 0,
    mustHaves: ['Breakfast included', 'WiFi'],
    roomType: 'Deluxe',
    bedPreference: 'King',
    starRating: '4 stars',
    cancellationPolicy: 'Free cancellation',
    preferredArea: 'Near Baga beach',
    notes: 'Automated test request - please ignore.',
};
