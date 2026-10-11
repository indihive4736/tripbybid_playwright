import { test } from '@playwright/test';
import { CreateBookingPage } from '../../pages/CreateBookingPage';
import { roundTripFlight } from '../../data/bookingData';

/** Submitting an empty form never creates a booking; validation stops it. */
test.describe('Create booking validation', () => {

    test('Test case 1: Empty flight request shows required-field errors', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('flight');
        await createBooking.submit();
        await createBooking.expectValidationError('From location is required');
        await createBooking.expectValidationError('To location is required');
        await createBooking.expectValidationError('Departure date is required');
    });

    // The return-date rule only fires once the basic fields are valid, so fill everything else
    test('Test case 2: Round trip without return date shows error', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('flight');
        await createBooking.fillFlightRequest({ ...roundTripFlight, returnDate: undefined });
        await createBooking.submit();
        await createBooking.expectValidationError('Return date is required for round trips');
    });

    test('Test case 3: Empty train request shows required-field errors', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('train');
        await createBooking.submit();
        await createBooking.expectValidationError('From station is required');
        await createBooking.expectValidationError('To station is required');
        await createBooking.expectValidationError('Journey date is required');
    });

    test('Test case 4: Empty hotel request shows required-field errors', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('hotel');
        await createBooking.submit();
        await createBooking.expectValidationError('City is required');
        await createBooking.expectValidationError('Check-in date is required');
    });

});
