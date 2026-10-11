import { type LocationPick } from './bookingData';

/** One entry of the site's airport reference list. */
export interface Airport {
    iata: string;
    name: string;
    city: string;
    country: string;
    rank: number;
    alt?: string[];
}

/** Subset of the TripByBid airport reference used for data-driven bookings. */
export const airports: Airport[] = [
    { iata: 'BTJ', name: 'Sultan Iskandar Muda International Airport', city: 'Banda Aceh', country: 'ID', rank: 0, alt: ['WIAB'] },
    { iata: 'BND', name: 'Bandar Abbas International Airport', city: 'Bandar Abbas', country: 'IR', rank: 0 },
    { iata: 'BWN', name: 'Brunei International Airport', city: 'Bandar Seri Begawan', country: 'BN', rank: 0 },
    { iata: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'TH', rank: 0, alt: ['Old Bangkok International Airport', 'Old Bangkok', 'Don Muang Royal Thai Air Force Base'] },
    { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'TH', rank: 0 },
    { iata: 'BGF', name: "Bangui M'Poko International Airport", city: 'Bangui', country: 'CF', rank: 0 },
    { iata: 'NKI', name: 'Naukati Bay Seaplane Base', city: 'Tuxekan Island', country: 'US', rank: 3, alt: ['62A', 'Nichin Cove Seaplane Base', 'WNC'] },
    { iata: 'JUK', name: 'Ukkusissat Heliport', city: 'Ukkusissat', country: 'GL', rank: 3 },
    { iata: 'UMD', name: 'Uummannaq Heliport', city: 'Uummannaq', country: 'GL', rank: 3 },
    { iata: 'VRY', name: 'Værøy Heliport', city: 'Værøy', country: 'NO', rank: 3, alt: ['Værøy STOLport'] },
    { iata: 'CXH', name: 'Vancouver Harbour Water Aerodrome', city: 'Vancouver', country: 'CA', rank: 3, alt: ['YHC', 'Vancouver Coal Harbour Seaplane Base'] },
    { iata: 'YWH', name: 'Victoria Harbour Seaplane Base', city: 'Victoria', country: 'CA', rank: 3 },
    { iata: 'KWP', name: 'West Point Village Seaplane Base', city: 'West Point', country: 'US', rank: 3 },
    { iata: 'WSX', name: 'Westsound/WSX Seaplane Base', city: 'West Sound', country: 'US', rank: 3 },
    { iata: 'WWP', name: 'Whale Pass Seaplane Float Harbor Facility', city: 'Whale Pass', country: 'US', rank: 3, alt: ['North Whale SPB', 'North Whale Pass'] },
    { iata: 'YWS', name: 'Whistler/Green Lake Water Aerodrome', city: 'Whistler', country: 'CA', rank: 3, alt: ['AE5'] },
    { iata: 'KZB', name: 'Zachar Bay Seaplane Base', city: 'Zachar Bay', country: 'US', rank: 3 },
];

/**
 * Turns an airport into something the form's autocomplete can pick:
 * type the IATA code, click the option that contains it, expect the code in the summary.
 */
export function toLocationPick(airport: Airport): LocationPick {
    return {
        query: airport.iata,
        option: new RegExp(`\\b${airport.iata}\\b`),
        summary: airport.iata,
    };
}
