import { test } from '@playwright/test';
import { CreateBookingPage } from '../../pages/CreateBookingPage';
import { MyBookingsPage } from '../../pages/MyBookingsPage';
import { defaultHotel } from '../../data/bookingData';

const nights = (d: typeof defaultHotel) =>
    Math.round((d.checkOutDate.getTime() - d.checkInDate.getTime()) / 86_400_000);

test.describe('Hotel booking request', () => {

    test('Test case 1: Hotel Booking - Goa with must-haves', async ({ page }) => {
        const createBooking = new CreateBookingPage(page);
        await createBooking.goto_createBooking('hotel');
        await createBooking.fillHotelRequest(defaultHotel);

        await createBooking.expectSummary({
            title: defaultHotel.city.summary,
            departure: `· ${nights(defaultHotel)} nights`,
            budget: `₹${defaultHotel.budgetPerNight.toLocaleString('en-IN')}`,
        });

        await createBooking.submit();
        await createBooking.expectSubmitted();

        const myBookings = new MyBookingsPage(page);
        await myBookings.goto_myBookings();
        await myBookings.selectTypeTab('Hotels');
        await myBookings.expectCardVisible(defaultHotel.city.summary);
    });

});
