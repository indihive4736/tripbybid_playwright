import { test } from '@playwright/test';
import { CreateBookingPage } from '../../pages/CreateBookingPage';
import { MyBookingsPage } from '../../pages/MyBookingsPage';
import { defaultTrain } from '../../data/bookingData';
import { formatShort } from '../../utils/dates';

test.describe('Train booking request', () => {

    test('Test case 1: Train Booking - AC 3-tier with preferences', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('train');
        await createBooking.fillTrainRequest(defaultTrain);

        await createBooking.expectSummary({
            departure: formatShort(defaultTrain.journeyDate),
            travellers: `${defaultTrain.adults + defaultTrain.children + defaultTrain.seniors} travellers`,
            budget: `₹${defaultTrain.budget.toLocaleString('en-IN')} / person`,
        });

        await createBooking.submit();
        await createBooking.expectSubmitted();

        const myBookings = new MyBookingsPage(page);
        await myBookings.goto_myBookings();
        await myBookings.selectTypeTab('Trains');
        await myBookings.expectCardMatching(new RegExp(defaultTrain.from.summary, 'i'));
    });

});
