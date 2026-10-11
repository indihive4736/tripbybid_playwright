import { test } from '@playwright/test';
import { CreateBookingPage } from '../../pages/CreateBookingPage';
import { MyBookingsPage } from '../../pages/MyBookingsPage';
import { oneWayFlight, roundTripFlight, type FlightRequest } from '../../data/bookingData';
import { airports } from '../../data/airports';
import { formatShort } from '../../utils/dates';
import { describeFlight, randomFlightRequest } from '../../utils/random';

const routeTitle = (d: FlightRequest) => `${d.from.summary} → ${d.to.summary}`;
const travellerCount = (d: FlightRequest) => d.adults + d.children + d.infants;
const departureText = (d: FlightRequest) => d.returnDate
    ? `${formatShort(d.departDate)} → ${formatShort(d.returnDate)}`
    : formatShort(d.departDate);

/** Fills, posts and then confirms the request shows up under the Flights tab. */
async function createFlightBooking(page: import('@playwright/test').Page, d: FlightRequest) {
    const createBooking = new CreateBookingPage(page);
    await createBooking.goto_createBooking('flight');
    await createBooking.fillFlightRequest(d);

    await createBooking.expectSummary({
        title: routeTitle(d),
        departure: departureText(d),
        travellers: `${travellerCount(d)} travellers · ${d.cabinClass}`,
        budget: `₹${d.budget.toLocaleString('en-IN')} / person`,
    });

    await createBooking.submit();
    await createBooking.expectSubmitted();

    const myBookings = new MyBookingsPage(page);
    await myBookings.goto_myBookings();
    await myBookings.selectTypeTab('Flights');
    await myBookings.expectCardVisible(routeTitle(d));
}

test.describe('Flight booking request', () => {

    test('Test case 1: Flight Booking - one way', async ({ page }) => {
        await createFlightBooking(page, oneWayFlight);
    });

    test('Test case 2: Flight Booking - round trip', async ({ page }) => {
        await createFlightBooking(page, roundTripFlight);
    });

});

/**
 * Data-driven: generates FLIGHT_BOOKING_COUNT (default 3) requests with random
 * airports, dates, budget, passengers and cabin class from data/airports.ts.
 * Each one creates a real record. The generated data is attached to the report.
 *
 * Titles must be deterministic (Playwright loads this file once per worker), so the
 * random request is built inside the test body, not in the title.
 */
const BOOKING_COUNT = Number(process.env.FLIGHT_BOOKING_COUNT ?? 3);

test.describe('Flight booking request - data driven', () => {

    for (let i = 1; i <= BOOKING_COUNT; i++) {
        test(`Test case ${i}: Random flight booking #${i}`, async ({ page }) => {
            const request = randomFlightRequest(airports);
            test.info().annotations.push({ type: 'request', description: describeFlight(request) });
            console.log(`[random flight #${i}] ${describeFlight(request)}`);
            await createFlightBooking(page, request);
        });
    }

});
