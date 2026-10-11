import { type RequestType } from '../pages/CreateBookingPage';
import { pick, randomInt } from '../utils/random';

export type BidValidity = 'keep' | '24h' | '48h' | '72h' | '7d';
/** Option *values* of the "You’ll book" select (labels read "Within 24 hours", "Flexible"). */
export type BidTimeline =
    | 'Booking within 24 hours'
    | 'Booking within 48 hours'
    | 'Booking within 72 hours'
    | 'Flexible timeline';

export interface BidData {
    price: number;
    inclusions: string[];
    customInclusion?: string;
    cancellationPolicy: string;
    headline?: string;
    validity?: BidValidity;
    timeline: BidTimeline;
    note?: string;
}

/** Inclusion chips and cancellation policies the bid drawer offers per trip type. */
export const BID_OPTIONS: Record<RequestType, { inclusions: string[]; policies: string[] }> = {
    flight: {
        inclusions: ['15 kg check-in', 'Meal included', 'Seat selection', 'Free date change'],
        policies: ['Flexible', 'Saver (non-refundable)', 'Standard'],
    },
    train: {
        inclusions: ['Confirmed berth', 'Meals', 'Tatkal backup', 'Station pickup'],
        policies: ['Standard', 'Tatkal (non-refundable)'],
    },
    hotel: {
        inclusions: ['Breakfast', 'Airport transfer', 'Late checkout', 'Free cancellation'],
        policies: ['Flexible (24h)', 'Flexible (7 days)', 'Non-refundable'],
    },
};

const TIMELINES: readonly BidTimeline[] = [
    'Booking within 24 hours', 'Booking within 48 hours', 'Booking within 72 hours', 'Flexible timeline',
];
const VALIDITIES: readonly BidValidity[] = ['24h', '48h', '72h', '7d'];

/** The site accepts bids between 40% and 10× of the traveller's budget. */
export const minBidFor = (budget: number) => Math.ceil(budget * 0.4);

/** A valid bid at 60–95% of the traveller's budget with random extras. */
export function randomBid(type: RequestType, travellerBudget: number): BidData {
    const options = BID_OPTIONS[type];
    const price = Math.max(minBidFor(travellerBudget), Math.round((travellerBudget * randomInt(60, 95)) / 100 / 50) * 50);
    const inclusions = options.inclusions.filter(() => Math.random() < 0.5);

    return {
        price,
        inclusions,
        cancellationPolicy: pick(options.policies),
        headline: `Best ${type} deal - automated test bid`,
        validity: pick(VALIDITIES),
        timeline: pick(TIMELINES),
        note: 'Automated test bid - please ignore.',
    };
}
