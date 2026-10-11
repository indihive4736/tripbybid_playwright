import { type Airport, toLocationPick } from '../data/airports';
import { type CabinClass, type FlightRequest, type TripType } from '../data/bookingData';
import { addDays } from './dates';

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Short unique marker, e.g. "E2E-mg3k1x-4f7q", to find a record the test just created. */
export function uniqueToken(prefix = 'E2E'): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function pick<T>(items: readonly T[]): T {
    return items[randomInt(0, items.length - 1)];
}

/** Two different items, e.g. an origin and a destination. */
export function pickTwoDistinct<T>(items: readonly T[]): [T, T] {
    const first = randomInt(0, items.length - 1);
    let second = randomInt(0, items.length - 2);
    if (second >= first) second++;
    return [items[first], items[second]];
}

const CABIN_CLASSES: readonly CabinClass[] = ['Economy', 'Premium economy', 'Business', 'First'];
const TRIP_TYPES: readonly TripType[] = ['One way', 'Round trip'];
const AIRLINES = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air'];

/** A plausible, randomised flight request between two airports from the list. */
export function randomFlightRequest(pool: readonly Airport[]): FlightRequest {
    const [from, to] = pickTwoDistinct(pool);
    const tripType = pick(TRIP_TYPES);
    const departOffset = randomInt(10, 60);

    return {
        tripType,
        from: toLocationPick(from),
        to: toLocationPick(to),
        departDate: addDays(departOffset),
        returnDate: tripType === 'Round trip' ? addDays(departOffset + randomInt(2, 14)) : undefined,
        budget: randomInt(6, 100) * 500,            // ₹3,000 – ₹50,000 in steps of 500
        adults: randomInt(2, 4),                    // ≥2 so the summary always says "travellers"
        children: randomInt(0, 2),
        infants: randomInt(0, 1),
        cabinClass: pick(CABIN_CLASSES),
        nonStopOnly: Math.random() < 0.5,
        flexibleDates: Math.random() < 0.3,
        preferredAirline: Math.random() < 0.5 ? pick(AIRLINES) : undefined,
        notes: `Automated data-driven test (${from.city} → ${to.city}) - please ignore.`,
    };
}

/** Short human-readable label for test titles and logs. */
export function describeFlight(d: FlightRequest): string {
    const dates = d.returnDate
        ? `${d.departDate.toDateString()} → ${d.returnDate.toDateString()}`
        : d.departDate.toDateString();
    return `${d.from.summary} → ${d.to.summary} | ${d.tripType} | ${dates} | ₹${d.budget} | `
        + `${d.adults}A ${d.children}C ${d.infants}I | ${d.cabinClass}`;
}
